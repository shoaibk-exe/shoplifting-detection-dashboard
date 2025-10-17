import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import React from 'react'
import { Metadata } from 'next'
import Addetection from '@/components/anomaly-detection/Addetection'
export const metadata: Metadata = {
    title: `Anomaly Detection`,
    description: `This is Anomaly Detection page for Alf Vision Dashboard`,
};

const AnomalyDetection = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Anomaly Detection" />
            <Addetection />
        </DefaultLayout>
    )

}

export default AnomalyDetection
