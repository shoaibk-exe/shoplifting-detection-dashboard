"use client";
import React, { ChangeEvent, useState } from "react";
import { Icons } from "@/images/Icons";
import { RegisterCamera } from "@/actions/camera";
import toast from "react-hot-toast";

const AddLiveCamera: React.FC = () => {
    const initialCamera = {
        cameraModel: "", // Used as Camera Name
        cameraIp: "",
        cameraUsername: "N/A",
        cameraPassword: "N/A",
        cameraLocation: "Indoor",
        rtspUrl: "",
    }

    const [camera, setCamera] = useState(initialCamera);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent | any) => {
        const { name, value } = e.target as any;
        setCamera(pre => {
            return {
                ...pre,
                [name]: value
            }
        })
    }

    const onSubmit = async () => {
        setLoading(true);
        if (!camera.rtspUrl) {
            toast.error("Stream URL is required");
            setLoading(false);
            return;
        }

        // Generate ID for IP if empty to avoid collision in API check
        // We use a timestamp-based ID if user didn't provide IP (assuming logic wants unique IP)
        const submissionData = {
            ...camera,
            cameraIp: camera.cameraIp || `rtsp-${Date.now()}`,
            cameraUsername: camera.cameraUsername || "N/A",
            cameraPassword: camera.cameraPassword || "N/A",
        };

        const { status, message } = await RegisterCamera(submissionData);
        if (status !== 200) {
            setLoading(false)
            toast.error(message)
        } else {
            setLoading(false)
            toast.success(message)
            setCamera(initialCamera)
        }
    }

    return (
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Add Live Camera (RTSP/IP/Stream)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Camera Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Front Entrance"
                        name="cameraModel"
                        value={camera.cameraModel}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div>
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Location
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Store"
                        name="cameraLocation"
                        value={camera.cameraLocation}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Stream URL (Required)
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="rtsp://..., http://..., https://..etc"
                            name="rtspUrl"
                            value={camera.rtspUrl}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary pl-12"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Icons.videoCam />
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="w-full rounded-[7px] bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Camera"}
                </button>
            </div>
        </div>
    );
};

export default AddLiveCamera;
