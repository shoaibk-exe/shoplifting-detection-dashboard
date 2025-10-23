"use client";
import React, { useState } from 'react';
import { Camera } from '@/types/camera';

interface CameraStreamProps {
  camera: Camera;
  onStatusChange?: (cameraId: number, isOnline: boolean) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({ camera, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const streamUrl = camera.cameraIp;

const handleImageLoad = () => {
  setIsLoading(false);
  setError(false);
  if (onStatusChange) {
    onStatusChange(camera.id, true); // Camera is online
  }
};

const handleImageError = () => {
  setIsLoading(false);
  setError(true);
  if (onStatusChange) {
    onStatusChange(camera.id, false); // Camera is offline
  }
};

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
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
            <div className={`h-2 w-2 rounded-full ${
              camera.cameraStatus === 'Active' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {camera.cameraIp}
            </span>
          </div>
        </div>
      </div>

      <div className="relative aspect-video bg-gray-900">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading stream...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mb-2 font-semibold">Failed to load stream</p>
              <p className="text-sm text-gray-400">{streamUrl}</p>
            </div>
          </div>
        )}

        <img
          src={streamUrl}
          alt={`${camera.cameraModel} stream`}
          className="h-full w-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: error ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};

export default CameraStream;