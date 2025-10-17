"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/images/Icons";
import PermissionCheck from "@/app/(site)/permission-check";
import { Access_Scope } from "@/helper/constants";
import useGetUsers from "@/hooks/useGetUsers";
import UserModelEdit from "./UserModelEdit";
import { UserModelDelete } from "./UserModelDelete";
import toast from "react-hot-toast";
import { deleteUser } from "@/actions/users";
import { Users } from "@/types/Users";
import DataTableForUsers from "./DataTableForUsers";
import UserModelView from "./UserModelView";
const UsersTable = () => {
  const [loading, setLoading] = useState(true)
  const allUsers = useGetUsers(setLoading);
  const [users, setUsers] = useState<Users[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false); // Separate state for Edit Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users>();
  const userDeleteHandler = async () => {

    console.log(selectedUser)

    if (selectedUser?.id === undefined || selectedUser?.id === null) {
      toast.error("Please select a user to delete");
    } else {
      const { message, status } = await deleteUser(selectedUser.id);
      if (status !== 200) {
        toast.error(message);
      } else {
        setUsers(users.filter((user: any) => user.id !== selectedUser.id));
        setDeleteModalOpen(false);
        toast.success(message)
      }
    }
  }
  useEffect(() => {
    setUsers(allUsers.map((user: any) => ({
      ...user,
      role: user?.role?.name || "No Role",
      actions: (
        <>
          <div
            className="flex items-center space-x-3.5"
          >
            <PermissionCheck permission={Access_Scope.Role.Edit}>
              <button className="hover:text-primary"
                onClick={() => {
                  setSelectedUser(user)
                  setEditModalOpen(true)
                }}>
                <Icons.edit />
              </button>
            </PermissionCheck>
            <PermissionCheck permission={Access_Scope.Role.Read}>
              <button className="hover:text-primary"
                onClick={() => {
                  setSelectedUser(user)
                  setViewModalOpen(true)
                }}>
                <Icons.view />
              </button>
            </PermissionCheck>
            <PermissionCheck permission={Access_Scope.Role.Delete}>
              <button
                className="hover:text-primary"
                onClick={() => {
                  setSelectedUser(user)
                  setDeleteModalOpen(true)
                }}>
                <Icons.delete />
              </button>
            </PermissionCheck>
          </div>
        </>
      ),
    })))
  }, [allUsers]);
  const handleUpdateUser = (updatedUser: Users, id: string) => {
    setUsers((pre) => {
      return pre.map((user: any) => {
        if (user.id === id) {
          return {
            ...user,
            ...updatedUser,
            role: user.role,
          };
        }
        return user;
      });
    });
    setSelectedUser((pre: any) => {
      return {
        ...pre,
        ...updatedUser,
        role: pre.role,
      }
    });
  }
  const DataTableProps = {
    users,
    loading
  }
  return (
    <div className="max-w-full">
      <DataTableForUsers {...DataTableProps} />
      <UserModelEdit
        modalOpen={editModalOpen}
        setModalOpen={setEditModalOpen}
        UserData={selectedUser}
        handleUpdateUser={handleUpdateUser}
      />
      <UserModelDelete
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        userDeleteHandler={userDeleteHandler}
      />
      <UserModelView
        modalOpen={viewModalOpen}
        setModalOpen={setViewModalOpen}
        UserData={selectedUser} handleViewUser={function (userData: Users, id: string): void {
          throw new Error("Function not implemented.");
        }} />
    </div>
  );
};
export default UsersTable;


