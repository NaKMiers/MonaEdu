import Divider from '@/components/Divider'
import Subscriptions from '@/components/Subscriptions'
import { IPackageGroup } from '@/models/PackageGroupModel'
import { getSubscriptionPageApi } from '@/requests'
import { notFound } from 'next/navigation'

async function SubscriptionPage() {
  let packageGroups: IPackageGroup[] = []

  try {
    // get all packages
    const data = await getSubscriptionPageApi('', { next: { revalidate: 3600 } })
    packageGroups = data.packageGroups
  } catch (err: any) {
    notFound()
  }

  return (
    <div className='-my-[72px] py-[72px] flex-col min-h-screen bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800 relative flex items-center w-full justify-center overflow-hidden'>
      <Divider size={40} />

      <h2 className='text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight'>
        Gói Học Viên Cao Cấp
        <br />
        <div className='relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]'>
          <div className='absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]'>
            <span className=''>Khám phá ngay.</span>
          </div>
          <div className='relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4'>
            <span className=''>Khám phá ngay.</span>
          </div>
        </div>
      </h2>

      <Divider size={40} />

      <Subscriptions packageGroups={packageGroups} />

      <div className='px-21 w-full max-w-1200 mx-auto'>
        <Divider size={40} border className='w-full' />
      </div>
    </div>
  )
}

export default SubscriptionPage
