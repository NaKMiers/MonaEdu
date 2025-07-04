import { IPackageGroup } from '@/models/PackageGroupModel'
import PackageItem from './PackageItem'

interface SubscriptionsProps {
  packageGroups: IPackageGroup[]
  className?: string
}

function Subscriptions({ packageGroups, className }: SubscriptionsProps) {
  return (
    <div className={`mx-auto w-full max-w-1200 text-light ${className}`}>
      <div className="flex flex-col gap-10">
        {packageGroups.map(pG => (
          <div
            className="mx-auto inline-block w-full xs:w-auto"
            key={pG._id}
          >
            <h2 className="rounded-t-md bg-white px-21 py-2 text-center text-xl font-semibold text-dark">
              {pG.title}
            </h2>

            <div
              className={`grid ${
                pG.packages?.length === 2
                  ? 'grid-cols-1 xs:grid-cols-2'
                  : 'grid-cols-1 xs:grid-cols-2 md:grid-cols-3'
              }`}
            >
              {pG.packages?.map((pkg, index) => (
                <PackageItem
                  className={`${index >= 2 ? 'xs:col-span-2' : ''} md:col-span-1`}
                  pkg={pkg}
                  key={index}
                  popular={
                    [...(pG.packages || [])].sort((a, b) => b.joined - a.joined)[0]._id === pkg._id
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Subscriptions
