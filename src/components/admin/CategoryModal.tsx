import { ICategory } from '@/models/CategoryModel'
import { addCategoryApi, updateCategoryApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import Divider from '../Divider'
import Input from '../Input'

interface CategoryModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setCategories: Dispatch<SetStateAction<ICategory[]>>
  parentId?: string
  title: string
  category?: ICategory
  className?: string
}

function CategoryModal({
  open,
  setOpen,
  setCategories,
  parentId,
  title,
  category,
  className = '',
}: CategoryModalProps) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      parentId: category?._id || parentId || '',
      title: category?.title || '',
      description: category?.description || '',
    },
  })

  // add new category
  const onAddSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setIsLoading(true)

      try {
        // add new category login here
        const { category, message } = await addCategoryApi(data)

        // show success message
        toast.success(message)

        // update categories
        setCategories(prev => [category, ...prev])

        // clear form
        reset()

        // close modal
        setOpen(false)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [reset, setCategories, setOpen]
  )

  const onEditSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!category) return

      // start loading
      setIsLoading(true)

      try {
        // send request to server
        const { category: ctg, message } = await updateCategoryApi(category._id, data)

        console.log('Updated Category: ', ctg)

        // update categories from state
        setCategories(prev => prev.map(category => (category._id === ctg._id ? ctg : category)))

        toast.success(message)
        // show success message

        // close modal
        setOpen(false)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [category, setCategories, setOpen]
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center ${className}`}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className='w-full max-w-[500px] rounded-medium shadow-medium bg-white p-21'
            onClick={e => e.stopPropagation()}
          >
            <h1 className='text-dark text-center font-semibold text-xl'>{title}</h1>

            <Divider size={2} />

            <Input
              id='title'
              label='Title'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('title')}
            />

            <Input
              id='description'
              label='Description'
              disabled={isLoading}
              register={register}
              errors={errors}
              type='textarea'
              labelBg='bg-white'
              className='min-w-[40%] mt-6'
              onFocus={() => clearErrors('description')}
            />

            <Divider size={5} />

            <div className='flex justify-center gap-3'>
              <button
                className={`font-semibold border-2 border-dark bg-slate-300 shadow-lg text-dark px-3 py-1.5 rounded-lg drop-shadow-md hover:text-white hover:border-slate-300 trans-200`}
                onAbort={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className={`font-semibold border-2 border-dark shadow-lg text-dark px-3 py-1.5 rounded-lg drop-shadow-md hover:bg-dark-100 hover:text-white trans-200 ${
                  isLoading ? 'bg-slate-200 pointer-events-none' : ''
                }`}
                onClick={handleSubmit(category ? onEditSubmit : onAddSubmit)}
              >
                {isLoading ? (
                  <FaCircleNotch size={18} className='text-slate-400 trans-200 animate-spin' />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CategoryModal
