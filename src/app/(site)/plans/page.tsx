import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import { Metadata } from 'next';
import BuyaPlan from '@/components/BuyaPlan/plan'
export const metadata: Metadata = {
    title: `Plans`,
    description: `This is Plans page for Alf Vision Dashboard`,
};
const Planpage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Buy a Plan" />
            <div>
                <BuyaPlan/>
            </div>
        </DefaultLayout>
    )
}

export default Planpage;