"use client";
import React, { useEffect, useState } from 'react';
import { Camera } from '@/types/camera';

const CameraStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalCameras: 0,
    onlineCameras: 0,
    offlineCameras: 0,
    systemUptime: 0,
    cameraLocations: [] as { name: string; count: number }[],
    loading: true
  });

  useEffect(() => {
    fetchCameraStats();
    
    // Auto-refresh interval: 30000ms = 30 seconds
    // To change: modify the number below (value is in milliseconds)
    const interval = setInterval(() => {
      fetchCameraStats();
    }, 30000);

    const handleStreamStatus = (event: any) => {
      const { onlineCameras, offlineCameras } = event.detail;
      setStats(prev => ({
        ...prev,
        onlineCameras,
        offlineCameras,
        systemUptime: prev.totalCameras > 0 ? Math.round((onlineCameras / prev.totalCameras) * 100) : 0
      }));
    };

    const handleSync = () => {
      fetchCameraStats();
    };

    // Listen for global refresh event
    const handleGlobalRefresh = () => {
      fetchCameraStats();
    };

    window.addEventListener('cameraStreamStatus', handleStreamStatus);
    window.addEventListener('systemDataSynced', handleSync);
    window.addEventListener('dashboardRefresh', handleGlobalRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('cameraStreamStatus', handleStreamStatus);
      window.removeEventListener('systemDataSynced', handleSync);
      window.removeEventListener('dashboardRefresh', handleGlobalRefresh);
    };
  }, []);

  const fetchCameraStats = async () => {
    try {
      // Fetch from camera-config API which has all the data
      const response = await fetch('/api/camera-config');
      const data = await response.json();

      if (data.success) {
        const cameras = data.cameras || {};
        const summary = data.summary || {};
        const camerasArray = Object.values(cameras);
        
        // Calculate stats from camera data
        const total = camerasArray.length;
        const liveCount = camerasArray.filter((cam: any) => cam.is_live || cam.status === 'ONLINE').length;
        const offlineCount = camerasArray.filter((cam: any) => cam.status === 'OFFLINE' || !cam.is_live).length;
        
        // Get camera locations
        const locationMap = camerasArray.reduce((acc: any, camera: any) => {
          const loc = camera.camera_name || 'Unknown';
          acc[loc] = (acc[loc] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const locations = Object.entries(locationMap).map(([name, count]) => ({
          name,
          count
        }));

        setStats(prev => ({
          ...prev,
          totalCameras: summary.total_cameras || total,
          onlineCameras: summary.live_cameras_count || liveCount,
          offlineCameras: summary.offline_cameras_count || offlineCount,
          systemUptime: (summary.total_cameras || total) > 0 
            ? Math.round(((summary.live_cameras_count || liveCount) / (summary.total_cameras || total)) * 100) 
            : 0,
          cameraLocations: locations,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error fetching camera stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 80) return 'text-green-600 dark:text-green-400';
    if (uptime >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getUptimeMessage = (uptime: number) => {
    if (uptime >= 80) return 'System Normal';
    if (uptime >= 50) return 'System Warning';
    return 'System Critical';
  };

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total Cameras
            </p>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats.totalCameras}
            </h3>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Locations:</p>
          <div className="space-y-1">
            {stats.cameraLocations && stats.cameraLocations.length > 0 ? (
              stats.cameraLocations.map((location, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{location.name} ({location.count})</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No locations</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Online Cameras
              </p>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.onlineCameras}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Offline Cameras
              </p>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.offlineCameras}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              System Uptime
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${getUptimeColor(stats.systemUptime)}`}>
                {stats.systemUptime}%
              </span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                stats.systemUptime >= 80 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : stats.systemUptime >= 50
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {getUptimeMessage(stats.systemUptime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraStats;