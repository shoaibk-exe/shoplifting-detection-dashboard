import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AddUsersForm from "@/components/Users/AddUserForm";
export const metadata: Metadata = {
    title: `Add User`,
    description: `This is Add User page for Alf Vision Dashboard`,
};

const AddUser = () => {

    return (
        <>
            <DefaultLayout>
                <Breadcrumb pageName="Add User" />
                <AddUsersForm />
            </DefaultLayout>
        </>
    )
}

export default AddUser