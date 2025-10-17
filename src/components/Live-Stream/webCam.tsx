"use client"
import React, { useEffect, useRef } from 'react';
const WebcamComponent = () => {
    const videoRef = useRef(null) as any;

    useEffect(() => {
        const video = videoRef.current;
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.style.transform = 'scaleX(-1)';
                video.play();
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };

        startVideo();

        // Cleanup: Stop the video stream when the component unmounts
        return () => {
            if (video.srcObject) {
                video.srcObject.getTracks().forEach((track: any) => track.stop());
            }
        };
    }, []);

    return (
        <video ref={videoRef} autoPlay />
    );
};

export default WebcamComponent;