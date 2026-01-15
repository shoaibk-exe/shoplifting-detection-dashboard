"use client";
import React, { useEffect, useMemo, useState } from "react";
import CameraStream from "@/components/Camera/CameraStream";
import { Camera } from "@/types/camera";
import { useFlaskCameras } from "@/hooks/useFlaskCameras";

const CameraGrid: React.FC = () => {
  const {
    cameras: flaskCameras,
    loading,
    error,
    refetch,
  } = useFlaskCameras(15000);
  const [streamStatus, setStreamStatus] = useState<Record<number, boolean>>({});

  const cameras: Camera[] = useMemo(() => {
    return (flaskCameras || []).map((c) => ({
      id: String(c.id),
      cameraModel: c.name || `Camera-${c.id}`,
      cameraLocation: c.name || `Camera-${c.id}`,
      // IMPORTANT: Use processed stream URL, not RTSP
      cameraIp: c.processed_url || "",
      cameraStatus: c.status || "Offline",
      cameraUsername: "",
      cameraPassword: "",
    }));
  }, [flaskCameras]);

  const handleStreamStatusChange = (cameraId: number, isOnline: boolean) => {
    setStreamStatus((prev) => ({
      ...prev,
      [cameraId]: isOnline,
    }));
  };

  useEffect(() => {
    const onlineCameras = Object.values(streamStatus).filter(Boolean).length;
    const offlineCameras = cameras.length - onlineCameras;
    window.dispatchEvent(
      new CustomEvent("cameraStreamStatus", {
        detail: { streamStatus, onlineCameras, offlineCameras },
      }),
    );
  }, [streamStatus, cameras.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-12 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading cameras...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mb-4 font-semibold text-red-800 dark:text-red-200">
          {error}
        </p>
        <button
          onClick={refetch}
          className="rounded-md bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (cameras.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <svg
          className="mx-auto mb-4 h-20 w-20 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          No active cameras found
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Add cameras to start monitoring
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Live Camera Feeds
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Real-time monitoring from {cameras.length}{" "}
          {cameras.length === 1 ? "camera" : "cameras"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cameras.map((camera) => (
          <CameraStream
            key={camera.id}
            camera={camera}
            onStatusChange={handleStreamStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default CameraGrid;
