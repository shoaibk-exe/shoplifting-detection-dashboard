// "use client";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import ButtonDefault from "../Buttons/ButtonDefault";
// import { Icons } from "@/images/Icons";
// import DeletedeviceModal from "./DeletedeviceModal";
// import ViewdeviceModal from "./ViewdeviceModal";
// import EditdeviceModal from "./EditdeviceModal";
// const data = [
//   {
//     cameraIp: "195.94.142.217",
//     location: "550 Coty Lock Suite 109",
//     date: "20-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "157.41.147.177",
//     location: "36742 Kariane Vista Suite 915",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "195.94.142.217",
//     location: "550 Coty Lock Suite 109",
//     date: "20-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "157.41.147.177",
//     location: "36742 Kariane Vista Suite 915",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "62.111.58.144",
//     location: "87805 Bauch Plaza",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "236.142.236.251",
//     location: "320 Kylie Island Apt. 802",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "78.187.42.156",
//     location: "476 Rod Parkways",
//     date: "21-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "179.105.63.116",
//     location: "762 Feest Ville",
//     date: "21-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "14.163.117.45",
//     location: "1497 Russ Place",
//     date: "21-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "112.157.138.22",
//     location: "13207 Otilia Gateway",
//     date: "21-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "195.94.142.217",
//     location: "550 Coty Lock Suite 109",
//     date: "20-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "157.41.147.177",
//     location: "36742 Kariane Vista Suite 915",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "195.94.142.217",
//     location: "550 Coty Lock Suite 109",
//     date: "20-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "157.41.147.177",
//     location: "36742 Kariane Vista Suite 915",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "62.111.58.144",
//     location: "87805 Bauch Plaza",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "236.142.236.251",
//     location: "320 Kylie Island Apt. 802",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "78.187.42.156",
//     location: "476 Rod Parkways",
//     date: "21-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "179.105.63.116",
//     location: "762 Feest Ville",
//     date: "21-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "14.163.117.45",
//     location: "1497 Russ Place",
//     date: "21-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "112.157.138.22",
//     location: "13207 Otilia Gateway",
//     date: "21-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "195.94.142.217",
//     location: "550 Coty Lock Suite 109",
//     date: "20-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "157.41.147.177",
//     location: "36742 Kariane Vista Suite 915",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "195.94.142.217",
//     location: "550 Coty Lock Suite 109",
//     date: "20-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "157.41.147.177",
//     location: "36742 Kariane Vista Suite 915",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "62.111.58.144",
//     location: "87805 Bauch Plaza",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "236.142.236.251",
//     location: "320 Kylie Island Apt. 802",
//     date: "20-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "78.187.42.156",
//     location: "476 Rod Parkways",
//     date: "21-9-2024",
//     status: "Closed",
//   },
//   {
//     cameraIp: "179.105.63.116",
//     location: "762 Feest Ville",
//     date: "21-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "14.163.117.45",
//     location: "1497 Russ Place",
//     date: "21-9-2024",
//     status: "Active",
//   },
//   {
//     cameraIp: "112.157.138.22",
//     location: "13207 Otilia Gateway",
//     date: "21-9-2024",
//     status: "Closed",
//   },
// ];
// const Managedevice = () => {
//   const perPage = [10, 20, 30, 40, 50];
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(2);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   // Pagination logic
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const selectedData = data.slice(startIndex, startIndex + rowsPerPage);


//   const [cameras, setCameras] = useState(selectedData);

