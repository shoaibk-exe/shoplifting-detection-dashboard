import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prismaDb";

function cameraToResponse(camera: any) {
  return {
    id: camera.id,
    name: camera.cameraModel || `Camera ${camera.id}`,
    processed_url: camera.processedUrl || "",
    status: camera.cameraStatus || "Unknown",
    rtsp_url: camera.cameraIp || "",
  };
}

// Cache for 30 seconds
export const revalidate = 30;

export async function GET() {
  try {
    // Optimize query - only select needed fields
    // Order by ID ascending for consistent sequential numbering in UI
    const cameras = await prisma.camera.findMany({
      select: {
        id: true,
        cameraModel: true,
        cameraIp: true,
        cameraStatus: true,
        processedUrl: true,
        createdAt: true,
      },
      orderBy: { id: "asc" },
    });

    const response = NextResponse.json({
      success: true,
      cameras: cameras.map(cameraToResponse),
      count: cameras.length,
    });

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

    return response;
  } catch (error: any) {
    console.error("Failed to fetch cameras:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cameras",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rtsp_url } = body || {};

    if (!name || !rtsp_url) {
      return NextResponse.json(
        { success: false, error: "Camera name and RTSP link are required" },
        { status: 400 }
      );
    }

    const camera = await prisma.camera.create({
      data: {
        cameraModel: name,
        cameraLocation: name,
        cameraIp: rtsp_url,
        cameraStatus: "Active",
        cameraUsername: "",
        cameraPassword: "",
      },
    });

    return NextResponse.json(
      {
        success: true,
        camera: cameraToResponse(camera),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create camera:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create camera",
        details: error?.message || error?.code || "Unknown error",
      },
      { status: 500 }
    );
  }
}
