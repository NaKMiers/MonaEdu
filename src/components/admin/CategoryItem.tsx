import { ICategory } from '@/models/CategoryModel'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { FaChevronUp } from 'react-icons/fa'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { bootCategoriesApi, deleteCategoryApi } from '@/requests'
import toast from 'react-hot-toast'
import CategoryModal from './CategoryModal'

interface CategoryItemProps {
  data: ICategory
  setCategories: Dispatch<SetStateAction<ICategory[]>>
  className?: string
}

function CategoryItem({ data: category, setCategories, className = '' }: CategoryItemProps) {
  // states
  const [data, setData] = useState<ICategory>(category)
  const [open, setOpen] = useState<boolean>(true)

  // delete
  const [deleting, setDeleting] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // add
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState<boolean>(false)

  // edit
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState<boolean>(false)

  // update data
  useEffect(() => {
    setData(category)
  }, [category])

  // feature category
  const handleBootCategory = useCallback(async () => {
    try {
      // send request to server
      const { category, message } = await bootCategoriesApi(data._id, !data.booted)

      // update categories from state
      setData(category)

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [data])

  // delete category
  const handleDeleteCategory = useCallback(async () => {
    setDeleting(true)

    try {
      // send request to server
      const { category, message } = await deleteCategoryApi(data._id)

      console.log('category', category)

      // remove deleted categories from state
      setCategories(prev => prev.filter(ctg => ctg._id !== category._id))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }, [data._id, setCategories])

  return (
    <>
      <div
        className={`overflow-hidden flex items-center justify-between gap-3 trans-300 bg-white text-dark rounded-lg px-3 py-1.5 hover:bg-secondary hover:text-white cursor-pointer ${className}`}
        onClick={() => setOpen(!open)}
      >
        <span>{data.title}</span>
        <div className='flex items-center gap-2'>
          <button
            onClick={e => {
              e.stopPropagation()
              setOpenAddCategoryModal(true)
            }}
            className='rounded-lg text-xs border-2 border-dark px-2 py-1 bg-white text-dark hover:bg-primary trans-200'
          >
            Add
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              setOpenEditCategoryModal(true)
            }}
            className='rounded-lg text-xs border-2 border-dark px-2 py-1 bg-white text-dark hover:bg-primary trans-200'
          >
            Edit
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              handleBootCategory()
            }}
            className={`rounded-lg text-xs border-2 border-dark px-2 py-1 text-dark hover:bg-primary trans-200 ${
              data.booted ? 'bg-primary font-semibold' : 'bg-white'
            }`}
          >
            Boot
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            className='rounded-lg text-xs border-2 border-dark px-2 py-1 bg-white text-dark hover:bg-rose-300 trans-200'
          >
            Delete
          </button>
          <FaChevronUp size={20} className={`${open ? 'rotate-180' : ''} trans-300`} />
        </div>
      </div>

      {/* Sub Categories */}
      {/* <div className={`flex flex-col gap-2 ${open ? 'max-h-auto' : 'max-h-0 p-0'}`}>
        {data.subs?.map(category => (
          <CategoryItem
            data={category}
            key={category._id}
          />
        ))}
      </div> */}

      {/* Add Category Modal */}
      <CategoryModal
        title={`Add Category for: ${data.title}`}
        open={openAddCategoryModal}
        setOpen={setOpenAddCategoryModal}
        setCategories={setCategories}
      />

      {/* Edit Category Modal */}
      <CategoryModal
        title={`Edit Category for: ${data.title}`}
        open={openEditCategoryModal}
        setOpen={setOpenEditCategoryModal}
        setCategories={setCategories}
        category={data}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Category'
        content='Are you sure that you want to delete this category?'
        onAccept={handleDeleteCategory}
        isLoading={deleting}
      />
    </>
  )
}

export default CategoryItem
