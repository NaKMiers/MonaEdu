'use client'

import CategoryItem from '@/components/admin/CategoryItem'
import CategoryModal from '@/components/admin/CategoryModal'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { getAllCategoriesApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'

export type EditingValues = {
  _id: string
  title: string
}

function AllCategoriesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()

  // states
  const [categories, setCategories] = useState<ICategory[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState<boolean>(false)

  // values
  const itemPerPage = 10

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
        const { categories, amount } = await getAllCategoriesApi(query)

        // set to states
        setCategories(categories)
        setAmount(amount)
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

  // set page title
  useEffect(() => {
    document.title = 'Categories - Mona Edu'
  }, [])

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
          All Categories
        </div>

        <button
          className="trans-200 flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-2 text-dark hover:bg-yellow-300 hover:text-secondary"
          onClick={() => setOpenAddCategoryModal(true)}
        >
          <FaPlus />
          Add
        </button>
      </div>

      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
      />

      {/* MARK: Amount */}
      <div className="p-3 text-right text-sm font-semibold text-light">
        {categories.length} {categories.length > 1 ? 'categories' : 'category'}
      </div>

      {/* MARK: MAIN LIST */}
      <div className="flex flex-col gap-2">
        {categories.map(category => (
          <CategoryItem
            data={category}
            setCategories={setCategories}
            key={category._id}
          />
        ))}
      </div>

      {/* Add Category Modal */}
      <CategoryModal
        title="Add Category"
        open={openAddCategoryModal}
        setOpen={setOpenAddCategoryModal}
        setCategories={setCategories}
      />
    </div>
  )
}

export default AllCategoriesPage
