import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import React from 'react'
import { Metadata } from 'next';
import SavedVideo from '@/components/SavedVideo/Savedvideo'
export const metadata: Metadata = {
    title: `Saved Video`,
    description: `This is Saved Video Page for Alf Vision Dashboard`,
};
const SavedVideopage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Saved Video" />
            <SavedVideo />
        </DefaultLayout>
    )
}

export default SavedVideopage