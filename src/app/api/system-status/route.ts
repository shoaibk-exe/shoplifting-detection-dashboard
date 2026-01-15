import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prismaDb";

const PYTHON_API_BASE =
  process.env.PYTHON_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5555";
const PYTHON_BACKEND_URL = `${PYTHON_API_BASE}/api/debug/camera_config`;

// GET - Fetch system status directly from Python API
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

    if (!data?.success || !data?.summary) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from Python API",
          status: null,
        },
        { status: 502 }
      );
    }

    // Transform Python API response to match expected format
    const systemStatus = {
      totalCameras: data.summary.total_cameras,
      liveCamerasCount: data.summary.live_cameras_count,
      degradedCount: data.summary.degraded_cameras_count,
      offlineCount: data.summary.offline_cameras_count,
      overallHealth: data.summary.overall_health,
      statusSummary: data.summary.status_summary,
      timestamp: data.summary.timestamp,
    };

    return NextResponse.json(
      {
        success: true,
        status: systemStatus,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const isAbort = error?.name === "AbortError";
    // Quiet fallback: avoid noisy console errors when Python API is down
    console.debug("system-status: Python API unavailable, falling back to OFFLINE state");
    // // Mark all cameras offline in DB
    // try {
    //   await prisma.camera.updateMany({
    //     data: { cameraStatus: "OFFLINE" },
    //   });
    // } catch (e) {
    //   console.error("Failed to set cameras OFFLINE:", e);
    // }
    // Derive counts from DB to avoid frontend errors
    try {
      const total = await prisma.camera.count();
      const offlineCount = total;
      const status = {
        totalCameras: total,
        liveCamerasCount: 0,
        degradedCount: 0,
        offlineCount,
        overallHealth: total > 0 ? "CRITICAL" : "OK",
        statusSummary: `0 Live, ${offlineCount} Offline, 0 Degraded`,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, status }, { status: 200 });
    } catch {
      return NextResponse.json(
        { success: true, status: null },
        { status: 200 }
      );
    }
  }
}

