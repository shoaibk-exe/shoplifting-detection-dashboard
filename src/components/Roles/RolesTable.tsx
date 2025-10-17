"use client";
import useGetRoles from '@/hooks/useGetRoles';
import { useEffect, useState } from "react";
import RolesModelEdit from './RolesModelEdit';
import toast from 'react-hot-toast';
import { deleteRole } from '@/actions/roles';
import { RolesModelDelete } from './RoleModelDelete';
import { Roles } from '@/types/Roles';
import DataTableForRoles from './DataTableForRoles';
import { Icons } from "@/images/Icons";
import PermissionCheck from "@/app/(site)/permission-check";
import { Access_Scope } from "@/helper/constants";

const RolesTable = () => {
    const [loading, setLoading] = useState(true);
    const allRoles = useGetRoles(setLoading);
    const [roles, setRoles] = useState<Roles[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>({});

    useEffect(() => {
        setRoles(allRoles?.map((role: any) => ({
            ...role,
            actions: (
                <>
                    <div
                        className="flex items-center space-x-3.5"
                    >
                        <PermissionCheck permission={Access_Scope.Role.Edit}>
                            <button className="hover:text-primary"
                                onClick={() => {
                                    setSelectedRole(role)
                                    setModalOpen(true)
                                }}>
                                <Icons.edit />
                            </button>
                        </PermissionCheck>
                        <PermissionCheck permission={Access_Scope.Role.Delete}>
                            <button
                                className="hover:text-primary"
                                onClick={() => {
                                    setSelectedRole(role)
                                    setDeleteModalOpen(true)
                                }}>
                                <Icons.delete />
                            </button>
                        </PermissionCheck>
                    </div>
                </>
            ),
        })))
        console.log(roles);
    }, [allRoles])

    const handleUpdateRole = (UpdatedData: any, id: string) => {
        setRoles((pre) => {
            return pre.map((role: any) => {
                if (role.id === id) {
                    return {
                        ...role,
                        ...UpdatedData
                    }
                }
                return role
            })
        })
    }


    const HandleDeleteRole = async () => {
        const { message, status } = await deleteRole(selectedRole.id)
        if (status !== 200) {
            setDeleteModalOpen(false);
            toast.error(message);
        } else {
            setRoles(roles.filter((role: any) => role.id !== selectedRole.id));
            setDeleteModalOpen(false);
            toast.success(message);
        }
    };
    const DataTableProp = {
        roles,
        loading
    }
    return (
        <>
            <DataTableForRoles {...DataTableProp} />
            <RolesModelEdit
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                RoleData={selectedRole}
                handleUpdateRole={handleUpdateRole}
            />
            <RolesModelDelete
                modalOpen={deleteModalOpen}
                setModalOpen={setDeleteModalOpen}
                RoleData={selectedRole}
                HandleDeleteRole={HandleDeleteRole}
            />
        </>
    );
};
export default RolesTable;
