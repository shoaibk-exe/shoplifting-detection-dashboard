"use client";
import React, { useEffect, useState } from "react";

interface Alert {
    id: number;
    alert_number: string;
    date: string;
    time: string;
    alert_link?: string;
    camera?: {
        cameraModel: string;
        cameraLocation: string;
    };
}

const ShopliftingAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch alerts dynamically from API
    useEffect(() => {
        async function fetchAlerts() {
            try {
                const res = await fetch("/api/alerts?limit=20", { cache: "no-store" });
                const data = await res.json();

                if (data.success) {
                    setAlerts(data.alerts);
                } else {
                    console.error("Failed to load alerts:", data.error);
                }
            } catch (err) {
                console.error("Error fetching alerts:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAlerts();

        // Optional: auto-refresh every 15 seconds
        const interval = setInterval(fetchAlerts, 15000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10">
                <p className="text-lg font-medium">Loading alerts...</p>
            </div>
        );
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                    🚨 Shoplifting Alerts
                </h2>
                <p className="text-sm text-body mt-2">
                    Real-time alerts from AI detection system
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
                <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black dark:text-white">
                                {alerts.length}
                            </h4>
                            <span className="text-sm font-medium">Total Alerts</span>
                        </div>
                        <div className="text-3xl">🔔</div>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-red-500">
                                {
                                    alerts.filter((a) =>
                                        a.alert_number.toLowerCase().includes("high")
                                    ).length
                                }
                            </h4>
                            <span className="text-sm font-medium">High Priority</span>
                        </div>
                        <div className="text-3xl">⚠️</div>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-yellow-500">
                                {alerts.filter((a) => a.alert_number.includes("Review")).length}
                            </h4>
                            <span className="text-sm font-medium">Under Review</span>
                        </div>
                        <div className="text-3xl">👁️</div>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-green-500">
                                {alerts.filter((a) => a.alert_number.includes("Resolved")).length}
                            </h4>
                            <span className="text-sm font-medium">Resolved</span>
                        </div>
                        <div className="text-3xl">✅</div>
                    </div>
                </div>
            </div>

            {/* Alerts Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Alert ID
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Camera
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Time
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Description
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr
                                key={alert.id}
                                className="border-b border-stroke dark:border-strokedark"
                            >
                                <td className="px-4 py-5">
                                    <p className="text-black dark:text-white">
                                        #{alert.alert_number}
                                    </p>
                                </td>
                                <td className="px-4 py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🎥</span>
                                        <p className="text-sm text-black dark:text-white">
                                            {alert.camera?.cameraModel} -{" "}
                                            {alert.camera?.cameraLocation || "N/A"}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-5">
                                    <p className="text-sm text-black dark:text-white">
                                        {new Date(alert.date).toLocaleString()} {alert.time}
                                    </p>
                                </td>
                                <td className="px-4 py-5">
                                    <p className="text-sm text-black dark:text-white">
                                        {alert.alert_link
                                            ? "AI detected suspicious movement"
                                            : "No details available"}
                                    </p>
                                </td>
                                <td className="px-4 py-5">
                                    <a
                                        href={alert.alert_link || "#"}
                                        target="_blank"
                                        className="text-blue-500 hover:underline"
                                    >
                                        View
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShopliftingAlerts;
