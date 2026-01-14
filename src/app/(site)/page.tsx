"use client";
import Dashboard from "@/components/Dashboard/Dashboard";
// import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import WebcamComponent from "@/components/Live-Stream/webCam";


import { pusherClient } from "@/libs/pusher";
import { sendMessage } from "@/actions/message.action";

import { useEffect, useState } from "react";
// export const metadata: Metadata = {
//   title:
//     "Dashboard | Alf Vision Dashboard",
//   description: "This is Dashboard page for Alf Vision Dashboard",
// };

// Client component - no caching needed
export default function Home() {


  return (
    <>
      <DefaultLayout>
        <Dashboard />
        {/* <WebcamComponent /> */}
      </DefaultLayout>
    </>
  );
}
