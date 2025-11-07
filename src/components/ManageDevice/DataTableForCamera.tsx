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
    const [filteredCameras, setFilteredCameras] = useState<Cameras[]>([]);

    // Filter cameras based on search term
    useEffect(() => {
        setCurrentPage(1);
        if (searchTerm === '') {
            setFilteredCameras(cameras || []);
        } else {
            setFilteredCameras((cameras || []).filter(item =>
                item.cameraModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.cameraIp?.includes(searchTerm) ||
                item.cameraLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.cameraStatus?.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        }
    }, [searchTerm, cameras]);

    // Pagination logic
    const startIndex = (currentPage - 1) * rowsPerPage;
    const selectedData = filteredCameras.slice(startIndex, startIndex + rowsPerPage);
    const totalPages = Math.ceil((filteredCameras.length || 0) / rowsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

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
                                {selectedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            {loading ? 'Loading...' : 'No cameras found'}
                                        </td>
                                    </tr>
                                ) : (
                                    selectedData.map(({ id, cameraModel, cameraIp, cameraLocation, cameraStatus, actions }, index) => (
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
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {filteredCameras.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + selectedData.length, filteredCameras.length)} of{" "}
                                {filteredCameras.length} entries
                            </span>

                            <div className="p-4 sm:p-6 xl:p-7.5">
                                <nav>
                                    <ul className="flex flex-wrap items-center">
                                        <li>
                                            <Link
                                                className={`flex h-8 w-8 items-center justify-center rounded-[3px] hover:bg-primary hover:text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                                }}
                                            >
                                                <Icons.chevronLeft />
                                            </Link>
                                        </li>
                                        {/* Page numbers */}
                                        {totalPages > 0 && [...Array(totalPages)].map((_, pageIndex) => {
                                            const pageNum = pageIndex + 1;
                                            // Show first page, last page, current page, and pages around current
                                            if (
                                                pageNum === 1 ||
                                                pageNum === totalPages ||
                                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                            ) {
                                                return (
                                                    <li key={pageIndex}>
                                                        <Link
                                                            className={`flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white ${currentPage === pageNum ? 'bg-primary text-white' : ''}`}
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(pageNum);
                                                            }}
                                                        >
                                                            {pageNum}
                                                        </Link>
                                                    </li>
                                                );
                                            } else if (
                                                pageNum === currentPage - 2 ||
                                                pageNum === currentPage + 2
                                            ) {
                                                return (
                                                    <li key={pageIndex}>
                                                        <span className="px-3 py-1.5">...</span>
                                                    </li>
                                                );
                                            }
                                            return null;
                                        })}
                                        <li>
                                            <Link
                                                className={`flex h-8 w-8 items-center justify-center rounded-[3px] hover:bg-primary hover:text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                                }}
                                            >
                                                <svg
                                                    className="fill-current rotate-180"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5.81953 16.1158C5.65078 16.1158 5.51016 16.0596 5.36953 15.9471C5.11641 15.6939 5.11641 15.3002 5.36953 15.0471L11.2758 9.0002L5.36953 2.98145C5.11641 2.72832 5.11641 2.33457 5.36953 2.08145C5.62266 1.82832 6.01641 1.82832 6.26953 2.08145L12.6258 8.5502C12.8789 8.80332 12.8789 9.19707 12.6258 9.45019L6.26953 15.9189C6.15703 16.0314 5.98828 16.1158 5.81953 16.1158Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
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
