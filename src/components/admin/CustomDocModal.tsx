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
          className={`fixed bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-black bg-opacity-50 ${className}`}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-full max-w-[500px] rounded-medium bg-white p-21 shadow-medium"
            onClick={e => e.stopPropagation()}
          >
            <h1 className="text-center text-xl font-semibold text-dark">Add Custom Document</h1>

            <Input
              id="name"
              label="Name"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="text"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('name')}
            />

            <Input
              id="url"
              label="Url"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="text"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('url')}
            />

            <Input
              id="size"
              label="Size"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="number"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('size')}
            />

            <Divider size={5} />

            <div className="flex justify-center gap-3">
              <button
                className={`trans-200 rounded-lg border-2 border-dark bg-slate-300 px-3 py-1.5 font-semibold text-dark shadow-lg drop-shadow-md hover:border-slate-300 hover:text-light`}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className={`trans-200 rounded-lg border-2 border-dark px-3 py-1.5 font-semibold text-dark shadow-lg drop-shadow-md hover:bg-dark-100 hover:text-light ${
                  isLoading ? 'pointer-events-none bg-slate-200' : ''
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
