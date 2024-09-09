import { IPackageGroup } from '@/models/asdPackageGroupModel'
import { addPackageGroupApi, updatePackageGroupApi } from '@/requests/packageRequest'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import Divider from '../Divider'
import Input from '../Input'

interface PackageGroupModalProps {
  title: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
  packageGroup?: IPackageGroup
  setPackageGroup?: Dispatch<SetStateAction<IPackageGroup>>
  packageGroups?: IPackageGroup[]
  setPackageGroups?: Dispatch<SetStateAction<IPackageGroup[]>>
}

function PackageGroupModal({
  title,
  open,
  setOpen,
  packageGroup,
  setPackageGroup,
  packageGroups,
  setPackageGroups,
  className = '',
}: PackageGroupModalProps) {
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
      title: packageGroup?.title || '',
      description: packageGroup?.description || '',
    },
  })

  // add new packageGroup
  const onAddSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!packageGroups || !setPackageGroups) {
        toast.error('Package Groups not found')
        return
      }

      // start loading
      setIsLoading(true)

      try {
        // add new packageGroup login here
        const { packageGroup, message } = await addPackageGroupApi(data.title, data.description)

        // update packageGroups from state
        setPackageGroups(prev => [...prev, packageGroup])

        // show success message
        toast.success(message)

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
    [reset, setOpen, setPackageGroups, packageGroups]
  )

  const onEditSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!packageGroup || !setPackageGroup) {
        toast.error('Package Group not found')
        return
      }

      // start loading
      setIsLoading(true)

      try {
        // send request to server
        const { packageGroup: pG, message } = await updatePackageGroupApi(
          packageGroup._id,
          data.title,
          data.description
        )

        // update package group from state
        setPackageGroup(prev => ({ ...prev, ...pG }))

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
    [packageGroup, setOpen, setPackageGroup]
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
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className={`font-semibold border-2 border-dark shadow-lg text-dark px-3 py-1.5 rounded-lg drop-shadow-md hover:bg-dark-100 hover:text-white trans-200 ${
                  isLoading ? 'bg-slate-200 pointer-events-none' : ''
                }`}
                onClick={handleSubmit(packageGroup ? onEditSubmit : onAddSubmit)}
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

export default memo(PackageGroupModal)