//   const totalPages = Math.ceil(cameras.length / rowsPerPage);
//   useEffect(() => {
//     setCurrentPage(1);
//     if (searchTerm === '') {
//       setCameras(data);
//     } else {
//       setCameras((pre) => {
//         return pre.filter(item =>
//           item.location.toLowerCase().includes(searchTerm.toLowerCase()) || item.cameraIp.includes(searchTerm) || item.date.includes(searchTerm) || item.status.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       })
//     }
//   }, [searchTerm]);
//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };
//   useEffect(() => {
//     setCameras((pre) => {
//       return data.slice(startIndex, startIndex + rowsPerPage)
//     })
//   }, [currentPage, rowsPerPage]);
//   const [modalOpen, setModalOpen] = useState({
//     Editdevice: false,
//     deletedevice: false,
//     deviceView: false,
//   });
//   return (
//     <div className="flex h-full w-full flex-col rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
//       <div className="relative overflow-x-auto sm:rounded-lg">
//         <div className="flex items-center justify-between  pb-4">
//           <div className="relative">
//             <input
//               type="text"
//               className="block w-64 rounded-lg border border-gray-300 p-2 pl-10 text-sm dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300"
//               placeholder="Search here..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <span className="absolute right-5 top-1/2 -translate-y-1/2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="size-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
//                 />
//               </svg>
//             </span>
//           </div>
//           <div className="flex items-center">
//             <span className="font-medium">Per Page:</span>
//             <select onChange={(e) => {
//               setRowsPerPage(parseInt(e.target.value));
//               setCurrentPage(1);
//             }} className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300">
//               {
//                 perPage.map((item, index) => {
//                   return (
//                     <option key={index} value={item}>{item}</option>
//                   )
//                 })
//               }
//             </select>
//           </div>
//         </div>

