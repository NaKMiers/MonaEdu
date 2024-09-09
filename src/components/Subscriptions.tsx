import { IPackageGroup } from '@/models/PackageGroupModel'
import Divider from './Divider'

interface SubscriptionsProps {
  packageGroups: IPackageGroup[]
  className?: string
}

function Subscriptions({ packageGroups, className }: SubscriptionsProps) {
  console.log(packageGroups)

  return (
    <div className={`max-w-1200 w-full mx-auto text-light ${className}`}>
      <h1 className='font-semibold font-body tracking-wider text-5xl text-center'>Gói hội viên</h1>

      <Divider size={10} border />

      <div className='flex flex-col gap-21'>
        {packageGroups.map(pG => (
          <div key={pG._id}>
            <div className='flex items-center justify-center'>
              <h2 className='min-w-[250px] rounded-3xl border-b-2 border-primary shadow-md text-center px-21 py-2 text-lg font-semibold bg-white bg-opacity-10'>
                {pG.title}
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-21'>
                {pG.packages!.map(pkg => (
                  <div className='' key={pkg._id}></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Subscriptions
