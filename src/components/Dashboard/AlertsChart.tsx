"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Alert {
  id: number;
  alert_number: string;
  date: string; // Changed to string since API serializes to ISO string
  time: string;
  alert_link?: string;
  camera_num: number;
  createdAt?: string;
  updatedAt?: string;
  camera?: {
    id: true;
    cameraModel: true;
    cameraLocation: true;
  };
}

interface ChartData {
  date: string;
  count: number;
}

interface CameraData {
  camera: string;
  alerts: number;
}

const AlertsAnalytics: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dailyData, setDailyData] = useState<ChartData[]>([]);
  const [cameraData, setCameraData] = useState<CameraData[]>([]);
  const [timeRange, setTimeRange] = useState<number>(30); // Default: last 30 days
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      processChartData();
    }
  }, [alerts, timeRange]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/alerts');
      const result = await response.json();
      
      if (result.success) {
        setAlerts(result.alerts);
      } else {
        setError('Failed to fetch alerts');
      }
    } catch (err) {
      setError('Error fetching alerts data');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = () => {
    // Filter alerts based on time range
    const filteredAlerts = filterAlertsByTimeRange(alerts, timeRange);
    
    // Process daily alerts data
    const dailyCounts = calculateDailyAlerts(filteredAlerts);
    setDailyData(dailyCounts);

    // Process camera-wise data
    const cameraCounts = calculateCameraAlerts(filteredAlerts);
    setCameraData(cameraCounts);
  };

  const filterAlertsByTimeRange = (alerts: Alert[], days: number): Alert[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return alerts.filter(alert => {
      const alertDate = new Date(alert.date);
      return alertDate >= cutoffDate;
    });
  };

  const calculateDailyAlerts = (alerts: Alert[]): ChartData[] => {
    const counts: { [key: string]: number } = {};

    alerts.forEach(alert => {
      const date = new Date(alert.date).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculateCameraAlerts = (alerts: Alert[]): CameraData[] => {
    const counts: { [key: string]: number } = {};

    alerts.forEach(alert => {
      const cameraKey = `Camera ${alert.camera_num}`;
      counts[cameraKey] = (counts[cameraKey] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([camera, alerts]) => ({ camera, alerts }))
      .sort((a, b) => b.alerts - a.alerts);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`Date: ${label}`}</p>
          <p className="text-blue-600">{`Alerts: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading alerts analytics...</div>
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

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Alerts Analytics</h2>
      
      {/* Time Range Selector */}
      <div className="mb-6">
        <label className="mr-4 font-semibold">Time Range:</label>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
          <option value={0}>All time</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800">Total Alerts</h3>
          <p className="text-2xl font-bold text-blue-600">{alerts.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800">Current Period</h3>
          <p className="text-2xl font-bold text-green-600">{dailyData.reduce((sum, day) => sum + day.count, 0)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800">Cameras</h3>
          <p className="text-2xl font-bold text-purple-600">{cameraData.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Alerts Line Chart */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-center">Daily Alerts Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#ff7300' }}
                name="Alerts Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Camera Distribution Bar Chart */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-center">Alerts by Camera</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cameraData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="camera" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="alerts" 
                fill="#82ca9d" 
                name="Number of Alerts"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Camera Distribution Pie Chart */}
        {cameraData.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-center">Camera Alert Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cameraData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ camera, alerts, percent }) => 
                    `${camera}: ${alerts} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="alerts"
                  nameKey="camera"
                >
                  {cameraData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      {/* <div className="mt-6 text-center">
        <button
          onClick={fetchAlerts}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Refresh Data
        </button>
      </div> */}
    </div>
  );
};

export default AlertsAnalytics;