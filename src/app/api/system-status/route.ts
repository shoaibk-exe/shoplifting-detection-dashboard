import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prismaDb";

// GET - Fetch latest system status
export async function GET(req: NextRequest) {
  try {
    const latestStatus = await prisma.systemStatus.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!latestStatus) {
      return NextResponse.json(
        {
          success: false,
          message: "No system status found",
          status: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: latestStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching system status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch system status",
        status: null,
      },
      { status: 500 }
    );
  }
}

