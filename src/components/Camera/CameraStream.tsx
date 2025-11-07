"use client";
import React, { useState, useRef } from "react";
import { Camera } from "@/types/camera";
import { Maximize2, Minimize2 } from "lucide-react"; // for icons

interface CameraStreamProps {
  camera: Camera;
  onStatusChange?: (cameraId: number, isOnline: boolean) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({ camera, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<string>(camera.cameraStatus || 'Active');
  const containerRef = useRef<HTMLDivElement>(null);

  // Build stream URL from camera data (fetched from database)
  // Use Python backend to convert RTSP stream to HTTP stream
  const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://192.168.100.56:5000';
  const streamUrl = camera.cameraIp && camera.cameraUsername && camera.cameraPassword
    ? `${pythonBackendUrl}/video_feed?rtsp_url=rtsp://${camera.cameraUsername}:${camera.cameraPassword}@${camera.cameraIp}/live&height=480&width=640&webview=False`
    : null;

  const handleImageLoad = async () => {
    setIsLoading(false);
    setError(false);
    setCameraStatus('Active'); // Update local state immediately
    onStatusChange?.(camera.id, true);
    
    // Update camera status to "Active" in database when stream loads successfully
    if (cameraStatus !== 'Active') {
      try {
        await fetch('/api/cameras', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: camera.id,
            data: {
              cameraStatus: 'Active'
            }
          }),
        });
      } catch (error) {
        console.error('Failed to update camera status:', error);
      }
    }
  };

  const handleImageError = async () => {
    setIsLoading(false);
    setError(true);
    setCameraStatus('Offline'); // Update local state immediately
    onStatusChange?.(camera.id, false);
    
    // Update camera status to "Offline" in database when connection fails
    try {
      await fetch('/api/cameras', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: camera.id,
          data: {
            cameraStatus: 'Offline'
          }
        }),
      });
    } catch (error) {
      console.error('Failed to update camera status:', error);
    }
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

  // Sync local status with camera prop when it changes
  React.useEffect(() => {
    setCameraStatus(camera.cameraStatus || 'Active');
  }, [camera.cameraStatus]);

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
      className={`relative rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden ${isFullscreen ? "z-50" : ""
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
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${cameraStatus === "Active"
                  ? "bg-green-500"
                  : "bg-red-500"
                  }`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {camera.cameraIp}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stream Section */}
      <div
        className="relative aspect-video bg-gray-900 cursor-pointer"
        onClick={handleFullscreen}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading stream...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-red-500"
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
              <p className="mb-2 font-semibold">Failed to load stream</p>
              <p className="text-sm text-gray-400">{streamUrl}</p>
            </div>
          </div>
        )}

        {/* Stream Image */}
        {streamUrl ? (
        <img
          src={streamUrl}
          alt={`${camera.cameraModel} stream`}
          className="h-full w-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: error ? "none" : "block" }}
          loading="lazy"  // ⭐ Add this - lazy load camera streams
        />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <p className="mb-2 font-semibold">Camera configuration incomplete</p>
              <p className="text-sm text-gray-400">Missing IP, username, or password</p>
            </div>
          </div>
        )}

        {/* Fullscreen Minimize Button */}
        {isFullscreen && (
          <button
            onClick={handleFullscreen}
            className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}

        {/* Expand Icon (visible only when not fullscreen) */}
        {!isFullscreen && !isLoading && !error && (
          <div className="absolute top-3 right-3 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
            <Maximize2 className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraStream;
