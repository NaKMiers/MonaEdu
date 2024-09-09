import { IPackageGroup } from '@/models/asdPackageGroupModel'
import { IPackage } from '@/models/PackageModel'
import { deletePackageGroupApi } from '@/requests'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaChevronUp, FaCircleNotch, FaTrash } from 'react-icons/fa'
import { MdEdit, MdOutlineAddCircle } from 'react-icons/md'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import PackageGroupModal from './PackageGroupModal'
import PackageItem from './PackageItem'
import PackageModal from './PackageModal'

interface PackageGroupItemProps {
  packageGroup: IPackageGroup
  setPackageGroups: Dispatch<SetStateAction<IPackageGroup[]>>
  className?: string
}

function PackageGroupItem({ packageGroup, setPackageGroups, className = '' }: PackageGroupItemProps) {
  // states
  const [data, setData] = useState<IPackageGroup>(packageGroup)
  const [packages, setPackages] = useState<IPackage[]>(packageGroup.packages || [])

  const [collapse, setCollapse] = useState<boolean>(false)

  // add
  const [openAddPackageModal, setOpenAddPackageModal] = useState<boolean>(false)
  // edit
  const [openEditPackageGroupModal, setOpenEditPackageGroupModal] = useState<boolean>(false)
  // delete
  const [deleting, setDeleting] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // handle delete package groups
  const handleDeletePackageGroups = useCallback(async () => {
    // start loading
    setDeleting(true)

    try {
      const { deletedPackageGroups, message } = await deletePackageGroupApi([data._id])

      // update state
      setPackageGroups(prev =>
        prev.filter(pG => !deletedPackageGroups.map((dPG: IPackageGroup) => dPG._id).includes(pG._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop deleting
      setDeleting(false)
    }
  }, [setPackageGroups, data._id])

  return (
    <>
      <div className={`rounded-lg shadow-lg border-2 bg-white text-dark ${className}`}>
        <div className='relative flex items-center justify-between py-2.5 px-4'>
          <p className='font-semibold'>{data.title}</p>
          <div className='flex items-center gap-2'>
            {/* Add Package Button */}
            <button
              onClick={e => {
                e.stopPropagation()
                setOpenAddPackageModal(true)
              }}
              className='h-7 flex items-center justify-center rounded-lg text-xs border-2 border-yellow-500 px-2 py-1 bg-white text-yellow-500 hover:bg-primary trans-200 group'
            >
              <MdOutlineAddCircle size={16} className='wiggle' />
            </button>

            {/* Edit Button */}
            <button
              onClick={e => {
                e.stopPropagation()
                setOpenEditPackageGroupModal(true)
              }}
              className='h-7 flex items-center justify-center rounded-lg text-xs border-2 border-sky-500 px-2 py-1 bg-white text-sky-500 hover:bg-sky-300 trans-200 group'
            >
              <MdEdit size={15} className='wiggle' />
            </button>

            {/* Delete Button */}
            <button
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
              }}
              className={`h-7 flex items-center justify-center rounded-lg text-xs border-2 px-2 py-1 bg-white text-rose-500 hover:bg-rose-300 trans-200 group ${
                deleting ? 'bg-slate-200 border-slate-200 pointer-events-none' : 'border-rose-500'
              }`}
            >
              {deleting ? (
                <FaCircleNotch size={14} className='text-slate-300 trans-200 animate-spin' />
              ) : (
                <FaTrash size={12} className='wiggle' />
              )}
            </button>
          </div>
        </div>
        <p className='pb-2.5 px-4 text-slate-400 font-body tracking-wider text-sm max-h-[100px] overflow-y-auto'>
          {data.description}
        </p>

        {/* Collapse Button */}
        {packages.length > 0 && (
          <button
            className='flex items-center justify-center w-full py-1.5 px-3 rounded-md bg-dark-100 text-light'
            onClick={() => setCollapse(prev => !prev)}
          >
            <FaChevronUp size={14} className={`trans-200 ${collapse ? 'rotate-180' : ''}`} />
          </button>
        )}
        {packages.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 trans-300 ${
              collapse ? 'max-h-[500px] pt-2 overflow-y-auto' : 'max-h-0 p-0 overflow-hidden'
            }`}
          >
            {packages.map(p => (
              <PackageItem pkg={p} packages={packages} setPackages={setPackages} key={p._id} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Package Group Modal */}
      <PackageGroupModal
        title='Edit Package Group'
        open={openEditPackageGroupModal}
        setOpen={setOpenEditPackageGroupModal}
        packageGroup={data}
        setPackageGroup={setData}
      />

      {/* Add Package */}
      <PackageModal
        title={`Add Package: ${data.title}`}
        open={openAddPackageModal}
        setOpen={setOpenAddPackageModal}
        packages={packages}
        setPackages={setPackages}
        packageGroupId={data._id}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Package Group'
        content='Are you sure that you want to delete this package group?'
        onAccept={handleDeletePackageGroups}
        isLoading={deleting}
      />
    </>
  )
}

export default PackageGroupItem
