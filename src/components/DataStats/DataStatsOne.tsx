import React from "react";
import { dataStats } from "@/types/dataStats";
import { Icons } from "@/images/Icons";
const dataStatsList = [
  {
    icon: (
      <svg
        width="105px"
        height="105px"
        viewBox="-5.76 -5.76 35.52 35.52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#ffffff"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>
    ),
    color: "#3FD97F",
    title: "20 Devices Added",
    value: "Devices",
    growthRate: 0.43,
  },
  {
    icon: (
      <svg
        width="91px"
        height="91px"
        viewBox="-23.52 -23.52 95.04 95.04"
        xmlns="http://www.w3.org/2000/svg"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="0.00048000000000000007"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path d="M0 0h48v48H0z" fill="none"></path>{" "}
          <g id="Shopicon">
            {" "}
            <path d="M31.278,25.525C34.144,23.332,36,19.887,36,16c0-6.627-5.373-12-12-12c-6.627,0-12,5.373-12,12 c0,3.887,1.856,7.332,4.722,9.525C9.84,28.531,5,35.665,5,44h38C43,35.665,38.16,28.531,31.278,25.525z M16,16c0-4.411,3.589-8,8-8 s8,3.589,8,8c0,4.411-3.589,8-8,8S16,20.411,16,16z M24,28c6.977,0,12.856,5.107,14.525,12H9.475C11.144,33.107,17.023,28,24,28z"></path>{" "}
          </g>{" "}
        </g>
      </svg>
    ),
    color: "#FF9C55",
    title: "3 Admins Added",
    value: "Admins",
    growthRate: 4.35,
  },
  // {
  //   icon: <Icons.packageIconForStat />,
  //   color: "#8155FF",
  //   title: "Total Product",
  //   value: "2.450",
  //   growthRate: 2.59,
  // },
  {
    icon: <Icons.usersIconForStat />,
    color: "#18BFFF",
    title: "6 Members Added",
    value: "Members",
    growthRate: -0.95,
  },
];

const DataStatsOne: React.FC<dataStats> = () => {
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5">
        {dataStatsList.map((item, index) => (
          <div
            key={index}
            className="flex w-full items-center justify-between rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
          >
            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                  {item.value}
                </h4>
                <span className="text-body-sm font-medium">{item.title}</span>
              </div>

              {/* <span
                className={`flex items-center gap-1.5 text-body-sm font-medium ${item.growthRate > 0 ? "text-green" : "text-red"
                  }`}
              >
                {item.growthRate}%
                {item.growthRate > 0 ? (
                  <svg
                    className="fill-current"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z"
                      fill=""
                    />
                  </svg>
                ) : (
                  <svg
                    className="fill-current"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.64284 7.6075L9.09102 4.255L10 5.13875L5 10L-8.98488e-07 5.13875L0.908973 4.255L4.35716 7.6075L4.35716 7.6183e-07L5.64284 9.86625e-07L5.64284 7.6075Z"
                      fill=""
                    />
                  </svg>
                )}
              </span> */}
            </div>

            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DataStatsOne;
