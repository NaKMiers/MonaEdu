import { IPackage } from '@/models/PackageModel'
import { deletePackagesApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import PackageModal from './PackageModal'
import Divider from '../Divider'

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
        className={`relative flex gap-1.5 border-2 border-dark rounded-lg shadow-md p-2 text-sm font-body tracking-wider ${className}`}
      >
        <div className='flex-1'>
          <p className='font-semibold text-base flex items-center flex-wrap gap-1.5'>
            {pkg.title}{' '}
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                pkg.active ? 'bg-green-400' : 'bg-slate-400'
              }`}
              title={pkg.active ? 'active' : 'de-active'}
            />
          </p>
          <p className='text-xs text-ellipsis line-clamp-2 max-w-full'>{pkg.description}</p>
          <div className='flex items-center flex-wrap gap-2'>
            <p className='font-semibold text-xl text-primary'>{formatPrice(pkg.price)}</p>
            <p className='line-through text-slate-500 text-sm'>{formatPrice(pkg.oldPrice)}</p>
          </div>

          <Divider size={1} border />

          <ul className='max-h-[100px] overflow-y-auto'>
            {pkg.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col gap-1.5'>
          <button
            onClick={e => {
              e.stopPropagation()
              setOpenEditPackageModal(true)
            }}
            className='rounded-md p-1.5 group bg-sky-500 hover:bg-primary trans-200'
          >
            <MdEdit size={15} className='wiggle text-light group-hover:text-dark trans-200' />
          </button>
          <button
            className='rounded-md p-1.5 group bg-dark-100 hover:bg-primary trans-200'
            onClick={() => setIsOpenConfirmModal(true)}
          >
            {loading ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaTrash size={14} className='wiggle text-light group-hover:text-dark trans-200' />
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
        title='Delete Package'
        content='Are you sure that you want to delete this package?'
        onAccept={() => handleDeletePackages([pkg._id])}
        isLoading={loading}
      />
    </>
  )
}

export default PackageItem
