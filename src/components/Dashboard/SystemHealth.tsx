"use client";
import React, { useEffect, useState } from 'react';
import SyncButton from './SyncButton';

interface SystemStatus {
  id: number;
  totalCameras: number;
  liveCamerasCount: number;
  degradedCount: number;
  offlineCount: number;
  overallHealth: string;
  statusSummary: string;
  timestamp: string;
}

const SystemHealth: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraConfigData, setCameraConfigData] = useState<any>(null);

  useEffect(() => {
    fetchSystemHealth();
    
    // Auto-refresh interval: 30000ms = 30 seconds
    // To change: modify the number below (value is in milliseconds)
    const interval = setInterval(() => {
      fetchSystemHealth();
    }, 30000);

    const handleSync = () => {
      // Refresh data when sync event is triggered
      fetchSystemHealth();
    };

    // Listen for global refresh event
    const handleGlobalRefresh = () => {
      fetchSystemHealth();
    };

    window.addEventListener('systemDataSynced', handleSync);
    window.addEventListener('dashboardRefresh', handleGlobalRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('systemDataSynced', handleSync);
      window.removeEventListener('dashboardRefresh', handleGlobalRefresh);
    };
  }, []);

  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      let statusSet = false; // Track if we've set the status

      // Fetch from Python API via camera-config endpoint
      let cameraConfigData;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const cameraConfigRes = await fetch('/api/camera-config', { 
          cache: 'no-store',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!cameraConfigRes.ok) {
          throw new Error(`API responded with status: ${cameraConfigRes.status}`);
        }
        
        cameraConfigData = await cameraConfigRes.json();
      } catch (fetchError: any) {
        // Silently handle fetch errors and fallback to database
        if (fetchError.name !== 'AbortError') {
          console.error('Error fetching camera config:', fetchError);
        }
        // Fallback to database
        cameraConfigData = { success: false };
      }

      if (cameraConfigData?.success) {
        const summary = cameraConfigData.summary || {};
        const cameras = cameraConfigData.cameras || [];
        
        // Extract summary data from Python API
        const total = summary.total_cameras || 0;
        const live = summary.live_cameras || 0;
        const streaming = summary.streaming_cameras || 0;
        const offline = summary.offline_cameras || 0;
        
        // Calculate degraded: cameras that are not live but not offline (e.g., Inactive but not offline)
        const degraded = Array.isArray(cameras) 
          ? cameras.filter((c: any) => 
              c.cameraStatus === 'Inactive' && c.is_streaming === false && c.cameraStatus !== 'OFFLINE'
            ).length 
          : 0;
        
        // Determine overall health
        const overallHealth =
          live === total && total > 0 ? 'HEALTHY' :
          offline > 0 ? 'CRITICAL' :
          degraded > 0 ? 'DEGRADED' : 
          total === 0 ? 'OK' : 'DEGRADED';

        setSystemStatus({
          id: 0,
          totalCameras: total,
          liveCamerasCount: live,
          degradedCount: degraded,
          offlineCount: offline,
          overallHealth,
          statusSummary: `${live} Live, ${offline} Offline, ${degraded} Degraded`,
          timestamp: summary.timestamp || new Date().toISOString(),
        } as any);
        statusSet = true;

        // Store camera config data for runtime stats
        setCameraConfigData(cameraConfigData);

        // GPU info not provided by Python API, skip it
      } else {
        // Fallback to database if Python API fails
        let camerasData;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

          const camerasRes = await fetch('/api/flask/cameras', { 
            cache: 'no-store',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!camerasRes.ok) {
            throw new Error(`API responded with status: ${camerasRes.status}`);
          }
          
          camerasData = await camerasRes.json();
        } catch (fetchError: any) {
          // Silently handle fetch errors
          if (fetchError.name !== 'AbortError') {
            console.error('Error fetching cameras from database:', fetchError);
          }
          camerasData = { success: false, cameras: [] };
        }

        if (camerasData?.success && Array.isArray(camerasData.cameras)) {
          const cams = camerasData.cameras;
          const total = cams.length;
          const live = cams.filter((c: any) => (c.status || '').toUpperCase() === 'ACTIVE' || (c.status || '').toUpperCase() === 'ONLINE').length;
          const degraded = cams.filter((c: any) => (c.status || '').toUpperCase() === 'DEGRADED').length;
          const offline = total - live - degraded;
          const overallHealth =
            live === total && total > 0 ? 'HEALTHY' :
            offline > 0 ? 'CRITICAL' :
            degraded > 0 ? 'DEGRADED' : 'OK';

          setSystemStatus({
            id: 0,
            totalCameras: total,
            liveCamerasCount: live,
            degradedCount: degraded,
            offlineCount: offline,
            overallHealth,
            statusSummary: `${live} Live, ${offline} Offline, ${degraded} Degraded`,
            timestamp: new Date().toISOString(),
          } as any);
          statusSet = true;
        } else {
          setSystemStatus({
            id: 0,
            totalCameras: 0,
            liveCamerasCount: 0,
            degradedCount: 0,
            offlineCount: 0,
            overallHealth: 'OK',
            statusSummary: `0 Live, 0 Offline, 0 Degraded`,
            timestamp: new Date().toISOString(),
          } as any);
          statusSet = true;
        }

        // GPU info not available from database fallback either
      }

      // If all fetches failed, set default empty state
      if (!statusSet) {
        setSystemStatus({
          id: 0,
          totalCameras: 0,
          liveCamerasCount: 0,
          degradedCount: 0,
          offlineCount: 0,
          overallHealth: 'OK',
          statusSummary: `0 Live, 0 Offline, 0 Degraded`,
          timestamp: new Date().toISOString(),
        } as any);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
      // Set default state on error
      setSystemStatus({
        id: 0,
        totalCameras: 0,
        liveCamerasCount: 0,
        degradedCount: 0,
        offlineCount: 0,
        overallHealth: 'OK',
        statusSummary: `0 Live, 0 Offline, 0 Degraded`,
        timestamp: new Date().toISOString(),
      } as any);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health?.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-600 dark:text-red-400';
      case 'DEGRADED':
      case 'WARNING':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'HEALTHY':
      case 'NORMAL':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getHealthBgColor = (health: string) => {
    switch (health?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'DEGRADED':
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'HEALTHY':
      case 'NORMAL':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };


  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-6">
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Health & Status
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time system monitoring and camera status
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
      {/* System Status Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Overall System Health
            </p>
            {systemStatus ? (
              <>
                <h3 className={`text-3xl font-bold ${getHealthColor(systemStatus.overallHealth)}`}>
                  {systemStatus.overallHealth}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {systemStatus.statusSummary}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {systemStatus && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Live Cameras:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {systemStatus.liveCamerasCount} / {systemStatus.totalCameras}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Degraded:</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {systemStatus.degradedCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Offline:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {systemStatus.offlineCount}
              </span>
            </div>
            {systemStatus.timestamp && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                Last updated: {new Date(systemStatus.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>

      </div>

      {/* Camera Runtime Stats Section - Only show if cameras data is available */}
      {cameraConfigData && Array.isArray(cameraConfigData.cameras) && cameraConfigData.cameras.length > 0 && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Camera Runtime Stats
            </p>
            <div className="space-y-3">
              {cameraConfigData.cameras.map((camera: any) => (
                <div key={camera.id} className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {camera.camera_name || camera.cameraModel || camera.cameraLocation || `Camera ${camera.id || 'Unknown'}`}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      camera.is_streaming 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : camera.cameraStatus === 'Inactive'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {camera.is_streaming ? 'Streaming' : camera.cameraStatus || 'Unknown'}
                    </span>
                  </div>
                  {camera.last_updated && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(camera.last_updated).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;

