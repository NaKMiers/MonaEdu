import { IPackage } from '@/models/PackageModel'
import { deletePackagesApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTrash } from 'react-icons/fa'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { RiDonutChartFill } from 'react-icons/ri'

interface PackageItemProps {
  pkg: IPackage
  setPackages: Dispatch<SetStateAction<IPackage[]>>
  className?: string
}

function PackageItem({ pkg, setPackages, className = '' }: PackageItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [isOpenStatusConfirmModal, setIsOpenStatusConfirmModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // handle delete packages
  const handleDeletePackages = useCallback(async (ids: string[]) => {
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
  }, [])

  return (
    <>
      <div className='relative border-2 border-dark rounded-lg shadow-md p-2 text-sm font-body tracking-wider'>
        <button
          className='absolute top-0.5 right-0.5 border-2 border-dark rounded-md p-1 group bg-dark-100 hover:bg-primary trans-200'
          onClick={() => setIsOpenConfirmModal(true)}
        >
          {loading ? (
            <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
          ) : (
            <FaTrash size={14} className='wiggle text-light group-hover:text-dark trans-200' />
          )}
        </button>
        <p className='font-semibold text-base'>{pkg.title}</p>
        <div className='flex items-center flex-wrap gap-2'>
          <p className='font-semibold text-xl text-primary'>{formatPrice(pkg.price)}</p>
          <p className='line-through text-slate-500 text-sm'>{formatPrice(pkg.oldPrice)}</p>
        </div>
        <ul>
          {pkg.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

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
