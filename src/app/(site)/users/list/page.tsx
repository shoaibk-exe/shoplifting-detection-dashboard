import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UsersTable from "@/components/Users/UsersTable";
export const metadata: Metadata = {
    title: `User List`,
    description: `This is User List page for Alf Vision Dashboard`,
};

const UsersEdits = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="User list" />
            <div className="flex flex-col gap-10">
                <UsersTable />
            </div>
        </DefaultLayout>
    )
}

export default UsersEdits