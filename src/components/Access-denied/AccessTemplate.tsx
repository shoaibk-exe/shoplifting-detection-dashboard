import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/images/Icons";
const AccessTemplate = () => {
    return (
        <div className="mx-auto w-full">
            <div className="bg-white px-5 py-10 shadow-1 dark:bg-gray-dark dark:shadow-card sm:py-17.5">
                <div className="mx-auto w-full max-w-[575px] px-4 sm:px-8 xl:px-0">
                    <div className="relative z-1 lg:pt-15 xl:pt-20 2xl:pt-[187px]">
                        <div className="absolute left-0 top-0 -z-1">
                            <Image
                                src="/images/grids/grid-01.svg"
                                alt="grid"
                                width={575}
                                height={460}
                                className="dark:opacity-20"
                            />
                        </div>

                        <div className="text-center">
                            <div className="mx-auto mb-10 flex h-28.5 w-full max-w-[114px] items-center justify-center rounded-full border border-stroke bg-white text-dark shadow-error dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                                <Icons.accessDenied />
                            </div>

                            <h1 className="mb-5 text-heading-4 font-black text-dark dark:text-white lg:text-heading-3">
                                Access Denied
                            </h1>

                            <p className="mx-auto w-full max-w-[355px]">
                                You have no access to this page. Here are some
                                helpful links:
                            </p>

                            <Link
                                href="/"
                                className="mt-8 inline-flex items-center gap-2 rounded-[7px] bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90"
                            >
                                <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15.7492 8.38125H3.73984L8.52109 3.51562C8.77422 3.2625 8.77422 2.86875 8.52109 2.61562C8.26797 2.3625 7.87422 2.3625 7.62109 2.61562L1.79922 8.52187C1.54609 8.775 1.54609 9.16875 1.79922 9.42188L7.62109 15.3281C7.73359 15.4406 7.90234 15.525 8.07109 15.525C8.23984 15.525 8.38047 15.4687 8.52109 15.3562C8.77422 15.1031 8.77422 14.7094 8.52109 14.4563L3.76797 9.64687H15.7492C16.0867 9.64687 16.368 9.36562 16.368 9.02812C16.368 8.6625 16.0867 8.38125 15.7492 8.38125Z"
                                        fill=""
                                    />
                                </svg>

                                <span>Back to Home</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccessTemplate