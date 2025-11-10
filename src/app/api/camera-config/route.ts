import { NextResponse, NextRequest } from "next/server";

const PYTHON_BACKEND_URL = 'http://localhost:5555/api/debug/camera_config';

// GET - Fetch camera config directly from Python API
export async function GET(req: NextRequest) {
  try {
    const res = await fetch(PYTHON_BACKEND_URL, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Python API responded with status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from Python API",
          cameras: {},
          summary: null,
          gpuInfo: null,
        },
        { status: 500 }
      );
    }

    // Return the full camera config data
    return NextResponse.json(
      {
        success: true,
        cameras: data.cameras || {},
        summary: data.summary || null,
        gpuInfo: data.gpu_info || null,
        statusBreakdown: data.status_breakdown || null,
        systemInfo: data.system_info || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching camera config from Python API:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch camera config from Python API",
        cameras: {},
        summary: null,
        gpuInfo: null,
      },
      { status: 500 }
    );
  }
}

