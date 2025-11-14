"use client";
import React, { useEffect, useState } from "react";

interface Camera {
  id: number;
  cameraModel: string;
  cameraIp: string;
  cameraLocation: string;
  cameraStatus: string;
}

interface Alert {
  id: number;
  alert_number: string;
  date: string;
  time: string;
  alert_link?: string;
  camera_num: number;
}

interface HourData {
  hour: number;
  status: 'online' | 'offline';
  alerts: Alert[];
}

interface CameraUptime {
  cameraId: number;
  cameraName: string;
  cameraLocation: string;
  uptimeData: HourData[];
  currentStatus: 'online' | 'offline';
  uptimePercentage: number;
  totalAlerts: number;
}

const CameraUptimeAnalytics: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [uptimeData, setUptimeData] = useState<CameraUptime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingStreams, setIsCheckingStreams] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    cameraId: number;
    hour: number;
  } | null>(null);

  useEffect(() => {
    fetchCamerasAndAlerts();
    
    // Auto-refresh interval: 300000ms = 5 minutes
    // To change: modify the number below (value is in milliseconds)
    const interval = setInterval(() => {
      fetchCamerasAndAlerts();
    }, 300000);

    // Listen for global refresh event
    const handleGlobalRefresh = () => {
      fetchCamerasAndAlerts();
    };
    window.addEventListener('dashboardRefresh', handleGlobalRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('dashboardRefresh', handleGlobalRefresh);
    };
  }, [selectedDate]);

  const fetchCamerasAndAlerts = async () => {
    try {
      setLoading(true);
      setIsCheckingStreams(true);

      const [cameraConfigResponse, alertsResponse] = await Promise.all([
        fetch('/api/camera-config'),
        fetch('/api/alerts'),
      ]);

      const cameraConfigResult = await cameraConfigResponse.json();
      const alertsResult = await alertsResponse.json();

      if (cameraConfigResult.success && alertsResult.success) {
        // Convert cameras object to array format
        const camerasObj = cameraConfigResult.cameras || {};
        const camerasData = Object.values(camerasObj).map((cam: any, index: number) => ({
          id: index + 1,
          cameraModel: cam.camera_name || `Camera-${index + 1}`,
          cameraLocation: cam.camera_name || `Camera-${index + 1}`,
          cameraIp: cam.rtsp_url || '',
          cameraStatus: cam.status || 'OFFLINE',
          isLive: cam.is_live || false,
          // Add uptime data from API
          uptimeSeconds: cam.uptime_seconds || 0,
          continuousUptimeSeconds: cam.continuous_uptime_seconds || 0,
          continuousDowntimeSeconds: cam.continuous_downtime_seconds || 0,
        })) as Camera[];

        const alertsData = alertsResult.alerts || [];

        setCameras(camerasData);
        setAlerts(alertsData);

        const uptimePromises = camerasData.map(async (camera: Camera) => {
          const isOnline = camera.isLive || camera.cameraStatus === 'ONLINE' || camera.cameraStatus === 'LIVE';
          return generateUptimeData(camera, isOnline, alertsData);
        });

        const allUptimeData = await Promise.all(uptimePromises);
        setUptimeData(allUptimeData);
      } else {
        setError('Failed to fetch cameras or alerts');
      }
    } catch (err) {
      setError('Error fetching data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setIsCheckingStreams(false);
    }
  };

  const checkCameraStream = async (camera: Camera): Promise<boolean> => {
    try {
      // Use isLive property if available, otherwise check status
      if ((camera as any).isLive !== undefined) {
        return (camera as any).isLive;
      }
      
      if (camera.cameraStatus === 'ONLINE' || camera.cameraStatus === 'LIVE') {
        return true;
      }
      
      if (camera.cameraStatus === 'OFFLINE' || camera.cameraStatus === 'DEGRADED') {
        return false;
      }

      // Fallback: try to check stream if status is unknown
      if (!camera.cameraIp) {
        return false;
      }

      const streamUrl = `http://${camera.cameraIp}/snapshot.jpg`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(streamUrl, {
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response.ok;
      } catch {
        clearTimeout(timeoutId);
        return false;
      }
    } catch {
      return false;
    }
  };

  const generateUptimeData = (
    camera: Camera,
    isCurrentlyOnline: boolean,
    allAlerts: Alert[]
  ): CameraUptime => {
    const uptimeData: HourData[] = [];
    const currentHour = new Date().getHours();
    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const cameraAlerts = allAlerts.filter(alert => {
      const alertDate = new Date(alert.date).toISOString().split('T')[0];
      return alert.camera_num === camera.id && alertDate === selectedDate;
    });

    for (let hour = 0; hour < 24; hour++) {
      const hourAlerts = cameraAlerts.filter(alert => {
        const alertHour = parseInt(alert.time.split(':')[0]);
        return alertHour === hour;
      });

      if (isToday && hour > currentHour) {
        uptimeData.push({ hour, status: 'offline', alerts: [] });
      } else if (isToday && hour === currentHour) {
        uptimeData.push({
          hour,
          status: isCurrentlyOnline ? 'online' : 'offline',
          alerts: hourAlerts
        });
      } else {
        // Use API status to determine if camera was online
        const status = (camera.cameraStatus === 'ONLINE' || camera.cameraStatus === 'LIVE' || (camera as any).isLive) 
          ? 'online' 
          : 'offline';
        uptimeData.push({ hour, status, alerts: hourAlerts });
      }
    }

    // Calculate uptime percentage based on API data if available
    let uptimePercentage = 0;
    if ((camera as any).uptimeSeconds !== undefined && (camera as any).continuousUptimeSeconds !== undefined) {
      const totalSeconds = ((camera as any).continuousUptimeSeconds || 0) + ((camera as any).continuousDowntimeSeconds || 0);
      if (totalSeconds > 0) {
        uptimePercentage = (((camera as any).continuousUptimeSeconds || 0) / totalSeconds) * 100;
      }
    } else {
      // Fallback to hour-based calculation
      const onlineHours = uptimeData.filter(d => d.status === 'online').length;
      const totalHours = isToday ? currentHour + 1 : 24;
      uptimePercentage = (onlineHours / totalHours) * 100;
    }

    return {
      cameraId: camera.id,
      cameraName: `Camera ${camera.id}`,
      cameraLocation: camera.cameraLocation,
      uptimeData,
      currentStatus: isCurrentlyOnline ? 'online' : 'offline',
      uptimePercentage: Math.round(uptimePercentage),
      totalAlerts: cameraAlerts.length,
    };
  };

  const getColor = (hourData: HourData, isToday: boolean, currentHour: number) => {
    const isFuture = isToday && hourData.hour > currentHour;

    if (isFuture) {
      return 'bg-gray-300';
    }

    if (hourData.alerts.length > 0) {
      return 'bg-yellow-400';
    }

    return hourData.status === 'online' ? 'bg-green-500' : 'bg-red-500';
  };

  const handleMouseEnter = (e: React.MouseEvent, cameraId: number, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.right + 10,
      y: rect.top,
      cameraId,
      hour
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const TooltipContent = () => {
    if (!tooltip?.visible) return null;

    const camera = uptimeData.find(c => c.cameraId === tooltip.cameraId);
    if (!camera) return null;

    const hourData = camera.uptimeData.find(h => h.hour === tooltip.hour);
    if (!hourData) return null;

    return (
      <div
        className="fixed z-[9999] bg-white border-2 border-gray-400 rounded-lg shadow-2xl p-4 min-w-[280px] max-w-[400px]"
        style={{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          pointerEvents: 'none'
        }}
      >
        <div className="space-y-2">
          <div className="font-bold text-gray-800 border-b pb-2 text-base">
            {camera.cameraName} - {tooltip.hour}:00
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-1">Location: <span className="font-normal">{camera.cameraLocation}</span></div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${hourData.status === 'online'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {hourData.status.toUpperCase()}
              </span>
            </div>
          </div>

          {hourData.alerts.length > 0 && (
            <div className="mt-3 border-t pt-2">
              <div className="font-semibold text-yellow-700 mb-2 flex items-center gap-1">
                <span className="text-lg">⚠️</span>
                <span>Alerts ({hourData.alerts.length})</span>
              </div>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {hourData.alerts.map((alert) => (
                  <div key={alert.id} className="bg-yellow-50 p-3 rounded-md text-xs border border-yellow-300 shadow-sm">
                    <div className="font-semibold text-yellow-900 mb-1">Alert #{alert.alert_number}</div>
                    <div className="text-gray-700"><strong>Time:</strong> {alert.time}</div>
                    <div className="text-gray-700"><strong>Date:</strong> {new Date(alert.date).toLocaleDateString()}</div>
                    {alert.alert_link && (
                      <div className="mt-1">
                        <a
                          href={alert.alert_link}
                          className="text-blue-600 hover:text-blue-800 font-semibold underline text-xs"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Alert →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading camera uptime data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Camera Uptime Analytics</h2>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Summary Stats removed per requirement */}

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-green-500 rounded border border-gray-300"></div>
          <span className="text-sm font-medium">Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-red-500 rounded border border-gray-300"></div>
          <span className="text-sm font-medium">Offline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-yellow-400 rounded border border-gray-300"></div>
          <span className="text-sm font-medium">Alert Detected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-gray-300 rounded border border-gray-300"></div>
          <span className="text-sm font-medium">Future Hours</span>
        </div>
      </div>

      {/* Vertical Uptime Chart */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-6 text-center">24-Hour Camera Uptime Status (Vertical)</h3>

        <div className="inline-flex gap-0 border-l-2 border-b-2 border-gray-400">
          {/* Y-axis (Time labels) */}
          <div className="flex flex-col-reverse justify-between pr-3 border-r-2 border-gray-400" style={{ height: '624px' }}>
            <div className="text-sm font-semibold text-gray-700 h-6 flex items-center">0:00</div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((hour) => (
              <div key={hour} className="text-xs text-gray-600 h-6 flex items-center">
                {hour}:00
              </div>
            ))}
            <div className="text-sm font-semibold text-gray-700 h-6 flex items-center">24:00</div>
          </div>

          {/* Camera columns */}
          {uptimeData.map((camera, cameraIndex) => (
            <div key={camera.cameraId} className="flex flex-col items-center border-r border-gray-300">
              {/* Camera label - moved to bottom */}
              <div className="order-2 pt-3 pb-2 text-center w-24">
                <div className="font-semibold text-sm text-gray-800">
                  Camera {camera.cameraId}
                </div>
                <div className="text-xs text-gray-600 truncate px-1">
                  {camera.cameraLocation}
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className={`w-3 h-3 rounded-full ${camera.currentStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                </div>
                <div className="text-xs text-gray-700 font-medium mt-1">
                  {camera.uptimePercentage}% up
                </div>
                {camera.totalAlerts > 0 && (
                  <div className="text-xs text-yellow-700 font-bold mt-1 bg-yellow-100 rounded px-2 py-1 inline-block">
                    ⚠️ {camera.totalAlerts}
                  </div>
                )}
              </div>

              {/* Vertical bar */}
              <div className="order-1 flex flex-col-reverse gap-0 w-24" style={{ height: '624px' }}>
                {camera.uptimeData.map((hourData) => (
                  <div
                    key={hourData.hour}
                    className={`h-6 ${getColor(hourData, isToday, currentHour)} transition-all duration-200 cursor-pointer hover:opacity-75 border-t border-white`}
                    onMouseEnter={(e) => handleMouseEnter(e, camera.cameraId, hourData.hour)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {uptimeData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No camera data available
        </div>
      )}

      <TooltipContent />
    </div>
  );
};

export default CameraUptimeAnalytics;