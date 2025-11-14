import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prismaDb";

const PYTHON_API_BASE =
  process.env.PYTHON_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5555";
// Support both /api/camera-config and /api/debug/camera_config
const PYTHON_BACKEND_URL = `${PYTHON_API_BASE}/api/camera-config`;

// Cache for 10 seconds (Python API data changes frequently)
export const revalidate = 10;

// GET - Fetch camera config directly from Python API
export async function GET(req: NextRequest) {
  try {
    // Fail fast - 1 second timeout max
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);

    const res = await Promise.race([
      fetch(PYTHON_BACKEND_URL, {
        cache: "no-store",
        next: { revalidate: 10 },
        signal: controller.signal,
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 1000)
      ),
    ]);
    
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Python API responded with status: ${res.status}${text ? ` - ${text}` : ""}`
      );
    }

    const data = await res.json();

    if (!data?.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from Python API",
          cameras: [],
          summary: null,
          gpuInfo: null,
        },
        { status: 502 }
      );
    }

    // Return the full camera config data
    // Handle both array and object formats for cameras
    const cameras = Array.isArray(data.cameras) 
      ? data.cameras 
      : (typeof data.cameras === 'object' && data.cameras !== null 
          ? Object.values(data.cameras) 
          : []);

    const response = NextResponse.json(
      {
        success: true,
        cameras: cameras,
        summary: data.summary || null,
        gpuInfo: data.gpu_info || null,
        statusBreakdown: data.status_breakdown || null,
        systemInfo: data.system_info || null,
      },
      { status: 200 }
    );

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');

    return response;
  } catch (error: any) {
    // Fail fast - don't wait for database updates
    // Return cached/empty response immediately
    console.debug("camera-config: Python API unavailable, returning empty payload");
    
    // Don't block on database update - do it in background if needed
    // Mark cameras OFFLINE asynchronously (non-blocking)
    prisma.camera.updateMany({
      data: { cameraStatus: "OFFLINE" },
    }).catch(() => {
      // Silently fail - don't block response
    });
    // Return success=true with empty payload and let UI show offline placeholders
    const response = NextResponse.json(
      {
        success: true,
        cameras: [],
        summary: null,
        gpuInfo: null,
        statusBreakdown: null,
        systemInfo: null,
      },
      { status: 200 }
    );

    // Cache error responses for shorter time
    response.headers.set('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=10');

    return response;
  }
}

