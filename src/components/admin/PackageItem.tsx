import { IPackage } from '@/models/PackageModel'
import { deletePackagesApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import Divider from '../Divider'
import PackageModal from './PackageModal'

interface PackageItemProps {
  pkg: IPackage
  packages: IPackage[]
  setPackages: Dispatch<SetStateAction<IPackage[]>>
  className?: string
}

function PackageItem({ pkg, packages, setPackages, className = '' }: PackageItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [isOpenEditPackageModal, setOpenEditPackageModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // handle delete packages
  const handleDeletePackages = useCallback(
    async (ids: string[]) => {
      // start loading
      setLoading(true)

      try {
        const { message } = await deletePackagesApi(ids)

        // update packages state
        setPackages(prev => prev.filter(p => !ids.includes(p._id)))

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [setPackages]
  )

  return (
    <>
      <div
        className={`relative flex gap-1.5 rounded-lg border-2 border-dark p-2 font-body text-sm tracking-wider shadow-md ${className}`}
      >
        <div className="flex-1">
          <p className="flex flex-wrap items-center gap-1.5 text-base font-semibold">
            {pkg.title}{' '}
            <span
              className={`inline-block h-3 w-3 rounded-full ${
                pkg.active ? 'bg-green-400' : 'bg-slate-400'
              }`}
              title={pkg.active ? 'active' : 'de-active'}
            />
          </p>
          <p className="line-clamp-2 max-w-full text-ellipsis text-xs">{pkg.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xl font-semibold text-green-500">{formatPrice(pkg.price)}</p>
            <p className="text-sm text-slate-500 line-through">{formatPrice(pkg.oldPrice)}</p>
          </div>
          <p
            className="text-xs"
            title="Credit"
          >
            Joined: <span className="font-semibold text-sky-500">{pkg.joined}</span>
          </p>
          {pkg.credit && (
            <p
              className="text-xs"
              title="Credit"
            >
              Credit: <span className="font-semibold text-violet-500">{pkg.credit}</span>
            </p>
          )}
          {pkg.days && (
            <p
              className="text-xs"
              title="Credit"
            >
              Days: <span className="font-semibold text-orange-500">{pkg.days}</span>
            </p>
          )}
          {pkg.maxPrice && (
            <p
              className="text-xs"
              title="Credit"
            >
              Max Price: <span className="font-semibold text-rose-500">{formatPrice(pkg.maxPrice)}</span>
            </p>
          )}

          <Divider
            size={1}
            border
          />

          <ul className="max-h-[100px] overflow-y-auto">
            {pkg.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={e => {
              e.stopPropagation()
              setOpenEditPackageModal(true)
            }}
            className="trans-200 group rounded-md bg-sky-500 p-1.5 hover:bg-primary"
          >
            <MdEdit
              size={15}
              className="wiggle trans-200 text-light group-hover:text-dark"
            />
          </button>
          <button
            className="trans-200 group rounded-md bg-dark-100 p-1.5 hover:bg-primary"
            onClick={() => setIsOpenConfirmModal(true)}
          >
            {loading ? (
              <RiDonutChartFill
                size={18}
                className="animate-spin text-slate-300"
              />
            ) : (
              <FaTrash
                size={14}
                className="wiggle trans-200 text-light group-hover:text-dark"
              />
            )}
          </button>
        </div>
      </div>

      {/* Edit Package Modal */}
      <PackageModal
        title={`Edit Package: ${pkg.title}`}
        open={isOpenEditPackageModal}
        setOpen={setOpenEditPackageModal}
        pkg={pkg}
        packages={packages}
        setPackages={setPackages}
        packageGroupId={pkg.packageGroup}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete Package"
        content="Are you sure that you want to delete this package?"
        onAccept={() => handleDeletePackages([pkg._id])}
        isLoading={loading}
      />
    </>
  )
}

export default memo(PackageItem)
