import { ICategory } from '@/models/CategoryModel'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronUp, FaTrash } from 'react-icons/fa'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { bootCategoriesApi, deleteCategoryApi } from '@/requests'
import toast from 'react-hot-toast'
import CategoryModal from './CategoryModal'
import { MdEdit, MdOutlineAddCircle } from 'react-icons/md'
import { IoRocketSharp } from 'react-icons/io5'

interface CategoryItemProps {
  data: ICategory
  setCategories: Dispatch<SetStateAction<ICategory[]>>
  className?: string
}

function CategoryItem({ data: category, setCategories, className = '' }: CategoryItemProps) {
  // states
  const [data, setData] = useState<ICategory>(category)
  const [open, setOpen] = useState<boolean>(false)

  const [subCategories, setSubCategories] = useState<ICategory[]>(category.subs?.data || []) // subs

  // delete
  const [deleting, setDeleting] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false) // delete
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState<boolean>(false) // add
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState<boolean>(false) // edit

  // refs
  const categoryRef = useRef<HTMLDivElement>(null)

  // update data
  useEffect(() => {
    setData(category)
  }, [category])

  useEffect(() => {
    if (open && subCategories.length > 0) {
      if (!subCategories.length || !categoryRef.current) return

      const origin = 52
      const length = subCategories.length * 40
      const totalGap = (subCategories.length - 1) * 4
      const totalHeight = origin + length + totalGap

      categoryRef.current.style.setProperty('max-height', `${totalHeight}px`)
    } else {
      categoryRef.current?.style.removeProperty('max-height')
    }
  }, [open, subCategories])

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
        className={`h-9 flex-shrink-0 overflow-hidden flex items-center justify-between gap-3 trans-300 bg-white text-dark rounded-lg px-3 py-1.5 hover:bg-secondary hover:text-white cursor-pointer ${className}`}
        onClick={() => setOpen(!open)}
      >
        <span>{data.title}</span>
        <div className='flex items-center gap-2'>
          <button
            onClick={e => {
              e.stopPropagation()
              setOpenAddCategoryModal(true)
            }}
            className='h-7 flex items-center justify-center rounded-lg text-xs border-2 border-yellow-500 px-2 py-1 bg-white text-yellow-500 hover:bg-primary trans-200 group'
          >
            <MdOutlineAddCircle size={16} className='wiggle' />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              setOpenEditCategoryModal(true)
            }}
            className='h-7 flex items-center justify-center rounded-lg text-xs border-2 border-sky-500 px-2 py-1 bg-white text-sky-500 hover:bg-primary trans-200 group'
          >
            <MdEdit size={15} className='wiggle' />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              handleBootCategory()
            }}
            className={`h-7 flex items-center justify-center rounded-lg text-xs border-2 px-2 py-1 hover:bg-primary trans-200 group ${
              data.booted
                ? 'bg-green-500 text-dark border-dark font-semibold'
                : 'bg-white border-green-500 text-green-500'
            }`}
          >
            <IoRocketSharp size={14} className='wiggle' />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            className='h-7 flex items-center justify-center rounded-lg text-xs border-2 border-rose-500 px-2 py-1 bg-white text-rose-500 hover:bg-rose-300 trans-200 group'
          >
            <FaTrash size={12} className='wiggle' />
          </button>
          {!!subCategories.length && (
            <FaChevronUp size={16} className={`${open ? 'rotate-180' : ''} trans-300`} />
          )}
        </div>
      </div>

      {/* Sub Categories */}
      <div
        className={`flex flex-col gap-2 pl-8 overflow-hidden ${!open ? 'max-h-0 py-0' : ''} trans-300`}
        ref={categoryRef}
      >
        {subCategories.map((category, index) => (
          <CategoryItem
            data={category}
            setCategories={setSubCategories}
            className={index === 0 ? 'mt-1' : ''}
            key={category._id}
          />
        ))}
      </div>

      {/* Add Category Modal */}
      <CategoryModal
        title={`Add Category for: ${data.title}`}
        parentId={data._id}
        open={openAddCategoryModal}
        setOpen={setOpenAddCategoryModal}
        setCategories={setSubCategories}
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
