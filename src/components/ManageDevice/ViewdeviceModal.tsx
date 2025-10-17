"use client"
import React from "react";
import { Icons } from "@/images/Icons";
import { Cameras } from "@/types/Cameras";
import ReactPlayer from 'react-player';

interface ViewDeviceModelProps {
    modalOpen: boolean;
    setModalOpen: ({
        Editdevice,
        deletedevice,
        deviceView,
    }: {
        Editdevice: boolean,
        deletedevice: boolean,
        deviceView: boolean,
    }) => void;
    cameraData?: Cameras;
    handleViewCamera: (cameraData: Cameras, id: string) => void;
}

const ViewDeviceModel: React.FC<ViewDeviceModelProps> = ({
    modalOpen,
    setModalOpen,
    cameraData,
    handleViewCamera
}) => {
    return (
        <>
            {modalOpen && cameraData && (
                <div
                    className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-opacity-10 bg-[#27918f36]`}
                >
                    <div className="w-full max-w-[1024px] rounded-[15px] bg-white px-8 py-12 text-center dark:bg-gray-dark dark:shadow-card md:px-12 md:py-8">
                        <div className="flex justify-end mb-8 cursor-pointer" onClick={() => {
                            setModalOpen({
                                Editdevice: false,
                                deletedevice: false,
                                deviceView: false
                            })
                        }}>
                            <Icons.closeIcon />
                        </div>
                        
                        <div className="text-left">
                            <h2 className="text-xl font-semibold mb-6 text-center">Camera Details</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Camera Model</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{cameraData.cameraModel}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Camera IP</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{cameraData.cameraIp}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{cameraData.cameraUsername}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{cameraData.cameraLocation}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            cameraData.cameraStatus === "Active"
                                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                                        }`}>
                                            {cameraData.cameraStatus}
                                        </span>
                                    </div>
                                    
                                    {cameraData.autoFlash !== undefined && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Auto Flash</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {cameraData.autoFlash ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {cameraData.cameraVoice !== undefined && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Voice</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {cameraData.cameraVoice ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {cameraData.createdAt ? new Date(cameraData.createdAt).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Camera Preview Section */}
                                <div className="aspect-video bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center">
                                {cameraData.cameraIp ? (
                                    <img
                                        src={cameraData.cameraIp}
                                        alt="Live Camera Feed"
                                        className="w-full h-full object-contain"
                                        />
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">
                                    No camera IP available.
                                    </p>
                                )}
                                </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewDeviceModel;