import ClickOutside from "@/components/ClickOutside";
import AddUserForm from "./AddUserForm";
import { renderingComp } from "@/helper/constants";
import { Users } from "@/types/Users";
import { Icons } from "@/images/Icons";
import Image from "next/image";

interface UserModelViewProps {
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
    UserData: any;
    handleViewUser: (userData: Users, id: string) => void;
}


const UserModelView = ({ modalOpen, setModalOpen, UserData, handleViewUser }: UserModelViewProps) => {
    console.log(UserData, "UserData")
    return (
        <div>
            {modalOpen && (
                <div
                    className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-[#27918f36] px-4 py-5`}
                >
                    <ClickOutside onClick={() => setModalOpen(false)} className="w-[900px]">
                        <div className="w-full max-w-[1350px] rounded-[15px] bg-white px-6 py-8 shadow-3 dark:bg-gray-dark dark:shadow-card md:px-8 md:py-8">
                            <div
                                className="mb-2 flex cursor-pointer justify-end"
                                onClick={() => {
                                    setModalOpen(false);
                                }}
                            >
                                <Icons.closeIcon />
                            </div>
                            <div className="flex items-center justify-between pb-6 ">
                                {
                                    UserData.profilePicture === null ?
                                        <Icons.profile />
                                        : <Image
                                            src={UserData.profilePicture}
                                            width={150}
                                            height={150}
                                            alt="Profile Picture"
                                            priority
                                        />
                                }
                            </div>
                            <table className="w-full text-left text-sm text-gray-500">
                                <tbody className="text-gray-900 dark:text-gray-300">
                                    <tr>
                                        <td className="font-bold p-2">Name</td>
                                        <td>{UserData.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold p-2">Email</td>
                                        <td>{UserData.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold p-2">Contact Number</td>
                                        <td>{UserData.phoneNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold p-2">Designation</td>
                                        <td>{UserData.role.name}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </ClickOutside>
                </div>
            )}
        </div>
    );
};

export default UserModelView;