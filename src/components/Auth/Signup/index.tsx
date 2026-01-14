"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/images/background/logo.png";
import SignupWithPassword from "../SignupWithPassword";

export default function Signup() {
  return (
    <>
      <div className="w-full items-center justify-center rounded-[10px] border border-stroke bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <Image src={logo} alt="logo" />
        </div>
        <div className="my-6 flex items-center justify-center">
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
          <div className="block w-full min-w-fit px-3 text-center font-medium dark:bg-gray-dark">
            Sign up
          </div>
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        </div>
        <div>
          <SignupWithPassword />
        </div>
        <div className="mt-4.5 text-center font-medium">
          <p>
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
