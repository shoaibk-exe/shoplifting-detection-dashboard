"use client";
import React, { useEffect, useState } from 'react';
import CameraStream from '@/components/Camera/CameraStream';
import { Camera } from '@/types/camera';

const CameraGrid: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamStatus, setStreamStatus] = useState<Record<number, boolean>>({}); // ADD THIS
  
const handleStreamStatusChange = (cameraId: number, isOnline: boolean) => {
  setStreamStatus(prev => ({
    ...prev,
    [cameraId]: isOnline
  }));
};
  useEffect(() => {
    fetchCameras();
    
    const interval = setInterval(() => {
      fetchCameras();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

      useEffect(() => {
      // Store stream status in localStorage or pass to parent component
      const onlineCameras = Object.values(streamStatus).filter(Boolean).length;
      const offlineCameras = cameras.length - onlineCameras;
      
      // Trigger custom event for CameraStats to listen
      window.dispatchEvent(new CustomEvent('cameraStreamStatus', {
        detail: { streamStatus, onlineCameras, offlineCameras }
      }));
    }, [streamStatus, cameras.length]);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cameras');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cameras');
      }
      
      const data = await response.json();

      if (data.success) {
        setCameras(data.cameras);
      } else {
        setError(data.error || 'Failed to fetch cameras');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching cameras:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
        <svg className="w-16 h-16 mx-auto mb-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-800 dark:text-red-200 mb-4 font-semibold">{error}</p>
        <button
          onClick={fetchCameras}
          className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (cameras.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Live Camera Feeds
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time monitoring from {cameras.length} {cameras.length === 1 ? 'camera' : 'cameras'}
          </p>
        </div>
        <button
          onClick={fetchCameras}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
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