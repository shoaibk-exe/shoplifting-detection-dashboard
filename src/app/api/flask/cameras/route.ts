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

export async function GET() {
  try {
    const cameras = await prisma.camera.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      cameras: cameras.map(cameraToResponse),
      count: cameras.length,
    });
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
