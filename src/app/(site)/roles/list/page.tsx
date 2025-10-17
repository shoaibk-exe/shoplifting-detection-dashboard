import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import RolesTable from "@/components/Roles/RolesTable";
export const metadata: Metadata = {
    title: `Roles List`,
    description: `This is Roles List page for Alf Vision Dashboard`,
};

const Roles = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="All Roles" />
            <div className="flex flex-col gap-10">
                <RolesTable />
            </div>
        </DefaultLayout>
    )
}

export default Roles