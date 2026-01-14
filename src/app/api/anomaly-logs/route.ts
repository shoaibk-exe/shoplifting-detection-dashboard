import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prismaDb";

export async function GET(req: NextRequest) {
    try {
        const anomalyLogs = await prisma.anomaly_logs.findMany({
            include: {
                camera: {
                    select: {
                        id: true,
                        cameraModel: true,
                        cameraLocation: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(
            { 
                anomalyLogs,
                success: true,
                count: anomalyLogs.length 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching anomaly logs:", error);
        return NextResponse.json(
            { 
                status: "fail", 
                message: "Failed to fetch anomaly logs",
                anomalyLogs: []
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { anomaly_category, timestamp, anomaly_score, cameraId } = body;

        if (!cameraId) {
            return NextResponse.json(
                { status: "fail", message: "Camera ID is required" },
                { status: 400 }
            );
        }

        // Validate cameraId is a number
        const cameraIdNum = typeof cameraId === 'number' ? cameraId : parseInt(cameraId);
        if (isNaN(cameraIdNum)) {
            return NextResponse.json(
                { status: "fail", message: "Invalid camera ID format" },
                { status: 400 }
            );
        }

        // Verify camera exists
        const cameraExists = await prisma.camera.findUnique({
            where: { id: cameraIdNum },
        });

        if (!cameraExists) {
            return NextResponse.json(
                { status: "fail", message: "Invalid camera ID. No such camera exists." },
                { status: 400 }
            );
        }

        const newAnomalyData = {
            anomaly_category,
            anomaly_score,
            timestamp,
        };

        // Check if record already exists for this camera
        const existingRecord = await prisma.anomaly_logs.findFirst({
            where: { cameraId: cameraIdNum },
            select: { id: true, anomaly_details: true },
        });

        if (existingRecord) {
            // Update existing record
            const anomalyDetails = Array.isArray(existingRecord.anomaly_details)
                ? [...existingRecord.anomaly_details, newAnomalyData]
                : [newAnomalyData];

            await prisma.anomaly_logs.update({
                where: { id: existingRecord.id },
                data: { anomaly_details: anomalyDetails },
            });

            return NextResponse.json(
                { message: "Anomaly record updated successfully!" },
                { status: 200 }
            );
        } else {
            // Create new record
            await prisma.anomaly_logs.create({
                data: {
                    cameraId: cameraIdNum,
                    anomaly_details: [newAnomalyData],
                },
            });

            return NextResponse.json(
                { message: "Anomaly record created successfully!" },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error processing anomaly data:", error);
        return NextResponse.json(
            { 
                status: "fail", 
                message: "An error occurred while processing the request.",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
