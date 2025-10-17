import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import Dashboard from '@/components/Dashboard/Dashboard';
import DeviceRegistration from '@/components/DeviceRegistration/Deviceregistration';
export const metadata: Metadata = {
    title: `Device Registration`,
    description: `This is Device Registration Page for Alf Vision Dashboard`,
};
const Deviceregistrationpage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Device Registration" />
            <DeviceRegistration />
        </DefaultLayout>
    )
}

export default Deviceregistrationpage;