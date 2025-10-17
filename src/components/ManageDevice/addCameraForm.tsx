"use client";
import { useEffect, useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { RegisterCamera } from "@/actions/camera"; // Make sure you have a corresponding action for registering a camera
import { Cameras } from "@/types/Cameras";
import { isEmpty } from "@/helper/isEmpty";
import toast from "react-hot-toast";
import { renderingComp } from "@/helper/constants";

interface AddCameraFormProps {
    renderFrom?: string;
    cameraData?: Cameras; // Optional, used for editing a camera
    setModalOpen?: (modalOpen: boolean) => void;
    handleUpdateCamera?: (cameraData: Cameras, id: string) => void;
}

const AddCameraForm = ({ renderFrom, cameraData, setModalOpen, handleUpdateCamera }: AddCameraFormProps) => {
    const initialCameraData: Cameras = {
        cameraModel: cameraData?.cameraModel || "",
        cameraIp: cameraData?.cameraIp || "",
        cameraUsername: cameraData?.cameraUsername || "",
        cameraPassword: cameraData?.cameraPassword || "",
        cameraLocation: cameraData?.cameraLocation || "",
        cameraStatus: cameraData?.cameraStatus || "Active",
        autoFlash: cameraData?.autoFlash || false,
        cameraVoice: cameraData?.cameraVoice || false,
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [camera, setCamera] = useState<Cameras>(initialCameraData);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;
        const checked = type === "checkbox" ? (event.target as HTMLInputElement).checked : undefined;

        setCamera((prevCamera) => ({
            ...prevCamera,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const submitButton = async () => {
        setLoading(true);
        if (isEmpty(camera, ["cameraModel", "cameraIp", "cameraUsername", "cameraPassword", "cameraLocation"])) {
            setLoading(false);
            toast.error("Please fill all the required fields");
        } else {
            const { status, message } = await RegisterCamera(camera); // Implement this function
            if (status !== 200) {
                setLoading(false);
                toast.error(message);
            } else {
                setLoading(false);
                toast.success(message);
                setCamera(initialCameraData); // Reset the form
            }
        }
    };

    const updateButton = async () => {
        setLoading(true);
        const { status, message } = await RegisterCamera({ ...camera, id: cameraData?.id }); // Adjust if using a different update action
        if (status === 200) {
            setModalOpen && setModalOpen(false);
            if (cameraData?.id) {
                handleUpdateCamera && handleUpdateCamera(camera, cameraData.id);
            } else {
                toast.error("Camera ID is not available.");
            }

            setCamera(initialCameraData); // Reset the form
            toast.success(message);
        } else {
            toast.error(message);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-9">
            <div className={`${renderFrom !== renderingComp.Cameras.Edit ? "border border-stroke bg-white shadow-1 rounded-[10px]" : ""}`}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={`${renderFrom !== renderingComp.Cameras.Edit ? "mt-3 mb-3 p-6.5" : ""} grid grid-cols-12 gap-4`}>
                        <div className="col-span-12">
                            <InputGroup
                                required
                                label="Camera Model"
                                type="text"
                                placeholder="Enter camera model"
                                customClasses="mb-4.5"
                                name="cameraModel"
                                value={camera.cameraModel}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="col-span-6">
                            <InputGroup
                                required
                                label="Camera IP"
                                type="text"
                                placeholder="Enter camera IP address"
                                customClasses="mb-4.5"
                                name="cameraIp"
                                value={camera.cameraIp}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="col-span-6">
                            <InputGroup
                                required
                                label="Username"
                                type="text"
                                placeholder="Enter camera username"
                                customClasses="mb-4.5"
                                name="cameraUsername"
                                value={camera.cameraUsername}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="col-span-6">
                            <InputGroup
                                required
                                label="Password"
                                type="password"
                                placeholder="Enter camera password"
                                customClasses="mb-4.5"
                                name="cameraPassword"
                                value={camera.cameraPassword}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="col-span-12">
                            <InputGroup
                                required
                                label="Location"
                                type="text"
                                placeholder="Enter camera location"
                                customClasses="mb-4.5"
                                name="cameraLocation"
                                value={camera.cameraLocation}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="col-span-6 mb-5.5">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Status
                            </label>
                            <select
                                value={camera.cameraStatus}
                                onChange={handleOnChange}
                                name="cameraStatus"
                                className="w-full rounded-[7px] border border-stroke bg-transparent px-3 py-2 outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="col-span-6 mb-5.5">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="autoFlash"
                                    checked={camera.autoFlash}
                                    onChange={handleOnChange}
                                    className="mr-2"
                                />
                                Auto Flash
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="cameraVoice"
                                    checked={camera.cameraVoice}
                                    onChange={handleOnChange}
                                    className="mr-2"
                                />
                                Camera Voice
                            </label>
                        </div>
                        <div className="col-span-12">
                            {renderFrom === renderingComp.Cameras.Edit ? (
                                <div className="-mx-2.5 flex flex-wrap gap-y-4">
                                    <div className="w-full px-2.5 2xsm:w-1/2">
                                        <button
                                            onClick={() => setModalOpen && setModalOpen(false)}
                                            className="block w-full rounded-[7px] border border-stroke bg-gray-2 p-[11px] text-center font-medium text-dark transition hover:border-gray-3 hover:bg-gray-3 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:border-dark-4 dark:hover:bg-dark-4"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="w-full px-3 2xsm:w-1/2">
                                        <button
                                            onClick={updateButton}
                                            className="block w-full rounded-[7px] border border-primary bg-primary p-[11px] text-center font-medium text-white transition hover:bg-opacity-90"
                                        >
                                            Save
                                            {loading && (
                                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
                                    onClick={submitButton}
                                >
                                    Add Camera
                                    {loading && (
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCameraForm;
