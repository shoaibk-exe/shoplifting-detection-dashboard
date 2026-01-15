import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prismaDb";

const PYTHON_API_BASE =
  process.env.PYTHON_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5555";
const PYTHON_BACKEND_URL = `${PYTHON_API_BASE}/api/debug/camera_config`;

// Cache for 15 seconds
export const revalidate = 15;

// GET - Fetch GPU info directly from Python API
export async function GET(req: NextRequest) {
  try {
    // Fail fast - 1 second timeout max
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);

    const res = await Promise.race([
      fetch(PYTHON_BACKEND_URL, {
        cache: "no-store",
        next: { revalidate: 15 },
        signal: controller.signal,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 1000),
      ),
    ]);

    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Python API responded with status: ${res.status}${text ? ` - ${text}` : ""}`,
      );
    }

    const data = await res.json();

    if (!data?.success || !data?.gpu_info) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from Python API",
          gpuInfo: null,
        },
        { status: 502 },
      );
    }

    // Transform Python API response to match expected format
    const gpuInfo = {
      utilizationPercent: data.gpu_info.utilization_percent,
      memoryStatus: data.gpu_info.memory_status,
      allocatedGB: data.gpu_info.allocated_gb,
      reservedGB: data.gpu_info.reserved_gb,
      available: data.gpu_info.available,
      createdAt: new Date().toISOString(), // Use current time since API doesn't provide this
    };

    const response = NextResponse.json(
      {
        success: true,
        gpuInfo: gpuInfo,
      },
      { status: 200 },
    );

    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=15, stale-while-revalidate=30",
    );

    return response;
  } catch (error: any) {
    // Fail fast - don't wait for database updates
    console.debug("gpu-info: Python API unavailable, returning null gpuInfo");

    // Don't block on database update - do it in background if needed
    // Mark cameras OFFLINE asynchronously (non-blocking)
    // prisma.camera
    //   .updateMany({
    //     data: { cameraStatus: "OFFLINE" },
    //   })
    //   .catch(() => {
    //     // Silently fail - don't block response
    //   });
    // Return neutral GPU info (unavailable) with 200 to avoid UI error states
    const response = NextResponse.json(
      {
        success: true,
        gpuInfo: null,
      },
      { status: 200 },
    );

    // Cache error responses for shorter time
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=5, stale-while-revalidate=10",
    );

    return response;
  }
}
