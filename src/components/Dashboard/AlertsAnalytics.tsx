"use client";
import React, { useEffect, useState } from 'react';
import { Alert } from '@/types/alert';

interface CameraAlertCount {
  cameraModel: string;
  count: number;
}

const AlertsAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalAlerts: 0,
    averagePerCamera: 0,
    cameraBreakdown: [] as CameraAlertCount[],
    loading: true
  });

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/alerts');
      const data = await response.json();

      if (data.success) {
        const alerts = data.alerts;
        const total = alerts.length;

       
        const cameraMap = alerts.reduce((acc: any, alert: any) => {
          const cameraName = alert.camera?.cameraModel || `Camera-${alert.camera_num}`;
          acc[cameraName] = (acc[cameraName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const breakdown = Object.entries(cameraMap)
          .map(([cameraModel, count]) => ({
            cameraModel,
            count: count as number
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        const uniqueCameras = Object.keys(cameraMap).length;
        const average = uniqueCameras > 0 ? Math.round(total / uniqueCameras) : 0;

        setAnalytics({
          totalAlerts: total,
          averagePerCamera: average,
          cameraBreakdown: breakdown,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(prev => ({ ...prev, loading: false }));
    }
  };

  if (analytics.loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Camera Alerts Analytics
      </h3>

      <div className="space-y-6">
        {/* Total Alerts */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Alerts
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {analytics.totalAlerts}
          </p>
        </div>

        {/* Average per Camera */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Average per Camera
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {analytics.averagePerCamera}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Camera Breakdown */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Camera Breakdown
          </p>
          <div className="space-y-2">
            {analytics.cameraBreakdown.length > 0 ? (
              analytics.cameraBreakdown.map((camera, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {camera.cameraModel}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {camera.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No alerts recorded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsAnalytics;