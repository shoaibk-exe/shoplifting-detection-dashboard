import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file: File | null = formData.get("file") as unknown as File;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/upload_video`, {
            method: 'POST',
            body: formData,
        })
        // const filePath = `./public/uploads/${file.name}`;
        // const fileBuffer = await file.arrayBuffer();
        // await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));
        const data = await response.json();
        return NextResponse.json({ status: "success", data })
    }
    catch (e) {
        return NextResponse.json({ status: "fail", data: e })
    }
}