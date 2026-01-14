import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import ViewLiveCameras from '@/components/LiveCameras/ViewLiveCameras';

export const metadata: Metadata = {
    title: `View Live Cameras`,
    description: `Grid view of all configured RTSP cameras`,
};

const ViewLiveCamerasPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Live Cameras" />
            <ViewLiveCameras />
        </DefaultLayout>
    )
}

export default ViewLiveCamerasPage;
