import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prismaDb";

// GET - Fetch all alerts
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  
  try {
    console.log("Fetching alerts from database...");
    
    const alerts = await prisma.alert.findMany({
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        date: 'desc',
      },
      include: {
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

    console.log(`Found ${serializedAlerts.length} alerts`);
    
    return NextResponse.json(
      { 
        alerts: serializedAlerts,
        success: true,
        count: serializedAlerts.length 
      }, 
      { status: 200 }
    );
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

    const alert = await prisma.alert.create({
      data: {
        alert_number,
        date: date ? new Date(date) : new Date(),
        time: time || new Date().toLocaleTimeString(),
        alert_link,
        camera_num,
      },
    });

    return NextResponse.json(
      { message: 'Alert created successfully!', alert },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { message: 'Failed to create alert', error: 'Error' },
      { status: 500 }
    );
  }
}
