"use client"
import { useEffect, useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Icons } from "@/images/Icons";
import useGetRoles from "@/hooks/useGetRoles";
import { RegisterUser, UpdateUser } from "@/actions/users";
import { Users } from "@/types/Users";
import { isEmpty } from "@/helper/isEmpty";
import toast from "react-hot-toast";
import { renderingComp } from "@/helper/constants";

interface AddUserFormProps {
    renderFrom?: string;
    UserData?: any;
    setUserData?: (userData: Users) => void | undefined;
    setModalOpen?: (modalOpen: boolean) => void | undefined;
    handleUpdateUser?: (userData: Users, id: string) => void | undefined
}


const AddUsersForm = ({ renderFrom, UserData, setModalOpen, handleUpdateUser }: AddUserFormProps) => {
    const User = {
        name: UserData?.name || "",
        email: UserData?.email || "",
        password: "",
        confirmPassword: "",
        role: UserData?.role?.id || "",
        status: UserData?.status || "Active",
        phoneNumber: UserData?.phoneNumber || "",
        profilePicture: UserData?.profilePicture || "",
    }
    const status = [{
        id: 1,
        name: "Active",
        value: "Active"
    },
    {
        id: 2,
        name: "Closed",
        value: "Closed"
    }
    ]
    const roles = useGetRoles();
    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<Users>(User);

    const HandleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value);
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };
    const submitButton = async () => {
        setLoading(true)
        if (isEmpty(userData, ["profilePicture"])) {
            setLoading(false)
            toast.error("Please fill all the required fields");
        } else {
            if (userData.password !== userData.confirmPassword) {
                setLoading(false)
                toast.error("Password and confirm password does not match")
            }
            else {
                const { status, message } = await RegisterUser(userData)
                if (status >= 200 && status < 300) {
                    setLoading(false)
                    toast.success(message)
                    setUserData(User)
                } else {
                    setLoading(false)
                    toast.error(message)
                }
            }
        }
    }

    const updateButton = async () => {
        setLoading(true)
        if (userData?.password !== userData?.confirmPassword) {
            setLoading(false)
            toast.error("Password and confirm password does not match")
        }
        else {
            const { message, status } = await UpdateUser(UserData.id, userData);
            if (status === 200) {
                setModalOpen && setModalOpen(false)
                handleUpdateUser && handleUpdateUser(userData, UserData.id)
                setUserData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "",
                    status: "",
                    phoneNumber: "",
                    profilePicture: "",
                })
                toast.success(message)
                setLoading(false)
            } else {
                toast.error(message)
                setLoading(false)
            }
        }
    }


    return (
        <div className="grid grid-cols-1 gap-9">
            <div className={`${renderFrom !== renderingComp.Users.Edit && "border border-stroke bg-white shadow-1 rounded-[10px] dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"} `}>
                <form onSubmit={(e) => e.preventDefault()}
                >
                    <div className={`${renderFrom !== renderingComp.Users.Edit && "mt-3 mb-3 p-6.5"} grid grid-cols-12 gap-4`}>
                        <div className="col-span-12">

                            <InputGroup
                                required={renderFrom === renderingComp.Users.Edit ? false : true}
                                label="Name"
                                type="text"
                                placeholder="Enter full name"
                                customClasses="mb-4.5"
                                name="name"
                                value={userData.name}
                                onChange={HandleOnChange}
                            />
                        </div>
                        <div className="col-span-6">
                            <InputGroup
                                required={renderFrom === renderingComp.Users.Edit ? false : true}
                                label="Email"
                                type="email"
                                placeholder="Enter email address"
                                customClasses="mb-4.5"
                                name="email"
                                value={userData.email}
                                onChange={HandleOnChange}
                            />
                        </div>
                        <div className="col-span-6">
                            <InputGroup
                                required={renderFrom === renderingComp.Users.Edit ? false : true}
                                label="Phone Number"
                                type="number"
                                placeholder="Enter Phone Number"
                                customClasses="mb-4.5"
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={HandleOnChange}
                            />
                        </div>
                        <div className="col-span-6 mb-5.5">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Select Roles
                                {renderFrom === renderingComp.Users.Edit && <span className="text-red">*</span>}
                            </label>
                            <div className="relative z-20 rounded-[7px] bg-white dark:bg-dark-2">
                                <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                                    <Icons.userRoles />
                                </span>
                                <select
                                    value={userData.role}
                                    onChange={(e) => {
                                        setUserData({ ...userData, role: e.target.value });
                                    }}
                                    className={`relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-11.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 ${userData.role !== "" ? "text-dark dark:text-white" : ""
                                        }`}
                                >
                                    <option value="" className="text-dark-5 dark:text-dark-6">
                                        --- Select Role ---
                                    </option>

                                    {
                                        roles?.map((role: any) => (
                                            <option key={role.id} value={role.id} className="text-dark-5 dark:text-dark-6">
                                                {role.name}
                                            </option>
                                        ))
                                    }
                                </select>
                                <span className="absolute right-4.5 top-1/2 z-10 -translate-y-1/2 text-dark-4 dark:text-dark-6">
                                    <Icons.dropdown />
                                </span>
                            </div>
                        </div>
                        <div className="col-span-6 mb-5.5">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Status
                                {renderFrom === renderingComp.Users.Edit && <span className="text-red">*</span>}
                            </label>
                            <div className="relative z-20 rounded-[7px] bg-white dark:bg-dark-2">
                                <select
                                    value={userData.status}
                                    onChange={(e) => {
                                        setUserData({ ...userData, status: e.target.value });
                                    }}
                                    className={`relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-11.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 ${userData.role !== "" ? "text-dark dark:text-white" : ""
                                        }`}
                                >
                                    <option value="" className="text-dark-5 dark:text-dark-6">
                                        --- Select Status ---
                                    </option>

                                    {
                                        status.map((status: any) => (
                                            <option key={status.id} value={status.value} className="text-dark-5 dark:text-dark-6">
                                                {status.name}
                                            </option>
                                        ))
                                    }
                                </select>
                                <span className="absolute right-4.5 top-1/2 z-10 -translate-y-1/2 text-dark-4 dark:text-dark-6">
                                    <Icons.dropdown />
                                </span>
                            </div>
                        </div>
                        <div className="col-span-6">
                            <InputGroup
                                required={renderFrom === renderingComp.Users.Edit ? false : true}
                                label="Password"
                                type="password"
                                placeholder="Enter password"
                                customClasses="mb-4.5"
                                name="password"
                                value={userData.password}
                                onChange={HandleOnChange}
                            />
                        </div>
                        <div className="col-span-6">
                            <InputGroup
                                required={renderFrom === renderingComp.Users.Edit ? false : true}
                                label="Re-type Password"
                                type="password"
                                placeholder="Re-enter"
                                customClasses="mb-5.5"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                onChange={HandleOnChange}
                            />
                        </div>
                        <div className="col-span-12">
                            {
                                renderFrom === renderingComp.Users.Edit ?
                                    <div className="-mx-2.5 flex flex-wrap gap-y-4">
                                        <div className="w-full px-2.5 2xsm:w-1/2">
                                            <button
                                                onClick={() => setModalOpen && setModalOpen(false)} className="block w-full rounded-[7px] border border-stroke bg-gray-2 p-[11px] text-center font-medium text-dark transition hover:border-gray-3 hover:bg-gray-3 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:border-dark-4 dark:hover:bg-dark-4"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="w-full px-3 2xsm:w-1/2">
                                            <button onClick={() => {
                                                updateButton()
                                            }} className="block w-full rounded-[7px] border border-primary bg-primary p-[11px] text-center font-medium text-white transition hover:bg-opacity-90">
                                                Save
                                                {
                                                    loading && <span
                                                        className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-white dark:border-t-transparent`}
                                                    ></span>
                                                }
                                            </button>
                                        </div>
                                    </div> : <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90" onClick={() => submitButton()}>
                                        Add User
                                        {
                                            loading && <span
                                                className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-white dark:border-t-transparent`}
                                            ></span>
                                        }
                                    </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddUsersForm