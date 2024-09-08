import { IPackageGroup } from '@/models/packageGroupModel'
import { IPackage } from '@/models/PackageModel'
import { useState } from 'react'
import { FaChevronUp, FaCircleNotch, FaTrash } from 'react-icons/fa'
import { MdEdit, MdOutlineAddCircle } from 'react-icons/md'
import PackageGroupModal from './PackageGroupModal'
import PackageItem from './PackageItem'
import PackageModal from './PackageModal'

interface PackageGroupItemProps {
  packageGroup: IPackageGroup
  className?: string
}

function PackageGroupItem({ packageGroup, className = '' }: PackageGroupItemProps) {
  // states
  const [data, setData] = useState<IPackageGroup>(packageGroup)
  const [packages, setPackages] = useState<IPackage[]>(packageGroup.packages || [])

  const [collapse, setCollapse] = useState<boolean>(false)
  const [openEditPackageGroupModal, setOpenEditPackageGroupModal] = useState<boolean>(false)
  const [openAddPackageModal, setOpenAddPackageModal] = useState<boolean>(false)

  return (
    <>
      <div className={`rounded-lg shadow-lg border-2 bg-white text-dark ${className}`}>
        <div className='relative flex items-center justify-between py-2.5 px-4'>
          <p className='font-semibold'>{data.title}</p>
          <div className='flex items-center gap-2'>
            <button
              onClick={e => {
                e.stopPropagation()
                setOpenAddPackageModal(true)
              }}
              className='h-7 flex items-center justify-center rounded-lg text-xs border-2 border-yellow-500 px-2 py-1 bg-white text-yellow-500 hover:bg-primary trans-200 group'
            >
              <MdOutlineAddCircle size={16} className='wiggle' />
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                setOpenEditPackageGroupModal(true)
              }}
              className='h-7 flex items-center justify-center rounded-lg text-xs border-2 border-sky-500 px-2 py-1 bg-white text-sky-500 hover:bg-primary trans-200 group'
            >
              <MdEdit size={15} className='wiggle' />
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                // setIsOpenConfirmModal(true)
              }}
              className={`h-7 flex items-center justify-center rounded-lg text-xs border-2 px-2 py-1 bg-white text-rose-500 hover:bg-rose-300 trans-200 group ${
                false ? 'bg-slate-200 border-slate-200 pointer-events-none' : 'border-rose-500'
              }`}
            >
              {false ? (
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
        <button
          className='flex items-center justify-center w-full py-1.5 px-3 rounded-md bg-dark-100 text-light'
          onClick={() => setCollapse(prev => !prev)}
        >
          <FaChevronUp size={14} className={`trans-200 ${collapse ? 'rotate-180' : ''}`} />
        </button>
        <div
          className={`grid grid-cols-3 gap-2 trans-300 ${
            collapse ? 'max-h-[500px] pt-2 overflow-y-auto' : 'max-h-0 p-0 overflow-hidden'
          }`}
        >
          {packages.map(p => (
            <PackageItem pkg={p} setPackages={setPackages} key={p._id} />
          ))}
        </div>
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
    </>
  )
}

export default PackageGroupItem
