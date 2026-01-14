"use client";
import React, { useState } from "react";
import CameraStats from "@/components/Dashboard/CameraStats";
import CameraGrid from "@/components/Dashboard/CameraGrid";
import AlertsChart from "@/components/Dashboard/AlertsChart";
import AlertsAnalytics from "@/components/Dashboard/AlertsAnalytics";
import SystemHealth from "@/components/Dashboard/SystemHealth";

const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleGlobalRefresh = () => {
    setRefreshing(true);
    // Trigger refresh event for all components
    window.dispatchEvent(new CustomEvent('dashboardRefresh'));
    // Reset refreshing state after a short delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <>
      {/* Global Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleGlobalRefresh}
          disabled={refreshing}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors flex items-center gap-2 ${
            refreshing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {refreshing ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh All
            </>
          )}
        </button>
      </div>

      {/* Camera Grid Section - Moved to Top */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          <CameraGrid />
        </div>
      </div>

      {/* System Health Section */}
      <div className="mt-4 md:mt-6 2xl:mt-9">
        <SystemHealth />
      </div>

      {/* Camera Stats Section */}
      <div className="mt-4 md:mt-6 2xl:mt-9">
        <CameraStats />
      </div>

      {/* Alerts Section */}
      <div className="mt-4 grid grid-cols-16 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        {/* Horizontal Chart - Takes 8 columns */}
        <div className="col-span-12 xl:col-span-8">
          <AlertsChart />
        </div>

        {/* Vertical Analytics - Takes 4 columns */}
        {/* <div className="col-span-12 xl:col-span-4">
          <AlertsAnalytics />
        </div> */}
      </div>
    </>
  );
};

export default Dashboard;