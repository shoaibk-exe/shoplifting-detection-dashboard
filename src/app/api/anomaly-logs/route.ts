import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prismaDb";
import { sendMessage } from "@/actions/message.action";
export async function GET(req: NextRequest) {

    try {
        console.log("API CALLS")
        return NextResponse.json({ status: "success" })
    }
    catch (e) {
        return NextResponse.json({ status: "fail", data: e })
    }
}
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { anomaly_category, timestamp, anomaly_score, cameraId } = body;

    const newAnomalyData = {
        anomaly_category,
        anomaly_score,
        timestamp,
    };

    try {
        const cameraExists = await prisma.camera.findUnique({
            where: { id: cameraId },
        });

        if (!cameraExists) {
            return NextResponse.json(
                { status: "fail", message: "Invalid cameraId. No such camera exists." },
                { status: 400 }
            );
        }

        const existingRecord = await prisma.anomaly_logs.findFirst({
            where: { cameraId },
            select: { id: true, anomaly_details: true },
        });

        if (existingRecord) {
            const anomalyDetails = [...(existingRecord.anomaly_details || [] as any), newAnomalyData];

            await prisma.anomaly_logs.update({
                where: { id: existingRecord.id },
                data: { anomaly_details: anomalyDetails },
            });

            return NextResponse.json(
                { message: "New Anomaly Record Updated successfully!" },
                { status: 200 }
            );
        } else {
            // Create a new anomaly record
            await prisma.anomaly_logs.create({
                data: {
                    cameraId,
                    anomaly_details: [newAnomalyData],
                },
            });

            return NextResponse.json(
                { message: "New Anomaly Record Added!" },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error processing anomaly data:", error);
        return NextResponse.json(
            { status: "fail", message: "An error occurred while processing the request." },
            { status: 500 }
        );
    }
}
