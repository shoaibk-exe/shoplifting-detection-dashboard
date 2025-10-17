import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import React from 'react'
import { Metadata } from 'next';
import ManageDevice from '@/components/ManageDevice/Managedevice';
import AddCameraForm from '@/components/ManageDevice/addCameraForm';
export const metadata: Metadata = {
    title: `Manage Devices`,
    description: `This is Manage Devices Page for Alf Vision Dashboard`,
};
const ManageDevicespage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Camera" />
            <AddCameraForm />
        </DefaultLayout>
    )
}

export default ManageDevicespage;