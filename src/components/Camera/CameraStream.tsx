"use client";
import React, { useState, useRef } from "react";
import { Camera } from "@/types/camera";
import { Maximize2, Minimize2 } from "lucide-react"; // for icons

interface CameraStreamProps {
  camera: Camera;
  onStatusChange?: (cameraId: number, isOnline: boolean) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({
  camera,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const streamUrl = camera.cameraIp;

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
    onStatusChange?.(Number(camera.id), true);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    onStatusChange?.(Number(camera.id), false);
  };

  const handleFullscreen = async () => {
    if (!document.fullscreenElement && containerRef.current) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // In case user presses Esc to exit fullscreen manually
  React.useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${
        isFullscreen ? "z-50" : ""
      }`}
    >
      {/* Header */}
      {!isFullscreen && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {camera.cameraModel}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {camera.cameraLocation}
              </p>
              {/* Additional Camera Info */}
              {(camera as any).currentFps !== undefined && (
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    FPS: {(camera as any).currentFps?.toFixed(1)}/
                    {(camera as any).configuredFps} (
                    {(camera as any).fpsPercentage?.toFixed(1)}%)
                  </span>
                  {(camera as any).continuousUptimeFormatted && (
                    <span className="text-green-600 dark:text-green-400">
                      ↑ {(camera as any).continuousUptimeFormatted}
                    </span>
                  )}
                  {(camera as any).continuousDowntimeFormatted && (
                    <span className="text-red-600 dark:text-red-400">
                      ↓ {(camera as any).continuousDowntimeFormatted}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  (camera as any).isLive ||
                  camera.cameraStatus === "Active" ||
                  camera.cameraStatus === "ONLINE" ||
                  camera.cameraStatus === "LIVE"
                    ? "bg-green-500"
                    : camera.cameraStatus === "DEGRADED"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  (camera as any).isLive ||
                  camera.cameraStatus === "Active" ||
                  camera.cameraStatus === "ONLINE" ||
                  camera.cameraStatus === "LIVE"
                    ? "text-green-600 dark:text-green-400"
                    : camera.cameraStatus === "DEGRADED"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                }`}
              >
                {camera.cameraStatus || "Offline"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stream Section */}
      <div
        className="relative aspect-video cursor-pointer bg-gray-900"
        onClick={handleFullscreen}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mx-auto mb-2 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
              <p>Loading stream...</p>
            </div>
          </div>
        )}

        {/* Show offline overlay whenever status is Offline / OFFLINE / DEGRADED, or when stream errors */}
        {(error ||
          camera.cameraStatus === "Offline" ||
          camera.cameraStatus === "OFFLINE" ||
          camera.cameraStatus === "DEGRADED") && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="p-4 text-center text-white">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-red-500"
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
              <p className="mb-2 font-semibold">
                {camera.cameraStatus === "Offline" ||
                camera.cameraStatus === "OFFLINE"
                  ? "Camera Offline"
                  : camera.cameraStatus === "DEGRADED"
                    ? "Camera Degraded"
                    : "Failed to load stream"}
              </p>
              {(camera as any).statusDetail && (
                <p className="mb-2 text-sm text-gray-400">
                  {(camera as any).statusDetail}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Processed stream unavailable
              </p>
            </div>
          </div>
        )}

        {/* Stream Image - only show when we have a URL AND status is Active/ONLINE/LIVE */}
        {!error &&
          Boolean(streamUrl) &&
          (camera.cameraStatus === "Active" ||
            camera.cameraStatus === "ONLINE" ||
            camera.cameraStatus === "LIVE") && (
            <img
              src={streamUrl}
              alt={`${camera.cameraModel} stream`}
              className="h-full w-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

        {/* Fullscreen Minimize Button */}
        {isFullscreen && (
          <button
            onClick={handleFullscreen}
            className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        )}

        {/* Expand Icon (visible only when not fullscreen) */}
        {!isFullscreen && !isLoading && !error && (
          <div className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white opacity-0 transition group-hover:opacity-100">
            <Maximize2 className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraStream;
