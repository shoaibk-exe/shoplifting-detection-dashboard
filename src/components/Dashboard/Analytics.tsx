"use client";
import React from "react";
import ChartFour from "../Charts/ChartFour";
import DataStatsTwo from "../DataStats/DataStatsTwo";
import ChartThree from "../Charts/ChartThree";
import TopContent from "../TopContent";
import TopChannels from "../TopChannels";
import TableTwo from "../Tables/TableTwo";
import MapTwo from "@/components/Maps/MapTwo";
import DatepickerBox from "@/components/DatepickerBox";
import DefaultSelectOptionTwo from "@/components/SelectOption/DefaultSelectOptionTwo";

const Analytics: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-3">
          <DatepickerBox />
          <DefaultSelectOptionTwo options={["Monthly", "Yearly"]} />
        </div>
        <ChartFour />
      </div>
    </>
  );
};

export default Analytics;
