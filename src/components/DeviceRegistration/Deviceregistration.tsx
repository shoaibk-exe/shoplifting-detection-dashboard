"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "@/images/Icons";
import { RegisterCamera } from "@/actions/camera";
import toast from "react-hot-toast";
const Deviceregistration: React.FC = () => {
  const initialCamera = {
    cameraModel: "",
    cameraIp: "",
    cameraUsername: "",
    cameraPassword: "",
    cameraLocation: "",
  }

  const [camera, setCamera] = useState(initialCamera);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    model: false,
    location: false,
  });

  const toggleDropdown = (name: any, value: Boolean) => {
    setDropdownOpen((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleChange = (e: ChangeEvent | any) => {
    const { name, value } = e.target as any;
    setCamera(pre => {
      return {
        ...pre,
        [name]: value
      }
    })
  }
  const cameraModels = ["Wyze", "CCTV", "TVs", "IP Camera", "ESP32s-CAM"]
  const cameraLocations = ["Indoor", "Outdoor", "Office", "Home", "Hallway", "Store"]
  const onSubmit = async () => {
    const { status, message } = await RegisterCamera(camera);
    if (status !== 200) {
      setLoading(false)
      toast.error(message)
    } else {
      setLoading(false)
      toast.success(message)
      setCamera(initialCamera)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 p-12 gap-8 rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card  flex-row">
      <div className="col-span-1">
        <div className="flex items-center justify-between text-1xl text-dark dark:text-white mb-3">
          Camera Model
        </div>
        <div className="w-full relative mb-4 inline-block">
          <button
            onClick={() => {
              const value = !dropdownOpen.model
              toggleDropdown("model", value)
            }}
            className="w-full flex justify-between items-center gap-2.5 rounded-[7px] bg-primary border dark:border-dark-3 dark:bg-dark-2 dark:text-white-4 p-4 font-medium text-white hover:bg-opacity-95"
          >
            <Icons.camera />
            {camera.cameraModel === "" ? "Select Camera Model" : camera.cameraModel}
            <svg
              className={`fill-current duration-200 ease-linear ${dropdownOpen.model && "rotate-180"
                }`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.69344 7.09327C3.91808 6.83119 4.31265 6.80084 4.57472 7.02548L10.0013 11.6768L15.4279 7.02548C15.69 6.80084 16.0845 6.83119 16.3092 7.09327C16.5338 7.35535 16.5035 7.74991 16.2414 7.97455L10.4081 12.9745C10.174 13.1752 9.82862 13.1752 9.59457 12.9745L3.76124 7.97455C3.49916 7.74991 3.46881 7.35535 3.69344 7.09327Z"
                fill=""
              />
            </svg>
          </button>

          {dropdownOpen.model && (
            <div
              className="absolute left-0 top-full z-40 mt-2 w-full rounded-[7px] border border-stroke bg-white py-3 shadow-card-4 dark:border-dark-3 dark:bg-dark-2 over"
            >
              <ul className="flex flex-col">
                {
                  cameraModels.map((item, index) => {
                    const e = {
                      target: {
                        name: "cameraModel",
                        value: item
                      }
                    }
                    return (
                      <li key={index} onClick={() => {
                        handleChange(e)
                        toggleDropdown("model", false)
                      }}>
                        <Link
                          href="#"
                          className="flex px-5 py-[7px] font-medium hover:bg-gray-2 hover:text-primary dark:hover:bg-dark-4 dark:hover:text-white"
                        >
                          {item}
                        </Link>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <label
          htmlFor="email"
          className="flex items-center justify-between text-1xl text-dark dark:text-white mb-3"
        >
          Camera Ip
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter camera Ip"
            name="cameraIp"
            value={camera.cameraIp}
            onChange={(e) => {
              handleChange(e)
            }}

            className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </span>
        </div>
        <div className="text-right mt-5">
          <label
            htmlFor="name"
            className="flex items-center justify-between text-1xl text-dark dark:text-white mb-3"
          >
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your username"
              name="cameraUsername"
              value={camera.cameraUsername}
              onChange={(e) => {
                handleChange(e)
              }}
              className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />

            <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
              <Icons.envalop />
            </span>
          </div>
        </div>
        <div className="hidden lg:block w-full text-center my-16">
          <button onClick={() => { onSubmit() }} className="block w-full rounded-[5px] border border-primary bg-primary p-4 text-center font-medium text-white transition hover:bg-opacity-90">
            Register Camera
            {
              loading && <span
                className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-white dark:border-t-transparent`}
              ></span>
            }
          </button>
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex items-center justify-between text-1xl text-dark dark:text-white mb-3">
          Camera Location
        </div>
        <div className="w-full relative mb-4 inline-block">
          <button
            onClick={() => {
              const value = !dropdownOpen.location
              toggleDropdown("location", value)
            }}
            className="w-full flex justify-between items-center gap-2.5 rounded-[7px] bg-white border dark:border-dark-3 dark:bg-dark-2 dark:text-gray-4 p-4 font-medium text-gray-6 hover:bg-opacity-95"
          >
            <Icons.Globe />
            {camera.cameraLocation === "" ? "Select Camera Location" : camera.cameraLocation}
            <svg
              className={`fill-current duration-200 ease-linear ${dropdownOpen.location && "rotate-180"
                }`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.69344 7.09327C3.91808 6.83119 4.31265 6.80084 4.57472 7.02548L10.0013 11.6768L15.4279 7.02548C15.69 6.80084 16.0845 6.83119 16.3092 7.09327C16.5338 7.35535 16.5035 7.74991 16.2414 7.97455L10.4081 12.9745C10.174 13.1752 9.82862 13.1752 9.59457 12.9745L3.76124 7.97455C3.49916 7.74991 3.46881 7.35535 3.69344 7.09327Z"
                fill=""
              />
            </svg>
          </button>

          {dropdownOpen.location && (
            <div
              className="absolute left-0 top-full z-40 mt-2 w-full rounded-[7px] border border-stroke bg-white py-3 shadow-card-4 dark:border-dark-3 dark:bg-dark-2 over"
            >
              <ul className="flex flex-col">
                {
                  cameraLocations.map((item, index) => {
                    const e = {
                      target: {
                        name: "cameraLocation",
                        value: item
                      }
                    }
                    return (
                      <li key={index} onClick={() => {
                        handleChange(e)
                        toggleDropdown("location", false)
                      }}>
                        <Link
                          href="#"
                          className="flex px-5 py-[7px] font-medium hover:bg-gray-2 hover:text-primary dark:hover:bg-dark-4 dark:hover:text-white"
                        >
                          {item}
                        </Link>
                      </li>
                    )
                  })
                }
                {/* <li>
                  <Link
                    href="#"
                    className="flex px-5 py-[7px] font-medium hover:bg-gray-2 hover:text-primary dark:hover:bg-dark-4 dark:hover:text-white"
                  >
                    Indoor
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex px-5 py-[7px] font-medium hover:bg-gray-2 hover:text-primary dark:hover:bg-dark-4 dark:hover:text-white"
                  >
                    Outdoor
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex px-5 py-[7px] font-medium hover:bg-gray-2 hover:text-primary dark:hover:bg-dark-4 dark:hover:text-white"
                  >
                    Hallway
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex px-5 py-[7px] font-medium hover:bg-gray-2 hover:text-primary dark:hover:bg-dark-4 dark:hover:text-white"
                  >
                    Office
                  </Link>
                </li> */}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-1">
          <label
            htmlFor="text"
            className="flex items-center justify-between text-1xl text-dark dark:text-white mb-3"
          >
            Password
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="6+ Characters, 1 Capital Letter"
              name="cameraPassword"
              value={camera.cameraPassword}
              onChange={(e) => {
                handleChange(e)
              }}

              className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />

            <span className="absolute right-5 top-1/2 -translate-y-1/2">
              <Icons.passwordLock />
            </span>
          </div>
        </div>
      </div>
      <div className="block lg:hidden w-full text-center my-2" >
        <button onClick={() => { onSubmit() }} className="block w-full rounded-[5px] border border-primary bg-primary p-4 text-center font-medium text-white transition hover:bg-opacity-90">
          Register Camera
          {
            loading && <span
              className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-white dark:border-t-transparent`}
            ></span>
          }
        </button>
      </div>
    </div>
  );
};

export default Deviceregistration;
