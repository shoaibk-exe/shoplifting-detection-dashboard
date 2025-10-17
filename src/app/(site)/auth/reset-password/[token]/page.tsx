import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import ResetPassword from "@/components/Auth/ResetPassword";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "This is Next.js Password Reset page for Alf Vision Dashboard",
  // other metadata
};

const ResetPasswordPage = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params;
  
  if (!token) {
    return <div>Invalid token</div>;
  }

  return (
    <div
      className="h-screen flex flex-col justify-center items-center sm:p-12.5 xl:p-15 dark:bg-gray-dark dark:shadow-card bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background/bg.jpeg')" }}
    >
      <ResetPassword token={token} />
    </div>
  );
};

export default ResetPasswordPage;