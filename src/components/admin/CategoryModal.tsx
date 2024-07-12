import { ICategory } from '@/models/CategoryModel'
import { addCategoryApi, updateCategoryApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
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

  // states
  const [imageUrl, setImageUrl] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [isChangingImage, setIsChangingImage] = useState<boolean>(false)

  // refs
  const imageInputRef = useRef<HTMLInputElement>(null)

  // handle add files when user select files
  const handleAddFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        // validate file type and size
        if (!file.type.startsWith('image/')) {
          return toast.error('Please select an image file')
        }
        if (file.size > 3 * 1024 * 1024) {
          return toast.error('Please select an image file less than 3MB')
        }

        setFile(file)
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }
        setImageUrl(URL.createObjectURL(file))

        e.target.value = ''
        e.target.files = null
      }
    },
    [imageUrl]
  )

  // cancel changing avatar
  const handleCancelAvatar = useCallback(async () => {
    setFile(null)
    setImageUrl('')

    URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

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
      // if (!file) {
      //   return toast.error('Please select an image file')
      // }

      // start loading
      setIsLoading(true)

      try {
        const formData = new FormData()
        formData.append('parentId', data.parentId)
        formData.append('title', data.title)
        formData.append('description', data.description)
        if (file) {
          formData.append('image', file)
        }

        // add new category login here
        const { category, message } = await addCategoryApi(formData)

        // show success message
        toast.success(message)

        // update categories
        setCategories(prev => [category, ...prev])

        // clear form
        reset()

        // clear file
        setFile(null)
        URL.revokeObjectURL(imageUrl)

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
    [reset, setCategories, setOpen, file, imageUrl]
  )

  const onEditSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // if (!file && !category?.image) {
      //   return toast.error('Please select an image file')
      // }

      if (!category) return

      // start loading
      setIsLoading(true)

      try {
        const formData = new FormData()
        formData.append('parentId', data.parentId)
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('originalImage', category.image)
        if (file) {
          formData.append('image', file)
        }

        // send request to server
        const { category: ctg, message } = await updateCategoryApi(category._id, formData)

        // update categories from state
        setCategories(prev =>
          prev.map(category =>
            category._id === ctg._id
              ? {
                  ...category,
                  ...ctg,
                }
              : category
          )
        )

        // show success message
        toast.success(message)

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
    [setCategories, setOpen, category, file]
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

            <div
              className='group relative rounded-xl bg-slate-200 shadow-lg aspect-square mx-auto max-w-[200px] w-full overflow-hidden cursor-pointer'
              onClick={() => !imageUrl && imageInputRef.current?.click()}
            >
              {(imageUrl || category?.image) && (
                <Image
                  className='w-full h-full object-cover'
                  src={imageUrl || category?.image || ''}
                  width={200}
                  height={200}
                  alt='image'
                />
              )}
              <input
                id='images'
                hidden
                placeholder=' '
                disabled={isChangingImage}
                type='file'
                accept='image/*'
                onChange={handleAddFile}
                ref={imageInputRef}
              />
              {!imageUrl && (
                <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-wider text-slate-300 drop-shadow-sm'>
                  {category?.image ? 'Change' : 'Upload'}
                </span>
              )}

              {imageUrl && (
                <button
                  className='absolute top-0 left-0 right-0 bottom-0 tracking-wider drop-shadow-sm bg-slate-200 bg-opacity-50 opacity-0 group-hover:opacity-100 trans-300'
                  onClick={handleCancelAvatar}
                >
                  Remove
                </button>
              )}
            </div>

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
                onClick={() => setOpen(false)}
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
