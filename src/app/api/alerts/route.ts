import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prismaDb";

// Cache for 20 seconds
export const revalidate = 20;

// GET - Fetch all alerts
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  
  try {
    // Remove console.log for performance
    const limitNum = limit ? parseInt(limit) : undefined;
    if (limit && isNaN(limitNum!)) {
      return NextResponse.json(
        { message: 'Invalid limit parameter', alerts: [] },
        { status: 400 }
      );
    }

    // Optimize query - only select needed fields
    const alerts = await prisma.alert.findMany({
      take: limitNum,
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        alert_number: true,
        date: true,
        time: true,
        alert_link: true,
        camera_num: true,
        createdAt: true,
        updatedAt: true,
        camera: {
          select: {
            id: true,
            cameraModel: true,
            cameraLocation: true,
          }
        }
      }
    });

    // Convert Date objects to ISO strings for JSON serialization
    const serializedAlerts = alerts.map(alert => ({
      ...alert,
      date: alert.date.toISOString(), // Convert Date to string
      createdAt: alert.createdAt?.toISOString(),
      updatedAt: alert.updatedAt?.toISOString(),
    }));

    const response = NextResponse.json(
      { 
        alerts: serializedAlerts,
        success: true,
        count: serializedAlerts.length 
      }, 
      { status: 200 }
    );

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=40');

    return response;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch alerts',
        success: false,
        alerts: []
      },
      { status: 500 }
    );
  }
}

// POST - Create new alert
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { alert_number, date, time, alert_link, camera_num } = body;

    if (!alert_number || !camera_num) {
      return NextResponse.json(
        { message: 'Alert number and camera number are required' },
        { status: 400 }
      );
    }

    // Validate camera_num is a number
    const cameraId = typeof camera_num === 'number' ? camera_num : parseInt(camera_num);
    if (isNaN(cameraId)) {
      return NextResponse.json(
        { message: 'Invalid camera number format' },
        { status: 400 }
      );
    }

    // Verify camera exists
    const camera = await prisma.camera.findUnique({
      where: { id: cameraId },
    });

    if (!camera) {
      return NextResponse.json(
        { message: 'Camera not found' },
        { status: 404 }
      );
    }

    const alert = await prisma.alert.create({
      data: {
        alert_number,
        date: date ? new Date(date) : new Date(),
        time: time || new Date().toLocaleTimeString(),
        alert_link: alert_link || null,
        camera_num: cameraId,
      },
    });

    return NextResponse.json(
      { message: 'Alert created successfully!', alert },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      {
        message: 'Failed to create alert',
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
