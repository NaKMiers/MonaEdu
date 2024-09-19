import { IDoc } from '@/models/LessonModel'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, memo, SetStateAction, useCallback, useRef, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Divider from '../Divider'
import Input from '../Input'

interface CustomDocModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setCustomDocs: Dispatch<SetStateAction<IDoc[]>>
  className?: string
}

function CustomDocModal({ open, setOpen, setCustomDocs, className = '' }: CustomDocModalProps) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // states
  const [imageUrl, setImageUrl] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [isChangingImage, setIsChangingImage] = useState<boolean>(false)

  // refs
  const imageInputRef = useRef<HTMLInputElement>(null)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      url: process.env.NEXT_PUBLIC_CLOUDFRONT_URL + '/docs/',
      size: 0,
    },
  })

  // add new category
  const onAddSubmit: SubmitHandler<FieldValues> = useCallback(
    data => {
      setCustomDocs(prev => [...prev, { name: data.name, url: data.url, size: data.size }])

      // reset
      reset()
    },
    [setCustomDocs, reset]
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed z-10 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center ${className}`}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className='w-full max-w-[500px] rounded-medium shadow-medium bg-white p-21'
            onClick={e => e.stopPropagation()}
          >
            <h1 className='text-dark text-center font-semibold text-xl'>Add Custom Document</h1>

            <Input
              id='name'
              label='Name'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('name')}
            />

            <Input
              id='url'
              label='Url'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('url')}
            />

            <Input
              id='size'
              label='Size'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='number'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('size')}
            />

            <Divider size={5} />

            <div className='flex justify-center gap-3'>
              <button
                className={`font-semibold border-2 border-dark bg-slate-300 shadow-lg text-dark px-3 py-1.5 rounded-lg drop-shadow-md hover:text-light hover:border-slate-300 trans-200`}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className={`font-semibold border-2 border-dark shadow-lg text-dark px-3 py-1.5 rounded-lg drop-shadow-md hover:bg-dark-100 hover:text-light trans-200 ${
                  isLoading ? 'bg-slate-200 pointer-events-none' : ''
                }`}
                onClick={handleSubmit(onAddSubmit)}
              >
                Add
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(CustomDocModal)
