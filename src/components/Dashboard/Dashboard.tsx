"use client";
import React from "react";
import CameraStats from "@/components/Dashboard/CameraStats";
import CameraGrid from "@/components/Dashboard/CameraGrid";
import AlertsChart from "@/components/Dashboard/AlertsChart";
import AlertsAnalytics from "@/components/Dashboard/AlertsAnalytics";
import SystemHealth from "@/components/Dashboard/SystemHealth";

const Dashboard: React.FC = () => {
  return (
    <>
      {/* System Health Section */}
      <div className="mt-4 md:mt-6 2xl:mt-9">
        <SystemHealth />
      </div>

      {/* Camera Grid Section */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          <CameraGrid />
        </div>
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