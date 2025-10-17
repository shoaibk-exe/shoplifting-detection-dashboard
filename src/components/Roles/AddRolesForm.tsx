"use client"
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import { useEffect, useState } from "react";
import { Access_Scope, AccessScopes, renderingComp, } from "@/helper/constants";
import { Icons } from "@/images/Icons";
import { Roles } from "@/types/Roles";
import { AddRole, UpdateRole } from "@/actions/roles";
import toast from "react-hot-toast";
import { isEmpty } from "@/helper/isEmpty";

interface AddRolesFormProps {
    renderFrom?: string;
    RoleData?: any;
    setModalOpen?: (modalOpen: boolean) => void | undefined;
    handleUpdateRole?: (UpdatedData: any, id: string) => void
}


const AddRolesForm = ({ renderFrom, RoleData, setModalOpen, handleUpdateRole }: AddRolesFormProps) => {
    const [loading, setLoading] = useState(false)
    const [roleData, setRoleData] = useState<Roles>({
        name: RoleData?.name || "",
        description: RoleData?.description || "",
        permissions: RoleData?.permissions || [],
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleData({
            ...roleData,
            [event.target.name]: event.target.value
        })
    }
    const handleSetAccess = (value: string) => {
        if (roleData.permissions.includes(value)) {
            setRoleData((pre) => {
                return {
                    ...pre,
                    permissions: pre.permissions.filter((item) => item !== value)
                }
            })
        } else {
            setRoleData({
                ...roleData,
                permissions: [...roleData.permissions, value]
            })
        }
    }
    const check = (value: string) => roleData.permissions.includes(value)
    const submitButton = async () => {
        setLoading(true)
        if (isEmpty(roleData, ["description"])) {
            toast.error("Please fill all the fields")
        } else {
            const response = await AddRole(roleData);
            if (response.status === 200) {
                toast.success(response.message)
                setRoleData({
                    name: "",
                    description: "",
                    permissions: [],
                })
                setLoading(false)
            } else {
                toast.error(response.message)
                setLoading(false)
            }
        }
    }
    const updateButton = async () => {
        setLoading(true)
        if (isEmpty(roleData, ["description"])) {
            toast.error("Please fill all the fields!")
            setLoading(false)
        } else {
            const response = await UpdateRole(roleData, RoleData.id);
            if (response.status === 200) {
                toast.success(response.message)
                setRoleData({
                    name: "",
                    description: "",
                    permissions: [],
                })
                setLoading(false)
                setModalOpen && setModalOpen(false)
                handleUpdateRole && handleUpdateRole(roleData, RoleData.id)
            } else {
                toast.error(response.message)
                setLoading(false)
            }
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-9">
                <div className={`${renderFrom !== renderingComp.Roles.Edit && "border border-stroke bg-white shadow-1 rounded-[10px] dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"} `}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className={`${renderFrom !== renderingComp.Roles.Edit && "p-6.5"}`}>
                            <InputGroup
                                label="Role Name"
                                type="text"
                                placeholder="Name"
                                customClasses="mb-4.5"
                                value={roleData.name}
                                onChange={handleChange}
                                name="name"
                                disable={renderFrom === renderingComp.Roles.Edit ? true : false}
                            />
                            <div>
                                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                    Access
                                </label>
                                <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary mb-3">
                                    {
                                        Object.entries(AccessScopes).map(([key, value]) => (
                                            <div className="sm:flex gap-4 justify-between items-center" key={key}>
                                                <label className="my-3 block text-body-sm font-medium text-dark dark:text-white">
                                                    {key}
                                                </label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {
                                                        value.map((SingleValue, index) => (
                                                            <button key={index}
                                                                className={`inline-flex border rounded px-6 py-[11px] font-medium dark:text-white hover:border-primary hover:bg-primary hover:text-white dark:hover:border-primary dark:hover:text-white ${check(`${SingleValue}_${key}`) ? "border-primary bg-primary text-white dark:border-primary dark:bg-primary dark:text-white" : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"}`}
                                                                onClick={() => handleSetAccess(`${SingleValue}_${key}`)}
                                                            >
                                                                {SingleValue}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Description For Your Role"
                                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                    value={roleData.description}
                                    onChange={(e) => { setRoleData({ ...roleData, description: e.target.value }) }}
                                ></textarea>
                            </div>
                            {
                                renderFrom !== renderingComp.Roles.Edit &&
                                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90" onClick={() => submitButton()}>
                                    Add Role
                                    {
                                        loading && <span
                                            className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-white dark:border-t-transparent`}
                                        ></span>
                                    }
                                </button>
                            }
                            {renderFrom === renderingComp.Roles.Edit &&
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
                                </div>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddRolesForm