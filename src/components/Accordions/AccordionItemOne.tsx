import React, { useRef } from "react";
import { FaqItem } from "@/types/faqItem";

const AccordionItemOne: React.FC<FaqItem> = ({ active, handleToggle, faq }) => {
  const contentEl = useRef<HTMLDivElement>(null);

  const { header, id, text } = faq;

  return (
    <div className="shadow-card-3 rounded-[5px] border border-stroke p-4 dark:border-dark-3 dark:shadow-card sm:p-6">
      <div className="flex w-full items-center gap-1.5 sm:gap-3 xl:gap-6">
        {/* This is the text part, no toggle event here */}
        <div>
          <h4 className="text-left text-lg font-medium leading-6 text-dark dark:text-white">
            {header}
          </h4>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>

        {/* SVG icon (only this triggers the dropdown) */}
        <button
          onClick={() => handleToggle(Number(id))} // Event attached here
          className="ml-auto text-gray-500"
        >
          <svg
            className={`fill-primary stroke-primary duration-200 ease-in-out dark:fill-white dark:stroke-white ${active === id ? "rotate-180" : ""
              }`}
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3987 17.1546L20.3642 9.97156C20.7988 9.52335 20.5354 8.6665 19.9629 8.6665H6.03189C5.45944 8.6665 5.19598 9.52335 5.63062 9.97156L12.5961 17.1546C12.827 17.3927 13.1678 17.3927 13.3987 17.1546Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* This is the content that will show/hide based on the active state */}
      <div
        ref={contentEl}
        className={`ml-16.5 mt-5 duration-200 ease-in-out ${active === id ? "block" : "hidden"
          }`}
      >
        <p className="font-medium">{text}</p>
      </div>
    </div>
  );
};

export default AccordionItemOne;
