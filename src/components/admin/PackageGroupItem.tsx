import { IPackageGroup } from '@/models/PackageGroupModel'
import { IPackage } from '@/models/PackageModel'
import { deletePackageGroupApi } from '@/requests'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
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
      <div className={`rounded-lg border-2 bg-white text-dark shadow-lg ${className}`}>
        <div className="relative flex items-center justify-between px-4 pt-2.5">
          <p className="font-semibold">{data.title}</p>
          <div className="flex items-center gap-2">
            {/* Add Package Button */}
            <button
              onClick={e => {
                e.stopPropagation()
                setOpenAddPackageModal(true)
              }}
              className="trans-200 group flex h-7 items-center justify-center rounded-lg border-2 border-yellow-500 bg-white px-2 py-1 text-xs text-yellow-500 hover:bg-primary"
            >
              <MdOutlineAddCircle
                size={16}
                className="wiggle"
              />
            </button>

            {/* Edit Button */}
            <button
              onClick={e => {
                e.stopPropagation()
                setOpenEditPackageGroupModal(true)
              }}
              className="trans-200 group flex h-7 items-center justify-center rounded-lg border-2 border-sky-500 bg-white px-2 py-1 text-xs text-sky-500 hover:bg-sky-300"
            >
              <MdEdit
                size={15}
                className="wiggle"
              />
            </button>

            {/* Delete Button */}
            <button
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
              }}
              className={`trans-200 group flex h-7 items-center justify-center rounded-lg border-2 bg-white px-2 py-1 text-xs text-rose-500 hover:bg-rose-300 ${
                deleting ? 'pointer-events-none border-slate-200 bg-slate-200' : 'border-rose-500'
              }`}
            >
              {deleting ? (
                <FaCircleNotch
                  size={14}
                  className="trans-200 animate-spin text-slate-300"
                />
              ) : (
                <FaTrash
                  size={12}
                  className="wiggle"
                />
              )}
            </button>
          </div>
        </div>
        <p className="max-h-[100px] overflow-y-auto px-4 pb-2.5 font-body text-sm tracking-wider text-slate-400">
          {data.description}
        </p>

        {/* Collapse Button */}
        {packages.length > 0 && (
          <button
            className="flex w-full items-center justify-center rounded-md bg-dark-100 px-3 py-1.5 text-light"
            onClick={() => setCollapse(prev => !prev)}
          >
            <FaChevronUp
              size={14}
              className={`trans-200 ${collapse ? 'rotate-180' : ''}`}
            />
          </button>
        )}
        {packages.length > 0 && (
          <div
            className={`trans-300 grid grid-cols-1 gap-2 md:grid-cols-3 ${
              collapse ? 'max-h-[500px] overflow-y-auto pt-2' : 'max-h-0 overflow-hidden p-0'
            }`}
          >
            {packages.map(p => (
              <PackageItem
                pkg={p}
                packages={packages}
                setPackages={setPackages}
                key={p._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Package Group Modal */}
      <PackageGroupModal
        title="Edit Package Group"
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
        title="Delete Package Group"
        content="Are you sure that you want to delete this package group?"
        onAccept={handleDeletePackageGroups}
        isLoading={deleting}
      />
    </>
  )
}

export default memo(PackageGroupItem)
