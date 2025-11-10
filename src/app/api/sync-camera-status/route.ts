import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prismaDb'

const PYTHON_BACKEND_URL = 'http://localhost:5555/api/debug/camera_config'

export async function GET() {
    try {
        const res = await fetch(PYTHON_BACKEND_URL)
        if (!res.ok) throw new Error('Failed to fetch backend')
        const data = await res.json()

        // 1️⃣ Update Camera table
        const cameraEntries = Object.values(data.cameras || {})

        for (const cam of cameraEntries as any[]) {
            // Try to find camera by location or model
            const existingCamera = await prisma.camera.findFirst({
                where: {
                    OR: [
                        { cameraLocation: cam.camera_name },
                        { cameraModel: cam.camera_name },
                    ],
                },
            });

            if (existingCamera) {
                // Update existing camera
                await prisma.camera.update({
                    where: { id: existingCamera.id },
                    data: {
                        cameraStatus: cam.status,
                        cameraIp: cam.rtsp_url,
                        cameraModel: cam.camera_name,
                        cameraLocation: cam.camera_name,
                    },
                });
            } else {
                // Create new camera
                await prisma.camera.create({
                    data: {
                        cameraModel: cam.camera_name,
                        cameraIp: cam.rtsp_url,
                        cameraLocation: cam.camera_name,
                        cameraUsername: 'admin',
                        cameraPassword: '',
                        cameraStatus: cam.status,
                    },
                });
            }
        }

        // 2️⃣ Store GPU Info
        const gpu = data.gpu_info
        if (gpu) {
            await prisma.gPUInfo.create({
                data: {
                    utilizationPercent: gpu.utilization_percent,
                    memoryStatus: gpu.memory_status,
                    allocatedGB: gpu.allocated_gb,
                    reservedGB: gpu.reserved_gb,
                    available: gpu.available,
                },
            })
        }

        // 3️⃣ Store System Summary
        const summary = data.summary
        if (summary) {
            await prisma.systemStatus.create({
                data: {
                    totalCameras: summary.total_cameras,
                    liveCamerasCount: summary.live_cameras_count,
                    degradedCount: summary.degraded_cameras_count,
                    offlineCount: summary.offline_cameras_count,
                    overallHealth: summary.overall_health,
                    statusSummary: summary.status_summary,
                },
            })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
