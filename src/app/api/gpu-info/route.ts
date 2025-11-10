import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prismaDb";

// GET - Fetch latest GPU info
export async function GET(req: NextRequest) {
  try {
    const latestGpuInfo = await prisma.gPUInfo.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestGpuInfo) {
      return NextResponse.json(
        {
          success: false,
          message: "No GPU info found",
          gpuInfo: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        gpuInfo: latestGpuInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching GPU info:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch GPU info",
        gpuInfo: null,
      },
      { status: 500 }
    );
  }
}

