"use client";

import { Cameras } from "@/types/Cameras"; // Adjust this import according to your file structure
import Loader from "../common/Loader";
import Link from "next/link";
import { Icons } from "@/images/Icons";
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    useFilters,
    usePagination,
    Column,
} from "react-table";
import { Users } from "@/types/Users";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ButtonDefault from "../Buttons/ButtonDefault";
import PermissionCheck from "@/app/(site)/permission-check";
// table header
interface DataTableForCamerasProps {
    cameras: Cameras[];
    loading: boolean;
}

const DataTableForCameras = ({ cameras, loading }: DataTableForCamerasProps) => {
    const perPage = [10, 20, 30, 40, 50];
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Pagination logic
    const startIndex = (currentPage - 1) * rowsPerPage;
    const selectedData = (Array.isArray(cameras) ? cameras : []).slice(startIndex, startIndex + rowsPerPage);

    // const selectedData = cameras.slice(startIndex, startIndex + rowsPerPage);
    const [filteredCameras, setFilteredCameras] = useState(selectedData);


    const totalPages = Math.ceil(filteredCameras.length / rowsPerPage);

    useEffect(() => {
        setCurrentPage(1);
        if (searchTerm === '') {
            setFilteredCameras(cameras);
        } else {
            setFilteredCameras(cameras.filter(item =>
                item.cameraModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.cameraIp.includes(searchTerm) ||
                item.cameraLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.cameraStatus.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        }
    }, [searchTerm, cameras]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setFilteredCameras(selectedData);
    }, [currentPage, rowsPerPage]);

    return (

        <section className="data-table-common data-table-two rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-4 sm:p-7.5">
            {
                loading ?
                    <Loader /> :
                    <div className="relative overflow-x-auto sm:rounded-lg">
                        <div className="flex items-center justify-between pb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="block w-64 rounded-lg border border-gray-300 p-2 pl-10 text-sm dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300"
                                    placeholder="Search here..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2">
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
                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                        />
                                    </svg>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-medium">Per Page:</span>
                                <select onChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value));
                                    setCurrentPage(1);
                                }} className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300">
                                    {
                                        perPage.map((item, index) => (
                                            <option key={index} value={item}>{item}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="border-b border-gray-300 bg-gray-50 text-xs uppercase text-gray-700 dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Camera Model
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        IP Address
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Location
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCameras.map(({ id, cameraModel, cameraIp, cameraLocation, cameraStatus, actions }, index) => (
                                    <tr key={index}
                                        className="border-b bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4">{cameraModel}</td>
                                        <td className="px-6 py-4">{cameraIp}</td>
                                        <td className="px-6 py-4">{cameraLocation}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${cameraStatus === "Active"
                                                    ? "bg-green-100 text-green-800 dark:bg-gray-dark dark:text-green-800"
                                                    : "bg-red-100 text-red-800 dark:bg-gray-dark dark:text-red-800"
                                                    }`}
                                            >
                                                {cameraStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-4">
                                                {actions}
                                            </div>
                                            {/* <ButtonDefault
        label="View" // This is the text that will be displayed on the button
        link={`/cameras/${id}`} // This is the link the button will navigate to
        customClasses="bg-blue-500 text-white" // Any additional classes you want to apply
    /> */}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {startIndex + 1} to {startIndex + selectedData.length} of{" "}
                                {(cameras && cameras.length) || 0} entries
                            </span>

                            <div className="p-4 sm:p-6 xl:p-7.5">
                                <nav>
                                    <ul className="flex flex-wrap items-center">
                                        <li
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            <Link
                                                className="flex h-8 w-8 items-center justify-center rounded-[3px] hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                <Icons.chevronLeft />
                                            </Link>
                                        </li>
                                        {/* Page numbers */}
                                        {[...Array(totalPages)].map((_, pageIndex) => (
                                            <li key={pageIndex}>
                                                <Link
                                                    className={`flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white ${currentPage === pageIndex + 1 ? 'bg-primary text-white' : ''}`}
                                                    href="#"
                                                    onClick={() => handlePageChange(pageIndex + 1)}
                                                >
                                                    {pageIndex + 1}
                                                </Link>
                                            </li>
                                        ))}
                                        <li
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            <Link
                                                className="flex h-8 w-8 items-center justify-center rounded-[3px] hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                <Icons.chevronLeft />
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
            }
        </section>
    );
};

export default DataTableForCameras;
