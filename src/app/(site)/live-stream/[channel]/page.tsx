import DefaultLayout from '@/components/Layouts/DefaultLaout'
import React from 'react'
import { Metadata } from 'next'
import Livestream from '@/components/anomaly-detection/Livestream'
import { Icons } from '@/images/Icons'
export const metadata: Metadata = {
  title: `Live Stream`,
  description: `This is Live Stream page for Alf Vision Dashboard`,
};

const Livestreampage = ({ params: { channel } }: { params: { channel: string } }) => {
  return (
    <DefaultLayout>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className="text-[26px] font-bold leading-[30px]   text-dark dark:text-white">
          Live Stream
        </h2>
        <nav>
          <ol className="flex items-center gap-3">
            <div className='bg-primary text-white dark:text-white rounded-[10px] w-10 h-10 flex items-center justify-center'>
              <Icons.reload />
            </div>
            <div className='bg-primary text-white dark:text-white rounded-[10px] w-10 h-10 flex items-center justify-center'>
              <Icons.pauseANDplay />
            </div>
            <div className='bg-primary text-white dark:text-white rounded-[10px] w-10 h-10 flex items-center justify-center'>
              <Icons.addOrPlus />
            </div>
          </ol>
        </nav>
      </div>
      <Livestream channelName={channel} />
    </DefaultLayout>
  )

}

export default Livestreampage

