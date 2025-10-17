import React, { useState, useEffect, useRef } from "react";
import ClickOutside from "@/components/ClickOutside";
import AddRolesForm from "./AddRolesForm";
import { renderingComp } from "@/helper/constants";

interface RolesModelEditProps {
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
    RoleData: any;
    handleUpdateRole: (UpdatedData: any, id: string) => void;
}


const RolesModelEdit = ({ modalOpen, setModalOpen, RoleData, handleUpdateRole }: RolesModelEditProps) => {
    // const [modalOpen, setModalOpen] = useState(false);
    return (
        <div>
            {modalOpen && (
                <div
                    className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center px-4 py-5 bg-[#27918f36]`}
                >
                    <ClickOutside onClick={() => setModalOpen(false)} className="w-[900px]">
                        <div className="w-full max-w-[1350px] rounded-[15px] bg-white px-6 py-8 shadow-3 dark:bg-gray-dark dark:shadow-card md:px-15 md:py-15">
                            <AddRolesForm renderFrom={renderingComp.Roles.Edit} RoleData={RoleData} setModalOpen={setModalOpen} handleUpdateRole={handleUpdateRole} />
                        </div>
                    </ClickOutside>
                </div>
            )}
        </div>
    );
};

export default RolesModelEdit;
