
"use client";
import React, { useEffect, useState } from "react";
import ButtonDefault from "../Buttons/ButtonDefault";
import Dropzone from "dropzone";
import { Icons } from "@/images/Icons";
import CameraVideo from "./CameraVideo";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { getCamera } from "@/actions/camera";
import { Camera } from "@/types/camera";
const Addetection: React.FC = () => {
  const { width, height } = useWindowDimensions()
  const [camerasArr, setCamerasArr] = useState<Camera[]>([])
  const cameraFilters = {
    videoRecording: false,
    anomaly_logs: false,
  }
  const fetchCameras = async () => {
    const cameras = await getCamera(cameraFilters)
    if (cameras.status === 200) {
      setCamerasArr(cameras.camera)
    }
  }
  useEffect(() => {
    fetchCameras()
  }, [])
  useEffect(() => {
    let myDropzone = new Dropzone("#demo-upload", {
      url: "/api/upload",
    });
    return () => {
      (myDropzone as any).destroy();
    };
  }, []);


  // const camerasArr = [
  //   {
  //     id: 1,
  //     cameraName: "Camera 1",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />,
  //   },
  //   {
  //     id: 2,
  //     cameraName: "Camera 2",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />,
  //   },
  //   {
  //     id: 3,
  //     cameraName: "Camera 3",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 4,
  //     cameraName: "Camera 4",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 5,
  //     cameraName: "Camera 5",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 6,
  //     cameraName: "Camera 6",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 7,
  //     cameraName: "Camera 7",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 8,
  //     cameraName: "Camera 8",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 9,
  //     cameraName: "Camera 8",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 10,
  //     cameraName: "Camera 10",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 11,
  //     cameraName: "Camera 11",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },
  //   {
  //     id: 12,
  //     cameraName: "Camera 12",
  //     ip: "127.0.0.1",
  //     source: "http://192.168.100.56:5000/video_feed?rtsp_url=rtsp://irfanh:5678@192.168.100.15/live&height=150&width=150",
  //     Icon: <Icons.videoCam />
  //   },];
  return (
    <div className="grid grid-cols-3 w-full flex-col-reverse lg:flex-row px-6.5 py-4 rounded-[10px] gap-4 bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="col-span-3 md:col-span-2 rounded-[10px] bg-white dark:bg-gray-dark">
        <div className="mb-6 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">
            Camera Source
          </h3>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {camerasArr && camerasArr.map((camera) => {
            const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://192.168.100.56:5000';
            const cameraLink = `${pythonBackendUrl}/video_feed?rtsp_url=rtsp://${camera.cameraUsername}:${camera.cameraPassword}@${camera.cameraIp}/live&height=${height}&width=${width}`

            return (
              <div key={camera.id} className="flex flex-col justify-center items-center cursor-pointer" onClick={() => window.open(`${pythonBackendUrl}/video_feed?rtsp_url=rtsp://${camera.cameraUsername}:${camera.cameraPassword}@${camera.cameraIp}/live&height=${height}&width=${width}`)}>
                <div className="flex justify-center items-center rounded-[10px] w-[10em] h-[10em] gap-4 bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                  <CameraVideo aspectOne src={cameraLink} />
                </div>
                <div className="text-center font-medium text-dark dark:text-white cursor-pointer">
                  {camera.cameraUsername}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="col-span-3 md:col-span-1 bg-white dark:bg-gray-dark">
        <Upload />
      </div>
    </div>
  );
};


const Upload = () => {
  return (<>

    <div className="px-6.5 py-4">
      <h3 className="font-medium text-dark dark:text-white">
        Upload Video
      </h3>
    </div>
    <div className="p-6.5">
      <form
        className="flex items-center justify-center dropzone dark:!border-strokedark rounded-md !border-dashed !border-[#DEE4EE] bg-gray hover:!border-primary dark:bg-dark-2 dark:hover:!border-primary h-[450px]"
        id="demo-upload"
      >
        <div className="dz-message">
          <div className="mb-2.5 flex justify-center">
            <div className="shadow-card-8 flex h-15 w-15 items-center justify-center rounded-full bg-white text-dark dark:bg-dark dark:text-white">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2298_23087)">
                  <path
                    d="M18.75 13.7501C18.375 13.7501 18.0313 14.0626 18.0313 14.4688V17.2501C18.0313 17.5313 17.8125 17.7501 17.5313 17.7501H2.46875C2.1875 17.7501 1.96875 17.5313 1.96875 17.2501V14.4688C1.96875 14.0626 1.625 13.7501 1.25 13.7501C0.875 13.7501 0.53125 14.0626 0.53125 14.4688V17.2501C0.53125 18.3126 1.375 19.1563 2.4375 19.1563H17.5313C18.5938 19.1563 19.4375 18.3126 19.4375 17.2501V14.4688C19.4688 14.0626 19.125 13.7501 18.75 13.7501Z"
                    fill=""
                  />
                  <path
                    d="M5.96875 6.46881L9.3125 3.21881V14.0313C9.3125 14.4063 9.625 14.7501 10.0312 14.7501C10.4062 14.7501 10.75 14.4376 10.75 14.0313V3.21881L14.0937 6.46881C14.2187 6.59381 14.4063 6.65631 14.5938 6.65631C14.7813 6.65631 14.9688 6.59381 15.0938 6.43756C15.375 6.15631 15.3438 5.71881 15.0938 5.43756L10.5 1.06256C10.2187 0.812561 9.78125 0.812561 9.53125 1.06256L4.96875 5.46881C4.6875 5.75006 4.6875 6.18756 4.96875 6.46881C5.25 6.71881 5.6875 6.75006 5.96875 6.46881Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2298_23087">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <span className="font-medium text-dark dark:text-white">
            Click to upload or drag and drop video file
          </span>
        </div>
      </form>
      <div>
        <ButtonDefault
          label="Execution"
          link="/"
          customClasses="bg-primary rounded-[5px] text-white py-[11px] px-6 w-full mt-4"
        />
      </div>
    </div>
  </>)
}

export default Addetection;
