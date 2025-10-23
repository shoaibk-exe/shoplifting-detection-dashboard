import { NextResponse, NextRequest } from "next/server";
import { clean } from "@/helper/clearEmptyUndefinedNullfields";
import { prisma } from "@/libs/prismaDb";

// CREATE - Add new camera
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cameraIp } = body;

  const cameraExist = await prisma.camera.findFirst({
    where: {
      cameraIp: cameraIp,
    },
  });

  if (cameraExist !== null) {
    return NextResponse.json(
      { message: 'Camera is Already Exist!' }, 
      { status: 400 }
    );
  }

  try {
    await prisma.camera.create({
      data: {
        ...body,
      },
    });
    return NextResponse.json(
      { message: 'Camera created successfully!' }, 
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Failed to create Camera', error: "Error" }, 
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
  const { id } = await req.json();
  let status = 200;
  let message = "Camera deleted successfully";

  if (!id) {
    return NextResponse.json(
      { message: 'Camera id is required' }, 
      { status: 400 }
    );
  }

  try {
    await prisma.camera.delete({
      where: {
        id: id,
      },
    });
  } catch (error: unknown) {
    console.error('Error deleting camera:', error);
    message = 'Failed to delete Camera';
    status = 500;
  }

  return NextResponse.json({ message }, { status });
}

// UPDATE - Modify camera details
// UPDATE - Modify camera details
export async function PUT(req: NextRequest) {
  let message = "Camera updated successfully!";
  let status = 200;
  const body = await req.json();
  const data = clean(body.data);

  if (!body.id) {
    return NextResponse.json(
      { message: 'Camera id is required' }, 
      { status: 400 }
    );
  }

  try {
    // Check if another camera already has the same IP (excluding the current camera)
    if (data.cameraIp) {
      const existingCamera = await prisma.camera.findFirst({
        where: {
          cameraIp: data.cameraIp,
          id: { not: body.id } // Exclude the current camera
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
        id: body.id
      },
      data: {
        ...data,
      },
    });
  } catch (error) {
    console.error('Error updating camera:', error);
    message = "Camera update failed, Please try again!";
    status = 500;
  }

  return NextResponse.json({ message }, { status });
}