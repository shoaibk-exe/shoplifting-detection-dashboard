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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid camera id" }, { status: 400 });
    }

    const body = await req.json();
    const updates: any = {};
    if (body?.name) updates.cameraModel = body.name;
    if (body?.rtsp_url) updates.cameraIp = body.rtsp_url;
    if (body?.status) updates.cameraStatus = body.status;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
    }

    const camera = await prisma.camera.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({
      success: true,
      camera: cameraToResponse(camera),
    });
  } catch (error: any) {
    console.error("Failed to update camera:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update camera",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid camera id" }, { status: 400 });
    }

    await prisma.camera.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete camera:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete camera",
      },
      { status: 500 }
    );
  }
}

