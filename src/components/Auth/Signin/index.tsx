"use client";
import SigninWithPassword from "../SigninWithPassword";
import Image from "next/image";
import logo from "../../../../public/images/background/logo.png"
export default function Signin() {
  return (
    <>
      <div className="bg-white items-center border border-stroke 
       p-6 rounded-[10px] justify-center">
        <div className="mb-6 flex items-center justify-center">
          <Image src={logo} alt="logo" />
        </div>
        <div className="my-6 flex items-center justify-center">
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
          <div className="block w-full min-w-fit px-3 text-center font-medium dark:bg-gray-dark">
            Sign in
          </div>
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        </div>
        <div>
          <SigninWithPassword />
        </div>
      </div>
    </>
  );
}
