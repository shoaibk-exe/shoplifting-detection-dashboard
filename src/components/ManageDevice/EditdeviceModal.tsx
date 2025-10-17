"use client";
import React, { useState } from "react";
import ClickOutside from "@/components/ClickOutside";
import { Icons } from "@/images/Icons";
import Link from "next/link";
import ButtonDefault from "../Buttons/ButtonDefault";

interface EditdeviceModalProps {
    modalOpen: boolean;
    setModalOpen: ({
        Editdevice,
        deletedevice,
        deviceView,
    }: {
        Editdevice: boolean;
        deletedevice: boolean;
        deviceView: boolean;
    }) => void;
}

const EditdeviceModal: React.FC<EditdeviceModalProps> = ({
    modalOpen,
    setModalOpen,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };
    const toggleDropdown1 = () => {
        setDropdownOpen1((prev) => !prev);
    };
    const [toggleStates, setToggleStates] = useState({
        disable: false,
        videoRecording: false,
        autoActionFlash: false,
        voice: false,
    });

    const handleToggle = (toggleName: string) => {
        setToggleStates((prevStates) => ({
            ...prevStates,
            [toggleName as keyof typeof toggleStates]:
                !prevStates[toggleName as keyof typeof toggleStates],
        }));
    };
    const [selectedCameraModel1, setSelectedCameraModel1] = useState("CCTV");

    const handleCameraModelChange1 = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSelectedCameraModel1(event.target.value);
    };
    const [selectedCameraModel, setSelectedCameraModel] =
        useState("87805 Bauch Plaza");

    const handleCameraModelChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSelectedCameraModel(event.target.value);
    };
    return (
        <>
            {modalOpen && (
                <div
                    className={`fixed left-0 top-0 z-999999 grid h-full min-h-screen w-full items-center justify-center bg-[#27918f36] bg-opacity-10`}
                >
                    <div className="w-full grid max-w-[750px] rounded-[15px] bg-white p-4 text-center dark:bg-gray-dark dark:shadow-card md:p-6">
                        <div
                            className="mb-2 flex cursor-pointer justify-end"
                            onClick={() => {
                                setModalOpen({
                                    Editdevice: false,
                                    deletedevice: false,
                                    deviceView: false,
                                });
                            }}
                        >
                            <Icons.closeIcon />
                        </div>
                        <div className="grid grid-cols-12 gap-4">

                            <div className="col-span-6">
                                <div className="text-1xl mb-3 flex items-center justify-between font-bold text-dark dark:text-white">
                                    Camera Model
                                </div>
                                <div className="relative inline-block w-full">
                                    <select
                                        value={selectedCameraModel1}
                                        onChange={handleCameraModelChange1}
                                        className="w-full rounded-[7px] border bg-white p-4 font-medium text-gray-6 hover:bg-opacity-95 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-4"
                                    >
                                        <option value="87805 Bauch Plaza">CCTV</option>
                                        <option value="TVs">TVs</option>
                                        <option value="IP Cameras">IP Cameras</option>
                                        <option value="ESP32s-CAM">ESP32s-CAM</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-6 text-left">
                                <label
                                    htmlFor="text"
                                    className="text-1xl mb-2.5 block font-bold text-dark dark:text-white"
                                >
                                    Camera Ip
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="192.168.1.100"
                                        name="IP"
                                        className="w-full rounded-lg border border-stroke bg-transparent p-4 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                    />

                                    <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-12">
                                <div className="text-1xl mb-3 flex items-center justify-between font-bold text-dark dark:text-white">
                                    Camera Location
                                </div>
                                <div className="relative inline-block w-full">
                                    <select
                                        value={selectedCameraModel}
                                        onChange={handleCameraModelChange}
                                        className="w-full rounded-[7px] border bg-white p-4 font-medium text-gray-6 hover:bg-opacity-95 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-4"
                                    >
                                        <option value="87805 Bauch Plaza">87805 Bauch Plaza</option>
                                        <option value="Dallas">Dallas</option>
                                        <option value="New York">New York</option>
                                        <option value="Texas">Texas</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-6 flex justify-between">
                                <div className="col-span-3">
                                    <h1 className="text-left font-bold text-dark dark:text-white">
                                        Disable
                                    </h1>
                                </div>
                                <div className="col-span-3 justify-right">
                                    <label
                                        htmlFor="toggleDisable"
                                        className="flex cursor-pointer select-none items-center"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="toggleDisable"
                                                className="sr-only"

                                                onChange={() => handleToggle("disable")}
                                                checked={toggleStates.disable}
                                            />
                                            <div className="block h-8 w-14 rounded-full bg-gray-3 dark:bg-[#5A616B]"></div>
                                            <div
                                                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-switch-1 transition ${toggleStates.disable &&
                                                    "!right-1 !translate-x-full !bg-primary dark:!bg-primary"
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="col-span-6 flex justify-between">
                                <div className="col-span-3">
                                    <h1 className="text-left font-bold text-dark dark:text-white">
                                        Video Recording
                                    </h1>
                                </div>
                                <div className="col-span-3 justify-end">
                                    <label
                                        htmlFor="toggleVideoRecording"
                                        className="flex cursor-pointer select-none items-center"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="toggleVideoRecording"
                                                className="sr-only"
                                                onChange={() => handleToggle("videoRecording")}
                                                checked={toggleStates.videoRecording}
                                            />
                                            <div className="block h-8 w-14 rounded-full bg-gray-3 dark:bg-[#5A616B]"></div>
                                            <div
                                                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-switch-1 transition ${toggleStates.videoRecording &&
                                                    "!right-1 !translate-x-full !bg-primary dark:!bg-primary"
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="col-span-6 flex justify-between">
                                <div className="col-span-3">
                                    <h1 className="text-left font-bold text-dark dark:text-white">
                                        Auto Action/Flash
                                    </h1>
                                </div>
                                <div className="col-span-3 justify-end">
                                    <label
                                        htmlFor="toggleAutoActionFlash"
                                        className="flex cursor-pointer select-none items-center"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="toggleAutoActionFlash"
                                                className="sr-only"
                                                onChange={() => handleToggle("autoActionFlash")}
                                                checked={toggleStates.autoActionFlash}
                                            />
                                            <div className="block h-8 w-14 rounded-full bg-gray-3 dark:bg-[#5A616B]"></div>
                                            <div
                                                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-switch-1 transition ${toggleStates.autoActionFlash &&
                                                    "!right-1 !translate-x-full !bg-primary dark:!bg-primary"
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="col-span-6 flex justify-between">
                                <div className="col-span-3">
                                    <h1 className="text-left font-bold text-dark dark:text-white">
                                        Voice
                                    </h1>
                                </div>
                                <div className="col-span-3 justify-end">
                                    <label
                                        htmlFor="toggleVoice"
                                        className="flex cursor-pointer select-none items-center"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="toggleVoice"
                                                className="sr-only"
                                                onChange={() => handleToggle("voice")}
                                                checked={toggleStates.voice}
                                            />
                                            <div className="block h-8 w-14 rounded-full bg-gray-3 dark:bg-[#5A616B]"></div>
                                            <div
                                                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-switch-1 transition ${toggleStates.voice &&
                                                    "!right-1 !translate-x-full !bg-primary dark:!bg-primary"
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button className="mt-10 w-full rounded-[10px] border border-stroke bg-primary p-4 text-white dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                            Update Device
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
export default EditdeviceModal;


// import ClickOutside from "@/components/ClickOutside";
// import AddCameraForm from "./addCameraForm"; // Assuming this form exists for adding/editing cameras
// import { renderingComp } from "@/helper/constants";
// import { Cameras } from "@/types/Cameras";

// interface CameraModelEditProps {
//     modalOpen: boolean;
//     setModalOpen: (modalOpen: boolean) => void;
//     CameraData: any; // Data for the selected camera to edit
//     handleUpdateCamera: (cameraData: Cameras, id: string) => void; // Function to handle the camera update
// }

// const CameraModelEdit = ({ modalOpen, setModalOpen, CameraData, handleUpdateCamera }: CameraModelEditProps) => {
//     return (
//         <div>
//             {modalOpen && (
//                 <div
//                     className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-[#27918f36] px-4 py-5`}
//                 >
//                     <ClickOutside onClick={() => setModalOpen(false)} className="w-[900px]">
//                         <div className="w-full max-w-[1350px] rounded-[15px] bg-white px-6 py-8 shadow-3 dark:bg-gray-dark dark:shadow-card md:px-15 md:py-15">
//                             {/* AddCameraForm is used to handle camera data just like AddUserForm */}
//                             <AddCameraForm
//                                 renderFrom={renderingComp.Cameras.Edit} // Adjust this for cameras
//                                 cameraData={CameraData}
//                                 setModalOpen={setModalOpen}
//                                 handleUpdateCamera={handleUpdateCamera} // Pass the function to handle camera update
//                             />
//                         </div>
//                     </ClickOutside>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CameraModelEdit;
