"use client";
import React from "react";
import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import MapOne from "../Maps/MapOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import Analytics from "./Analytics";
const Dashboard: React.FC = () => {
  return (
    <>
      <DataStatsOne />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        {/* <ChartOne /> */}
        <div className="col-span-12">
          <Analytics />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
