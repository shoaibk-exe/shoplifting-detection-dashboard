"use client";
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    useFilters,
    usePagination,
    Column,
} from "react-table";
import { Users } from "@/types/Users";
import Loader from "../common/Loader";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ButtonDefault from "../Buttons/ButtonDefault";
import PermissionCheck from "@/app/(site)/permission-check";
import { Icons } from "@/images/Icons";

// table header
interface DataTableForUsersProps {
    users: Users[],
    loading: boolean,
}
const DataTableForUsers = ({ users, loading }: DataTableForUsersProps) => {
    // const data = useMemo(() => dataTwo, []); 
    const perPage = [10, 20, 30, 40, 50];
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(2);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Pagination logic
    const startIndex = (currentPage - 1) * rowsPerPage;
    const selectedData = users.slice(startIndex, startIndex + rowsPerPage);


    const [filteredUser, setFilteredUser] = useState(selectedData);

    const totalPages = Math.ceil(filteredUser.length / rowsPerPage);
    useEffect(() => {
        setCurrentPage(1);
        if (searchTerm === '') {
            setFilteredUser(users);
        } else {
            setFilteredUser((pre) => {
                return pre.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase()) || item.phoneNumber.includes(searchTerm) || item.role.includes(searchTerm) || item.status.toLowerCase().includes(searchTerm.toLowerCase())
                );
            })
        }
    }, [searchTerm]);
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        setFilteredUser((pre) => {
            return users.slice(startIndex, startIndex + rowsPerPage)
        })
    }, [currentPage, rowsPerPage]);
    useEffect(() => {
        setFilteredUser(selectedData)
    }, [users]);
    return (
        <section className="data-table-common data-table-two rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-4 sm:p-7.5">
            {
                loading ?
                    <Loader /> :
                    <div className="relative overflow-x-auto sm:rounded-lg">
                        <div className="flex items-center justify-between  pb-4">
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
                                        perPage.map((item, index) => {
                                            return (
                                                <option key={index} value={item}>{item}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="border-b border-gray-300 bg-gray-50 text-xs uppercase text-gray-700 dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Contact Number
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Designation
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
                                {filteredUser.map(({ profilePicture, name, email, phoneNumber, role, status, actions }, index) => (
                                    <tr key={index}
                                        className="border-b bg-white hover:bg-gray-50  dark:border-gray-600 dark:bg-dark-2 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 flex gap-2 items-center">
                                            <span className="w-[40px] rounded-full h-[40px] bg-gray p-2">
                                                {
                                                    profilePicture === null || profilePicture === "" ?
                                                        <Icons.profile />
                                                        : <Image
                                                            width={40}
                                                            height={40}
                                                            src={profilePicture}
                                                            alt="Profile Picture"
                                                            priority
                                                        />
                                                }
                                            </span>
                                            {name}
                                        </td>
                                        <td className="px-6 py-4">{email}</td>
                                        <td className="px-6 py-4">{phoneNumber}</td>
                                        <td className="px-6 py-4">{role}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${status === "Active"
                                                    ? "bg-green-100 text-green-800 dark:bg-gray-dark dark:text-green-800"
                                                    : "bg-red-100 text-red-800 dark:bg-gray-dark dark:text-red-800"
                                                    }`}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {actions}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {startIndex + 1} to {startIndex + selectedData.length} of{" "}
                                {users.length} entries
                            </span>
                            <div className="p-4 sm:p-6 xl:p-7.5">
                                <nav>
                                    <ul className="flex flex-wrap items-center">
                                        <li
                                            onClick={() => {
                                                handlePageChange(currentPage - 1)
                                            }}
                                        >
                                            <Link
                                                className="flex h-8 w-8 items-center justify-center rounded-[3px] hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12.1758 16.1158C12.007 16.1158 11.8383 16.0596 11.7258 15.9189L5.36953 9.45019C5.11641 9.19707 5.11641 8.80332 5.36953 8.5502L11.7258 2.08145C11.9789 1.82832 12.3727 1.82832 12.6258 2.08145C12.8789 2.33457 12.8789 2.72832 12.6258 2.98145L6.71953 9.0002L12.6539 15.0189C12.907 15.2721 12.907 15.6658 12.6539 15.9189C12.4852 16.0314 12.3445 16.1158 12.1758 16.1158Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                1
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                2
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                3
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                4
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                5
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex h-9 w-7 items-center justify-center rounded-[3px] font-medium hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="12"
                                                    height="20"
                                                    viewBox="0 0 12 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M1.92773 15.0674C2.41992 15.0674 2.8164 14.6641 2.8164 14.1787C2.8164 13.6865 2.41992 13.29 1.92773 13.29C1.44238 13.29 1.03906 13.6865 1.03906 14.1787C1.03906 14.6641 1.44238 15.0674 1.92773 15.0674ZM5.99998 15.0674C6.49217 15.0674 6.88865 14.6641 6.88865 14.1787C6.88865 13.6865 6.49217 13.29 5.99998 13.29C5.51463 13.29 5.11131 13.6865 5.11131 14.1787C5.11131 14.6641 5.51463 15.0674 5.99998 15.0674ZM10.0722 15.0674C10.5644 15.0674 10.9609 14.6641 10.9609 14.1787C10.9609 13.6865 10.5644 13.29 10.0722 13.29C9.58689 13.29 9.18357 13.6865 9.18357 14.1787C9.18357 14.6641 9.58689 15.0674 10.0722 15.0674Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center justify-center rounded-[3px] px-3 py-1.5 font-medium hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                10
                                            </Link>
                                        </li>
                                        <li
                                            onClick={() => {
                                                handlePageChange(currentPage + 1)
                                            }}
                                        >
                                            <Link
                                                className="flex h-8 w-8 items-center justify-center rounded-[3px] hover:bg-primary hover:text-white"
                                                href="#"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5.81953 16.1158C5.65078 16.1158 5.51016 16.0596 5.36953 15.9471C5.11641 15.6939 5.11641 15.3002 5.36953 15.0471L11.2758 9.0002L5.36953 2.98145C5.11641 2.72832 5.11641 2.33457 5.36953 2.08145C5.62266 1.82832 6.01641 1.82832 6.26953 2.08145L12.6258 8.5502C12.8789 8.80332 12.8789 9.19707 12.6258 9.45019L6.26953 15.9189C6.15703 16.0314 5.98828 16.1158 5.81953 16.1158Z"
                                                        fill=""
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
            {/* <GroupPermissionsTable/> */}
        </section>
    );
};

export default DataTableForUsers;

