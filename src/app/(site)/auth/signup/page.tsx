import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Signup from "@/components/Auth/Signup";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js SignUp Page NextAdmin Dashboard Kit",
  // other metadata
};

const SignUp: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Sign Up" />

      <div className="rounded-[10px] bg-white dark:bg-gray-dark dark:shadow-card">
        <div className="flex justify-center flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signup />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignUp;
