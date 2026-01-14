import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import AddLiveCamera from '@/components/LiveCameras/AddLiveCamera';

export const metadata: Metadata = {
    title: `Add Live Camera`,
    description: `Add a new live, RTSP-connected camera`,
};

const AddLiveCameraPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Live Camera" />
            <AddLiveCamera />
        </DefaultLayout>
    )
}

export default AddLiveCameraPage;
