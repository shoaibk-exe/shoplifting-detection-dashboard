import ClickOutside from "@/components/ClickOutside";
import AddUserForm from "./AddUserForm";
import { renderingComp } from "@/helper/constants";
import { Users } from "@/types/Users";

interface UserModelEditProps {
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
    UserData: any;
    handleUpdateUser: (userData: Users, id: string) => void;
}


const UserModelEdit = ({ modalOpen, setModalOpen, UserData, handleUpdateUser }: UserModelEditProps) => {

    return (
        <div>
            {modalOpen && (
                <div
                    className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-[#27918f36] px-4 py-5`}
                >
                    <ClickOutside onClick={() => setModalOpen(false)} className="w-[900px]">
                        <div className="w-full max-w-[1350px] rounded-[15px] bg-white px-6 py-8 shadow-3 dark:bg-gray-dark dark:shadow-card md:px-15 md:py-15">
                            <AddUserForm renderFrom={renderingComp.Users.Edit} UserData={UserData} setModalOpen={setModalOpen} handleUpdateUser={handleUpdateUser} />
                        </div>
                    </ClickOutside>
                </div>
            )}
        </div>
    );
};
export default UserModelEdit;
