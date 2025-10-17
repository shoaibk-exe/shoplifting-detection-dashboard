import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import React from 'react'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Setting`,
    description: `This is Setting page for Alf Vision Dashboard`,
};
const Setting = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Setting" />
            <div>
               Setting Page
            </div>
        </DefaultLayout>
    )
}

export default Setting