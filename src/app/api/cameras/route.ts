import { NextResponse, NextRequest } from "next/server";
import { clean } from "@/helper/clearEmptyUndefinedNullfields";
import { prisma } from "@/libs/prismaDb";
export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
        cameraIp,
    } = body;
    const userExist = await prisma.camera.findFirst({
        where: {
            cameraIp: cameraIp,
        },
    });
    if (userExist !== null) {
        return NextResponse.json({ message: 'Camera is Already Exist!' }, { status: 400 });
    }

    try {
        await prisma.camera.create({
            data: {
                ...body,
            },
        });

        return NextResponse.json({ message: 'Camera created successfully!' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to create Camera', error: "Error" }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const videoRecording = Boolean(searchParams.get('videoRecording')) || false;
    const anomaly_logs = Boolean(searchParams.get('anomaly_logs')) || false;
    let filters = {}
    const camera = await prisma.camera.findMany({
        where: filters,
        include: {
            videoRecording: videoRecording,
            anomaly_logs: anomaly_logs,
        }
    })
    return NextResponse.json({ camera }, { status: 200 });
}
export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    let status = 200;
    let message = "Camera deleted successfully";
    if (!id) {
        return NextResponse.json({ message: 'Camera id is required' }, { status: 400 });
    }
    try {
        await prisma.camera.delete({
            where: {
                id: id,
            },
        });
    } catch (error: unknown) {
        message = 'Failed to delete Camera';
        status = 500;
    }
    return NextResponse.json({ message }, { status });
}
export async function PUT(req: NextRequest) {
    let message = "Camera Update successfully!";
    let status = 200;
    const body = await req.json();
    const data = clean(body.data)
    const updated_object = {
        ...data
    }
    try {
        await prisma.camera.update({
            where: {
                id: body.id
            },
            data: {
                ...updated_object,
            },
        });
    } catch (error) {
        message = "Camera fetching Failed, Please try again!";
        status = 500;
    }
    return NextResponse.json({ message }, { status });
}