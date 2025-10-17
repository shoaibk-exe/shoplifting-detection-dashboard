import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AddRolesForm from "@/components/Roles/AddRolesForm";
export const metadata: Metadata = {
    title: `Add Role`,
    description: `This is Add Role page for Alf Vision Dashboard`,
};

const RolesAdd = () => {
    return (
        <>
            <DefaultLayout>
                <Breadcrumb pageName="Add Role" />
                <AddRolesForm />
            </DefaultLayout>

        </>
    )
}

export default RolesAdd