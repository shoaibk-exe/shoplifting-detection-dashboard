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

interface GPUInfo {
  id: number;
  utilizationPercent: number;
  memoryStatus: string;
  allocatedGB: number;
  reservedGB: number;
  available: boolean;
  createdAt: string;
}

const SystemHealth: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [gpuInfo, setGpuInfo] = useState<GPUInfo | null>(null);
  const [loading, setLoading] = useState(true);

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
      
      const [statusRes, gpuRes] = await Promise.all([
        fetch('/api/system-status'),
        fetch('/api/gpu-info'),
      ]);

      const statusData = await statusRes.json();
      const gpuData = await gpuRes.json();

      if (statusData.success) {
        setSystemStatus(statusData.status);
      }

      if (gpuData.success) {
        setGpuInfo(gpuData.gpuInfo);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
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

  const getMemoryStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'HIGH':
        return 'text-red-600 dark:text-red-400';
      case 'MEDIUM':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'LOW':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Health & Status
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time system monitoring and GPU information
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
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

      {/* GPU Info Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              GPU Status
            </p>
            {gpuInfo ? (
              <>
                <div className="flex items-center gap-2">
                  <h3 className={`text-3xl font-bold ${getHealthColor(gpuInfo.utilizationPercent > 80 ? 'CRITICAL' : gpuInfo.utilizationPercent > 50 ? 'DEGRADED' : 'HEALTHY')}`}>
                    {gpuInfo.utilizationPercent.toFixed(1)}%
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">utilization</span>
                </div>
                <p className={`text-xs font-medium mt-1 ${getMemoryStatusColor(gpuInfo.memoryStatus)}`}>
                  Memory: {gpuInfo.memoryStatus}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
        </div>

        {gpuInfo && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Allocated:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {gpuInfo.allocatedGB.toFixed(2)} GB
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Reserved:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {gpuInfo.reservedGB.toFixed(2)} GB
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Available:</span>
              <span className={`font-semibold ${gpuInfo.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {gpuInfo.available ? 'Yes' : 'No'}
              </span>
            </div>
            {gpuInfo.createdAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                Last updated: {new Date(gpuInfo.createdAt).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default SystemHealth;

