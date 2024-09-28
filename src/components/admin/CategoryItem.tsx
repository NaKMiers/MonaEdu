import { ICategory } from '@/models/CategoryModel'
import { bootCategoriesApi, deleteCategoryApi } from '@/requests'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaChevronUp, FaCircleNotch, FaTrash } from 'react-icons/fa'
import { IoRocketSharp } from 'react-icons/io5'
import { MdEdit, MdOutlineAddCircle } from 'react-icons/md'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import CategoryModal from './CategoryModal'

interface CategoryItemProps {
  data: ICategory
  setCategories: Dispatch<SetStateAction<ICategory[]>>
  selectMode?: boolean
  selectedCategory?: string
  setSelectedCategory?: Dispatch<SetStateAction<string>>
  className?: string
}

function CategoryItem({
  data: category,
  setCategories,
  selectMode,
  selectedCategory,
  setSelectedCategory,
  className = '',
}: CategoryItemProps) {
  // states
  const [data, setData] = useState<ICategory>(category)
  const [open, setOpen] = useState<boolean>(false)

  const [subCategories, setSubCategories] = useState<ICategory[]>(category.subs?.data || []) // subs

  // modals
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
        className={`trans-300 flex h-9 flex-shrink-0 cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-1.5 text-dark hover:bg-secondary hover:text-light ${
          selectMode && selectedCategory === data._id ? 'bg-green-500' : 'bg-white'
        } ${className}`}
        onClick={() => {
          setOpen(!open)
          if (selectMode && !category.subs.data.length && setSelectedCategory) {
            setSelectedCategory(selectedCategory === data._id ? '' : data._id)
          }
        }}
      >
        <span className="text-sm">{data.title}</span>

        {/* Action Buttons */}
        {!selectMode ? (
          <div className="flex items-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation()
                setOpenAddCategoryModal(true)
              }}
              className="trans-200 group flex h-7 items-center justify-center rounded-lg border-2 border-yellow-500 bg-white px-2 py-1 text-xs text-yellow-500 hover:bg-primary"
            >
              <MdOutlineAddCircle
                size={16}
                className="wiggle"
              />
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                setOpenEditCategoryModal(true)
              }}
              className="trans-200 group flex h-7 items-center justify-center rounded-lg border-2 border-sky-500 bg-white px-2 py-1 text-xs text-sky-500 hover:bg-primary"
            >
              <MdEdit
                size={15}
                className="wiggle"
              />
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                handleBootCategory()
              }}
              className={`trans-200 group flex h-7 items-center justify-center rounded-lg border-2 px-2 py-1 text-xs hover:bg-primary ${
                data.booted
                  ? 'border-dark bg-green-500 font-semibold text-dark'
                  : 'border-green-500 bg-white text-green-500'
              }`}
            >
              <IoRocketSharp
                size={14}
                className="wiggle"
              />
            </button>
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
            {!!subCategories.length && (
              <FaChevronUp
                size={16}
                className={`${open ? 'rotate-180' : ''} trans-300`}
              />
            )}
          </div>
        ) : (
          !!subCategories.length && (
            <FaChevronUp
              size={16}
              className={`${open ? 'rotate-180' : ''} trans-300`}
            />
          )
        )}
      </div>

      {/* Sub Categories */}
      <div
        className={`flex flex-col gap-2 overflow-hidden pl-8 ${
          open ? 'max-h-auto' : 'max-h-0 py-0'
        } trans-300`}
        ref={categoryRef}
      >
        {subCategories.map((category, index) => (
          <CategoryItem
            data={category}
            setCategories={setSubCategories}
            selectMode={selectMode}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
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
        title="Delete Category"
        content="Are you sure that you want to delete this category?"
        onAccept={handleDeleteCategory}
        isLoading={deleting}
      />
    </>
  )
}

export default memo(CategoryItem)
