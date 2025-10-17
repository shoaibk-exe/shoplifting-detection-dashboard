import React from "react";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Forgot Password`,
  description: `This is Forgot Password page for Alf Vision Dashboard`,
};

const ForgotPasswordPage = () => {
  return (
    <div
      className="h-screen flex justify-center items-center sm:p-12.5 xl:p-15 dark:bg-gray-dark dark:shadow-card bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background/bg.jpeg')" }}
    >
      <ForgotPassword />
    </div>

  );
};

export default ForgotPasswordPage;
