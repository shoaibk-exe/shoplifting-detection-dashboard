import { NextResponse, NextRequest } from "next/server";
import { clean } from "@/helper/clearEmptyUndefinedNullfields";
import { prisma } from "@/libs/prismaDb";

// CREATE - Add new camera
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cameraIp, cameraModel, cameraUsername, cameraPassword, cameraLocation } = body;

    // Validate required fields
    if (!cameraIp || !cameraModel || !cameraUsername || !cameraPassword || !cameraLocation) {
      return NextResponse.json(
        { message: 'All required fields are missing: cameraIp, cameraModel, cameraUsername, cameraPassword, cameraLocation' },
        { status: 400 }
      );
    }

    // Check if camera with same IP already exists
    const cameraExist = await prisma.camera.findFirst({
      where: {
        cameraIp: cameraIp,
      },
    });

    if (cameraExist !== null) {
      return NextResponse.json(
        { message: 'Camera with this IP already exists!' },
        { status: 400 }
      );
    }

    // Create camera
    await prisma.camera.create({
      data: {
        cameraIp,
        cameraModel,
        cameraUsername,
        cameraPassword,
        cameraLocation,
        cameraStatus: body.cameraStatus || 'Active',
        autoFlash: body.autoFlash || false,
        cameraVoice: body.cameraVoice || false,
        processedUrl: body.processedUrl || null,
      },
    });

    return NextResponse.json(
      { message: 'Camera created successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating camera:', error);
    return NextResponse.json(
      {
        message: 'Failed to create camera',
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// READ - Get all cameras (FIXED VERSION)
export async function GET(req: NextRequest) {
  try {
    const cameras = await prisma.camera.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    console.log("Fetched cameras from database:", cameras.length); // Debug log

    // Return format expected by frontend
    return NextResponse.json(
      { 
        cameras: cameras, // This is what your hook should access
        success: true,
        count: cameras.length 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch cameras',
        success: false,
        cameras: []
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove camera
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Camera id is required' },
        { status: 400 }
      );
    }

    // Validate ID is a number
    const cameraId = typeof id === 'number' ? id : parseInt(id);
    if (isNaN(cameraId)) {
      return NextResponse.json(
        { message: 'Invalid camera ID format' },
        { status: 400 }
      );
    }

    // Check if camera exists
    const camera = await prisma.camera.findUnique({
      where: { id: cameraId },
    });

    if (!camera) {
      return NextResponse.json(
        { message: 'Camera not found' },
        { status: 404 }
      );
    }

    await prisma.camera.delete({
      where: {
        id: cameraId,
      },
    });

    return NextResponse.json(
      { message: 'Camera deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting camera:', error);
    return NextResponse.json(
      { message: 'Failed to delete camera' },
      { status: 500 }
    );
  }
}

// UPDATE - Modify camera details
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = clean(body.data);

    if (!body.id) {
      return NextResponse.json(
        { message: 'Camera id is required' },
        { status: 400 }
      );
    }

    // Validate ID is a number
    const cameraId = typeof body.id === 'number' ? body.id : parseInt(body.id);
    if (isNaN(cameraId)) {
      return NextResponse.json(
        { message: 'Invalid camera ID format' },
        { status: 400 }
      );
    }

    // Check if camera exists
    const camera = await prisma.camera.findUnique({
      where: { id: cameraId },
    });

    if (!camera) {
      return NextResponse.json(
        { message: 'Camera not found' },
        { status: 404 }
      );
    }

    // Check if another camera already has the same IP (excluding the current camera)
    if (data.cameraIp && data.cameraIp !== camera.cameraIp) {
      const existingCamera = await prisma.camera.findFirst({
        where: {
          cameraIp: data.cameraIp,
          id: { not: cameraId }
        },
      });

      if (existingCamera) {
        return NextResponse.json(
          { message: 'Another camera with this IP already exists!' },
          { status: 400 }
        );
      }
    }

    await prisma.camera.update({
      where: {
        id: cameraId
      },
      data: {
        ...data,
      },
    });

    return NextResponse.json(
      { message: 'Camera updated successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating camera:', error);
    return NextResponse.json(
      { message: 'Camera update failed, Please try again!' },
      { status: 500 }
    );
  }
}