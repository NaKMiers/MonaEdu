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
    <div className="relative -my-[72px] flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-800 py-[72px]">
      <Divider size={40} />

      <h2 className="relative z-20 text-center font-sans text-2xl font-bold tracking-tight text-light md:text-4xl lg:text-7xl">
        Gói Học Viên Cao Cấp
        <br />
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="absolute left-0 top-[1px] bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text bg-no-repeat py-4 text-transparent [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">Khám phá ngay.</span>
          </div>
          <div className="relative bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text bg-no-repeat py-4 text-transparent">
            <span className="">Khám phá ngay.</span>
          </div>
        </div>
      </h2>

      <Divider size={40} />

      <Subscriptions packageGroups={packageGroups} />

      <div className="mx-auto w-full max-w-1200 px-21">
        <Divider
          size={40}
          border
          className="w-full"
        />
      </div>
    </div>
  )
}

export default SubscriptionPage
