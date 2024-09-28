'use client'

import PackageGroupItem from '@/components/admin/PackageGroupItem'
import PackageGroupModal from '@/components/admin/PackageGroupModal'
import Divider from '@/components/Divider'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IPackageGroup } from '@/models/PackageGroupModel'
import { getAllPackagesApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'

function PackageAllPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [openAddPackageGroupModal, setOpenAddPackageGroupModal] = useState<boolean>(false)
  const [packageGroups, setPackageGroups] = useState<IPackageGroup[]>([])

  // MARK: Get Data
  // get all categories
  useEffect(() => {
    // get all categories
    const getAllCategories = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { packageGroups } = await getAllPackagesApi(query)

        // set to states
        setPackageGroups(packageGroups)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllCategories()
  }, [dispatch, searchParams])

  return (
    <div className="w-full">
      {/* MARK: Top & Pagination */}
      <div className={`mb-3 flex flex-wrap items-end justify-center gap-3 text-sm`}>
        <Link
          className="trans-200 flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-2 text-dark hover:bg-white hover:text-primary"
          href="/admin"
        >
          <FaArrowLeft />
          Admin
        </Link>

        <div className="rounded-lg border border-slate-300 px-3 py-2 text-center text-lg text-light">
          All Packages
        </div>

        <button
          className="trans-200 flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-2 text-dark hover:bg-yellow-300 hover:text-secondary"
          onClick={() => setOpenAddPackageGroupModal(true)}
        >
          <FaPlus />
          Group
        </button>
      </div>

      <Divider
        border
        size={4}
      />

      {/* MARK: MAIN LIST */}
      <div className="flex flex-col gap-4">
        {packageGroups.map((packageGroup, index) => (
          <PackageGroupItem
            packageGroup={packageGroup}
            setPackageGroups={setPackageGroups}
            key={index}
          />
        ))}
      </div>

      {/* Add Package Group Modal */}
      <PackageGroupModal
        title="Add Package Group"
        open={openAddPackageGroupModal}
        setOpen={setOpenAddPackageGroupModal}
        packageGroups={packageGroups}
        setPackageGroups={setPackageGroups}
      />
    </div>
  )
}

export default PackageAllPage
