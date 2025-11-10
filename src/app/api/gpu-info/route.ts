import { NextResponse, NextRequest } from "next/server";

const PYTHON_API_BASE =
  process.env.PYTHON_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5555";
const PYTHON_BACKEND_URL = `${PYTHON_API_BASE}/api/debug/camera_config`;

// GET - Fetch GPU info directly from Python API
export async function GET(req: NextRequest) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(PYTHON_BACKEND_URL, {
      cache: "no-store",
      next: { revalidate: 0 },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Python API responded with status: ${res.status}${text ? ` - ${text}` : ""}`
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
        { status: 502 }
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

    return NextResponse.json(
      {
        success: true,
        gpuInfo: gpuInfo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const isAbort = error?.name === "AbortError";
    console.error("Error fetching GPU info from Python API:", error);

    return NextResponse.json(
      {
        success: false,
        error: isAbort ? "Python API request timed out" : (error?.message || "Failed to fetch GPU info from Python API"),
        gpuInfo: null,
      },
      { status: 502 }
    );
  }
}