//         <table className="w-full text-left text-sm text-gray-500">
//           <thead className="border-b border-gray-300 bg-gray-50 text-xs uppercase text-gray-700 dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300">
//             <tr>
//               <th scope="col" className="px-6 py-3">
//                 Camera
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Camera Ip
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Location
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Date
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Status
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {cameras.map((row, index) => (
//               <tr key={index}
//                 className="border-b bg-white hover:bg-gray-50  dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
//               >
//                 <td className="px-6 py-4">
//                   <div className="h-8 w-10 rounded flex items-center justify-center bg-gray-200 dark:bg-dark">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-500">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
//                     </svg>
//                   </div>
//                 </td>

//                 <td className="px-6 py-4">{row.cameraIp}</td>
//                 <td className="px-6 py-4">{row.location}</td>
//                 <td className="px-6 py-4">{row.date}</td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`rounded-full px-2 py-1 text-xs font-semibold ${row.status === "Active"
//                       ? "bg-green-100 text-green-800 dark:bg-gray-dark dark:text-green-800"
//                       : "bg-red-100 text-red-800 dark:bg-gray-dark dark:text-red-800"
//                       }`}
//                   >
//                     {row.status}
//                   </span>
//                 </td>
//                 <td className="flex space-x-2 px-6 py-4">
//                 <button
//                     className="hover:text-primary "
//                     onClick={() => setModalOpen({
//                       Editdevice: true,
//                       deletedevice: false,
//                       deviceView: false,
//                     })} // open modal on button click

//                   >
//                     <Icons.edit />
//                   </button>
//                   <button
//                     className="hover:text-primary"
//                     onClick={() => setModalOpen({
//                      Editdevice: false,
//                       deviceView: true,
//                       deletedevice: false,
//                     })} // open modal on button click
//                   >
//                     <Icons.view />
//                   </button>
//                   <button
//                     className="hover:text-primary"
//                     onClick={() => setModalOpen({
//                     Editdevice: false,
//                       deviceView: false,
//                       deletedevice: true,
//                     })} // open modal on button click
//                   >
//                     <Icons.delete />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <EditdeviceModal modalOpen={modalOpen.Editdevice} setModalOpen={setModalOpen} />
//         <DeletedeviceModal modalOpen={modalOpen.deletedevice} setModalOpen={setModalOpen} />
//         <ViewdeviceModal modalOpen={modalOpen.deviceView} setModalOpen={setModalOpen} />
//         <div className="mt-4 flex items-center justify-between">
//           <span className="text-sm text-gray-700 dark:text-gray-300">
//             Showing {startIndex + 1} to {startIndex + selectedData.length} of{" "}
//             {data.length} entries
//           </span>
//           <div className="p-4 sm:p-6 xl:p-7.5">
//             <nav>
//               <ul className="flex flex-wrap items-center">
//                 <li
//                   onClick={() => {
//                     handlePageChange(currentPage - 1)
//                   }}
//                 >
//                   <Link
//                     className="flex h-8 w-8 items-center justify-center rounded-[3px] hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     <svg
//                       className="fill-current"
//                       width="18"
//                       height="18"
//                       viewBox="0 0 18 18"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M12.1758 16.1158C12.007 16.1158 11.8383 16.0596 11.7258 15.9189L5.36953 9.45019C5.11641 9.19707 5.11641 8.80332 5.36953 8.5502L11.7258 2.08145C11.9789 1.82832 12.3727 1.82832 12.6258 2.08145C12.8789 2.33457 12.8789 2.72832 12.6258 2.98145L6.71953 9.0002L12.6539 15.0189C12.907 15.2721 12.907 15.6658 12.6539 15.9189C12.4852 16.0314 12.3445 16.1158 12.1758 16.1158Z"
//                         fill=""
//                       />
//                     </svg>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     1
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     2
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     3
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     4
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     5
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     className="flex h-9 w-7 items-center justify-center rounded-[3px] font-medium hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     <svg
//                       className="fill-current"
//                       width="12"
//                       height="20"
//                       viewBox="0 0 12 20"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M1.92773 15.0674C2.41992 15.0674 2.8164 14.6641 2.8164 14.1787C2.8164 13.6865 2.41992 13.29 1.92773 13.29C1.44238 13.29 1.03906 13.6865 1.03906 14.1787C1.03906 14.6641 1.44238 15.0674 1.92773 15.0674ZM5.99998 15.0674C6.49217 15.0674 6.88865 14.6641 6.88865 14.1787C6.88865 13.6865 6.49217 13.29 5.99998 13.29C5.51463 13.29 5.11131 13.6865 5.11131 14.1787C5.11131 14.6641 5.51463 15.0674 5.99998 15.0674ZM10.0722 15.0674C10.5644 15.0674 10.9609 14.6641 10.9609 14.1787C10.9609 13.6865 10.5644 13.29 10.0722 13.29C9.58689 13.29 9.18357 13.6865 9.18357 14.1787C9.18357 14.6641 9.58689 15.0674 10.0722 15.0674Z"
//                         fill=""
//                       />
//                     </svg>
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     10
//                   </Link>
//                 </li>
//                 <li
//                   onClick={() => {
//                     handlePageChange(currentPage + 1)
//                   }}
//                 >
//                   <Link
//                     className="flex h-8 w-8 items-center justify-center rounded-[3px] hover:bg-primary hover:text-white"
//                     href="#"
//                   >
//                     <svg
//                       className="fill-current"
//                       width="18"
//                       height="18"
//                       viewBox="0 0 18 18"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M5.81953 16.1158C5.65078 16.1158 5.51016 16.0596 5.36953 15.9471C5.11641 15.6939 5.11641 15.3002 5.36953 15.0471L11.2758 9.0002L5.36953 2.98145C5.11641 2.72832 5.11641 2.33457 5.36953 2.08145C5.62266 1.82832 6.01641 1.82832 6.26953 2.08145L12.6258 8.5502C12.8789 8.80332 12.8789 9.19707 12.6258 9.45019L6.26953 15.9189C6.15703 16.0314 5.98828 16.1158 5.81953 16.1158Z"
//                         fill=""
//                       />
//                     </svg>
//                   </Link>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Managedevice;



"use client";

// Camera imports
import { useEffect, useState } from "react";
import { Icons } from "@/images/Icons";
import PermissionCheck from "@/app/(site)/permission-check";
import { Access_Scope } from "@/helper/constants";
import useGetCameras from "@/hooks/usegetCamera";
import toast from "react-hot-toast";
import { deleteCamera } from "@/actions/camera"; // Action to delete camera
import { Cameras } from "@/types/Cameras"; // Camera interface
import DataTableForCameras from "./DataTableForCamera";

import DeleteDeviceModal from "./DeletedeviceModal";
import ViewDeviceModel from "./ViewdeviceModal";
import EditDeviceModal from "./EditdeviceModal";

const Managedevice = () => {
  const [loading, setLoading] = useState(true);
  const allCameras = useGetCameras(setLoading); // Fetch all cameras
  const [cameras, setCameras] = useState<Cameras[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Cameras>();
  const [modalOpen, setModalOpen] = useState({
    Editdevice: false,
    deletedevice: false,
    deviceView: false,
  });

  const cameraDeleteHandler = async () => {
    if (selectedCamera?.id === undefined || selectedCamera?.id === null) {
      toast.error("Please select a camera to delete");
    } else {
      const { message, status } = await deleteCamera(selectedCamera.id);
      if (status !== 200) {
        toast.error(message);
      } else {
        setCameras(cameras.filter((camera: any) => camera.id !== selectedCamera.id));
        setModalOpen({ ...modalOpen, deletedevice: false });
        toast.success(message);
      }
    }
  };

  useEffect(() => {
    console.log("allCameras", allCameras);
    if (allCameras && allCameras.length > 0) {
      setCameras(
        allCameras.map((camera: any) => ({
          ...camera,
          id: camera.id, // Ensure id is included
          cameraModel: camera.cameraModel,
          cameraIp: camera.cameraIp,
          cameraUsername: camera.cameraUsername,
          cameraPassword: camera.cameraPassword, // Include if needed
          cameraLocation: camera.cameraLocation,
          cameraStatus: camera.cameraStatus,
          autoFlash: camera.autoFlash,
          cameraVoice: camera.cameraVoice,
          createdAt: camera.createdAt,
          updatedAt: camera.updatedAt,
          actions: (
            <div className="flex items-center space-x-3.5">
              <PermissionCheck permission={Access_Scope.ManagedDevice.Edit}>
                <button
                  className="hover:text-primary"
                  onClick={() => {
                    setSelectedCamera(camera);
                    setModalOpen({ 
                      Editdevice: true,
                      deletedevice: false,
                      deviceView: false
                    });
                  }}
                >
                  <Icons.edit />
                </button>
              </PermissionCheck>
              <PermissionCheck permission={Access_Scope.ManagedDevice.Read}>
                <button
                  className="hover:text-primary"
                  onClick={() => {
                    console.log("Selected camera for view:", camera); // Debug log
                    setSelectedCamera(camera);
                    setModalOpen({ 
                      Editdevice: false,
                      deletedevice: false,
                      deviceView: true
                    });
                  }}
                >
                  <Icons.view />
                </button>
              </PermissionCheck>
              <PermissionCheck permission={Access_Scope.ManagedDevice.Delete}>
                <button
                  className="hover:text-primary"
                  onClick={() => {
                    setSelectedCamera(camera);
                    setModalOpen({ 
                      Editdevice: false,
                      deletedevice: true,
                      deviceView: false
                    });
                  }}
                >
                  <Icons.delete />
                </button>
              </PermissionCheck>
            </div>
          ),
        }))
      );
    }
  }, [allCameras]);

  const handleUpdateCamera = (updatedCamera: Cameras, id: string) => {
    setCameras((prev) => {
      return prev.map((camera: any) => {
        if (camera.id === id) {
          return {
            ...camera,
            ...updatedCamera,
          };
        }
        return camera;
      });
    });
    setSelectedCamera((prev: any) => {
      return {
        ...prev,
        ...updatedCamera,
      };
    });
  };

  const DataTableProps = {
    cameras,
    loading,
  };

  return (
    <div className="max-w-full">
      <DataTableForCameras {...DataTableProps} />

      {/* Edit Device Modal */}
      <EditDeviceModal
        modalOpen={modalOpen.Editdevice}
        setModalOpen={setModalOpen}
        CameraData={selectedCamera || {}}
        handleUpdateCamera={handleUpdateCamera}
      />

      {/* Delete Device Modal */}
      <DeleteDeviceModal
        modalOpen={modalOpen.deletedevice}
        setModalOpen={setModalOpen}
        cameraDeleteHandler={cameraDeleteHandler}
      />

      {/* View Device Modal */}
      <ViewDeviceModel
        modalOpen={modalOpen.deviceView}
        setModalOpen={setModalOpen}
        cameraData={selectedCamera}
        handleViewCamera={(cameraData, id) => {
          // Optional: Implement if you need to handle view actions
          console.log('Viewing camera:', cameraData, 'with ID:', id);
        }}
      />
    </div>
  );
};

export default Managedevice;