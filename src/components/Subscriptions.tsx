import { IPackageGroup } from '@/models/PackageGroupModel'
import Divider from './Divider'
import PackageItem from './PackageItem'

interface SubscriptionsProps {
  packageGroups: IPackageGroup[]
  className?: string
}

function Subscriptions({ packageGroups, className }: SubscriptionsProps) {
  return (
    <div className={`max-w-1200 w-full mx-auto text-light ${className}`}>
      <h1 className='font-semibold text-3xl text-center'>Gói học viên</h1>
      <p className='text-center text-neutral-300'>Chọn lấy cơ hội để tối ưu hiệu quả học tập của bạn</p>

      <Divider size={10} />

      <div className='flex flex-col gap-21'>
        {packageGroups.map(pG => (
          <div key={pG._id}>
            <h2 className='text-center px-21 py-2 text-xl font-semibold bg-white text-dark rounded-t-md'>
              {pG.title}
            </h2>

            <div className='flex flex-wrap justify-between'>
              {pG.packages!.map(pkg => (
                <PackageItem pkg={pkg} key={pkg._id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Subscriptions
