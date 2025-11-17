"use client";
import React, { useEffect, useState } from 'react';

type PythonCam = {
  camera_name: string;
  configured_fps: number;
  connection_quality: string;
  continuous_downtime_formatted: string;
  continuous_downtime_seconds: number;
  continuous_uptime_formatted: string;
  continuous_uptime_seconds: number;
  current_fps: number;
  downtime_formatted: string;
  downtime_seconds: number;
  fps_percentage: number;
  has_recent_frames: boolean;
  is_live?: string | boolean;
  status?: string;
};

const CameraStats: React.FC = () => {
  const [cams, setCams] = useState<PythonCam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/camera-config', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success && data?.cameras) {
        const normalized: PythonCam[] = Array.isArray(data.cameras)
          ? data.cameras
          : Object.values(data.cameras);
        setCams(normalized as PythonCam[]);
      } else {
        setCams([]);
      }
    } catch {
      setCams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  const camEntries = cams;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Camera Runtime Stats</h2>
      {camEntries.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No camera runtime data available</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {camEntries.map((cam, index) => {
          const fpsPercent =
            typeof cam.fps_percentage === 'number'
              ? cam.fps_percentage.toFixed(1)
              : cam.configured_fps
              ? ((cam.current_fps / cam.configured_fps) * 100).toFixed(1)
              : '0';
          const connectionQuality =
            cam.connection_quality ||
            (cam.connection_ok === true
              ? 'Good'
              : cam.connection_ok === false
              ? 'Poor'
              : cam.is_streaming
              ? 'Active'
              : 'Unknown');
          const hasRecent = cam.has_recent_frames ?? cam.is_streaming ?? false;
          const cameraLabel =
            cam.camera_name ||
            cam.cameraModel ||
            cam.cameraLocation ||
            `Camera ${cam.camera_db_id || cam.id || index + 1}`;
          const statusText = (cam.status || (cam.is_streaming ? 'ONLINE' : cam.cameraStatus)) || 'UNKNOWN';
          const statusUpper = statusText.toUpperCase();
          const uptimeFormatted = (cam as any).uptime_formatted || cam?.continuous_uptime_formatted || '-';
          const uptimeSeconds = (cam as any).uptime_seconds ?? cam?.continuous_uptime_seconds ?? '-';
          const downtimeFormatted = cam.downtime_formatted || cam.continuous_downtime_formatted || '-';
          const downtimeSeconds = cam.downtime_seconds ?? cam.continuous_downtime_seconds ?? '-';
          const continuousUpFormatted = cam.continuous_uptime_formatted || '-';
          const continuousUpSeconds = cam.continuous_uptime_seconds ?? '-';
          const continuousDownFormatted = cam.continuous_downtime_formatted || '-';
          const continuousDownSeconds = cam.continuous_downtime_seconds ?? '-';

          return (
          <div key={`${cameraLabel}-${index}`} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Camera</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">{cameraLabel}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                <div className={`text-sm font-semibold ${
                  statusUpper === 'ONLINE' ? 'text-green-600 dark:text-green-400'
                  : statusUpper === 'DEGRADED' ? 'text-yellow-600 dark:text-yellow-400'
                  : statusUpper === 'ACTIVE' ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
                }`}>
                  {statusText}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Configured FPS</div>
                <div className="font-semibold text-gray-900 dark:text-white">{cam.configured_fps ?? '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Current FPS</div>
                <div className="font-semibold text-gray-900 dark:text-white">{cam.current_fps ?? '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">FPS %</div>
                <div className="font-semibold text-gray-900 dark:text-white">{fpsPercent !== '0' ? `${fpsPercent}%` : '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Connection</div>
                <div className="font-semibold text-gray-900 dark:text-white">{connectionQuality}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Has Recent Frames</div>
                <div className={`font-semibold ${hasRecent ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {hasRecent ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Live</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {typeof cam.is_live === 'string'
                    ? cam.is_live
                    : cam.is_streaming
                    ? 'ONLINE'
                    : cam.is_streaming === false
                    ? 'OFFLINE'
                    : cam.is_live
                    ? 'ONLINE'
                    : 'OFFLINE'}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900/30">
                <div className="text-xs text-gray-500 dark:text-gray-400">Continuous Uptime</div>
                <div className="font-semibold text-gray-900 dark:text-white">{continuousUpFormatted}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{continuousUpSeconds}s</div>
              </div>
              <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900/30">
                <div className="text-xs text-gray-500 dark:text-gray-400">Continuous Downtime</div>
                <div className="font-semibold text-gray-900 dark:text-white">{continuousDownFormatted}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{continuousDownSeconds}s</div>
              </div>
              <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900/30">
                <div className="text-xs text-gray-500 dark:text-gray-400">Uptime</div>
                <div className="font-semibold text-gray-900 dark:text-white">{uptimeFormatted}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{uptimeSeconds}s</div>
              </div>
              <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-900/30">
                <div className="text-xs text-gray-500 dark:text-gray-400">Downtime</div>
                <div className="font-semibold text-gray-900 dark:text-white">{downtimeFormatted}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{downtimeSeconds}s</div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default CameraStats;