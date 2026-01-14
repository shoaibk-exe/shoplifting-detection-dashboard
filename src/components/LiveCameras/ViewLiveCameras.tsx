"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getCamera } from "@/actions/camera";
import { Icons } from "@/images/Icons";
import ClickOutside from "@/components/ClickOutside";

const Player = ReactPlayer as any;


const ViewLiveCameras: React.FC = () => {
    const [cameras, setCameras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCamera, setSelectedCamera] = useState<any | null>(null);

    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const res = await getCamera({});
                if (res.status === 200 && res.camera) {
                    // Filter for cameras with rtspUrl or just show all
                    // User said "view all cameras", but specifically context is RTSP. 
                    // I will show all, but if they have RTSP they might play.
                    setCameras(res.camera);
                }
            } catch (error) {
                console.error("Failed to fetch cameras", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCameras();
    }, []);

    if (loading) return <div>Loading cameras...</div>;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-3 xl:grid-cols-4 gap-6">
                {cameras.map((cam, index) => (
                    <div
                        key={cam.id || index}
                        className="rounded-lg bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-4 cursor-pointer hover:shadow-lg transition"
                        onClick={() => setSelectedCamera(cam)}
                    >
                        <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden rounded-md mb-3">
                            {cam.rtspUrl ? (
                                /* Note: ReactPlayer cannot play generic RTSP directly in browser without transcoding. 
                                   This is a placeholder for the UI requirement. 
                                   If the URL is a valid HTTP stream (HLS/Dash), it will play. */
                                <Player
                                    url={cam.rtspUrl}
                                    width="100%"
                                    height="100%"
                                    controls={false}
                                    playing
                                    muted
                                    light={true} // Use light mode (thumbnail) if possible or just show
                                    playIcon={<div className="p-3 bg-primary rounded-full text-white"><Icons.videoCam /></div>}
                                />
                            ) : (
                                <div className="text-white flex flex-col items-center">
                                    <Icons.videoCam />
                                    <span className="text-xs mt-2">No Stream Link</span>
                                </div>
                            )}
                        </div>
                        <h3 className="font-medium text-dark dark:text-white truncate">{cam.cameraModel || "Camera " + (index + 1)}</h3>
                        <p className="text-sm text-gray-500">{cam.cameraLocation || "Unknown Location"}</p>
                    </div>
                ))}
            </div>

            {selectedCamera && (
                <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <ClickOutside onClick={() => setSelectedCamera(null)} className="w-full max-w-5xl">
                        <div className="relative bg-black rounded-lg overflow-hidden border border-gray-700 w-full aspect-video shadow-2xl">
                            <button
                                onClick={() => setSelectedCamera(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>

                            </button>
                            {selectedCamera.rtspUrl ? (
                                <Player
                                    url={selectedCamera.rtspUrl}
                                    width="100%"
                                    height="100%"
                                    controls
                                    playing
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white">
                                    <p>No Stream Link available for this camera.</p>
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <h2 className="text-white text-xl font-bold">{selectedCamera.cameraModel}</h2>
                                <p className="text-gray-300">{selectedCamera.cameraLocation}</p>
                                <p className="text-gray-400 text-xs mt-1">{selectedCamera.rtspUrl}</p>
                            </div>
                        </div>
                    </ClickOutside>
                </div>
            )}
        </div>
    );
};

export default ViewLiveCameras;
