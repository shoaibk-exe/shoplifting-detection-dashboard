"use client"
import React from "react";
import Livestream from "../anomaly-detection/Livestream";
import { Icons } from "@/images/Icons";

interface SavedvideodownloadProps {
    modalOpen: boolean;
    setModalOpen: ({
        Savedvideo,
        deleteVideo,
        videoView,
    }: {
        Savedvideo: boolean,
        deleteVideo: boolean,
        videoView: boolean,
    }) => void;
}

const ViewvideoModal: React.FC<SavedvideodownloadProps> = ({
    modalOpen,
    setModalOpen,
}) => {
    return (
        <>
            {modalOpen && (
                <div
                    className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-opacity-10 bg-[#27918f36]`}
                >
                    <div className="w-full max-w-[1024px] rounded-[15px] bg-white px-8 py-12 text-center dark:bg-gray-dark dark:shadow-card md:px-12 md:py-8">
                        <div className="flex justify-end mb-8 cursor-pointer" onClick={() => {
                            setModalOpen({
                                Savedvideo: false,
                                deleteVideo: false,
                                videoView: false
                            })
                        }}>
                            <Icons.closeIcon />
                        </div>
                        <Livestream />
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewvideoModal;
