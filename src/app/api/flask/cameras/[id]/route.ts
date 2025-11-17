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

    // Check if camera exists
    const existingCamera = await prisma.camera.findUnique({
      where: { id },
    });

    if (!existingCamera) {
      return NextResponse.json({ success: false, error: "Camera not found" }, { status: 404 });
    }

    const body = await req.json();
    const updates: any = {};
    
    // Update camera name (and location to keep them in sync)
    if (body?.name !== undefined && body.name !== null && body.name !== "") {
      updates.cameraModel = body.name;
      updates.cameraLocation = body.name; // Keep location in sync with model name
    }
    
    // Update RTSP URL (cameraIp) - must be a non-empty string
    if (body?.rtsp_url !== undefined) {
      if (body.rtsp_url && typeof body.rtsp_url === 'string' && body.rtsp_url.trim() !== '') {
        updates.cameraIp = body.rtsp_url.trim();
      } else {
        return NextResponse.json({ 
          success: false, 
          error: "RTSP URL cannot be empty" 
        }, { status: 400 });
      }
    }
    
    // Update status
    if (body?.status !== undefined && body.status !== null && body.status !== "") {
      updates.cameraStatus = body.status;
    }

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
      message: "Camera updated successfully",
    });
  } catch (error: any) {
    console.error("Failed to update camera:", error);
    
    // Provide more specific error messages
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: "Camera not found",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to update camera",
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
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

