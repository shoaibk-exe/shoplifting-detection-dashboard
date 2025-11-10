import { NextResponse, NextRequest } from "next/server";

const PYTHON_API_BASE =
  process.env.PYTHON_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5555";
const PYTHON_BACKEND_URL = `${PYTHON_API_BASE}/api/debug/camera_config`;

// GET - Fetch camera config directly from Python API
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

    if (!data?.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from Python API",
          cameras: {},
          summary: null,
          gpuInfo: null,
        },
        { status: 502 }
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
    const isAbort = error?.name === "AbortError";
    console.error("Error fetching camera config from Python API:", error);

    return NextResponse.json(
      {
        success: false,
        error: isAbort ? "Python API request timed out" : (error?.message || "Failed to fetch camera config from Python API"),
        cameras: {},
        summary: null,
        gpuInfo: null,
      },
      { status: 502 }
    );
  }
}

