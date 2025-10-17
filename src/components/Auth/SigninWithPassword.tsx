"use client";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Icons } from "@/images/Icons";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.email) {
      return toast.error("Please enter your email address.");
    }

    setLoading(true);

    signIn("credentials", { ...data, redirect: false }).then((callback) => {

      if (callback?.status === 401) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      if (callback?.ok && !callback?.error) {
        toast.success("Logged in successfully");
        setLoading(false);
        setData({ email: "", password: "", remember: false });
        router.push("/");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email"
            value={data.email}
            name="email"
            onChange={handleChange ? (e) => handleChange(e) : undefined}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            <Icons.envalop />
          </span>
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="password"
            value={data.password}
            placeholder="Enter your password"
            onChange={handleChange ? (e) => handleChange(e) : undefined}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            <Icons.passwordLock />
          </span>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-20 py-2">
        <label
          htmlFor="remember"
          className="flex cursor-pointer select-none items-center font-satoshi text-base font-medium text-dark dark:text-white"
        >
          <input
            type="checkbox"
            name="remember"
            id="remember"
            className="peer sr-only"
            onChange={(e) =>
              setData({
                ...data,
                remember: e.target.checked,
              })
            }
          />
          <span
            className={`mr-2.5 inline-flex h-5.5 w-5.5 items-center justify-center rounded-md border border-stroke bg-white text-white text-opacity-0 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-opacity-100 dark:border-stroke-dark dark:bg-white/5 ${data.remember ? "bg-primary" : ""
              }`}
          >
            <Icons.rememberMeCheck />
          </span>
          Remember me
        </label>

        <Link
          href="/auth/forgot-password"
          className="select-none font-satoshi text-base font-medium text-dark duration-300 hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span
              className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent`}
            ></span>
          )}
        </button>
      </div>
    </form>
  );
}
