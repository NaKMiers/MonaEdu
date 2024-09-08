import { IPackage } from '@/models/PackageModel'
import { addPackageApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch, FaMoneyBillAlt, FaPlay, FaPlusCircle } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'
import Divider from '../Divider'
import Input from '../Input'

interface PackageModalProps {
  title: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  packageGroupId?: string
  pkg?: IPackage
  setPackage?: Dispatch<SetStateAction<IPackage>>
  packages?: IPackage[]
  setPackages?: Dispatch<SetStateAction<IPackage[]>>
  className?: string
}

function PackageModal({
  title,
  open,
  setOpen,
  pkg,
  packageGroupId,
  setPackage,
  packages,
  setPackages,
  className = '',
}: PackageModalProps) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isActiveChecked, setIsActiveChecked] = useState<boolean>(pkg?.active || true)
  const [featureValue, setFeatureValue] = useState<string>('')
  const [features, setFeatures] = useState<string[]>(pkg?.features || [])

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      title: pkg?.title || '',
      oldPrice: pkg?.oldPrice || 0,
      price: pkg?.price || 0,
      description: pkg?.description || '',
      packageGroup: pkg?.packageGroup || '',
    },
  })

  // add new packageGroup
  const onAddSubmit: SubmitHandler<FieldValues> = useCallback(async data => {
    if (!setPackages) {
      toast.error('Package not found')
      return
    }

    // start loading
    setIsLoading(true)

    try {
      // add new packageGroup login here
      const { package: pack, message } = await addPackageApi({
        ...data,
        packageGroup: packageGroupId,
        features,
        active: isActiveChecked,
      })

      console.log('pack', pack)

      // update packages from state
      setPackages(prev => [...prev, pack])

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
  }, [])

  const onEditSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!pkg || !setPackages) {
        toast.error('Package not found')
        return
      }

      // start loading
      setIsLoading(true)

      // try {
      //   // send request to server
      //   const { packageGroup: pG, message } = await updatePackageGroupApi(
      //     packageGroup._id,
      //     data.title,
      //     data.description
      //   )

      //   // update package group from state
      //   setPackageGroups(prev => prev.map(p => (p._id === pG._id ? pG : p)))

      //   // show success message
      //   toast.success(message)

      //   // close modal
      //   setOpen(false)
      // } catch (err: any) {
      //   console.log(err)
      //   toast.error(err.message)
      // } finally {
      //   // stop loading
      //   setIsLoading(false)
      // }
    },
    [pkg, setPackages]
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
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('description')}
            />

            <Divider size={3} />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 '>
              {/* Price */}
              <Input
                id='price'
                label='Price'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                icon={FaMoneyBillAlt}
                onFocus={() => clearErrors('price')}
              />

              {/* Old Price */}
              <Input
                id='oldPrice'
                label='Old Price'
                disabled={isLoading}
                register={register}
                errors={errors}
                type='number'
                icon={FaMoneyBillAlt}
                onFocus={() => clearErrors('oldPrice')}
              />
            </div>

            <Divider size={3} />

            {/* Active */}
            <div className='flex'>
              <div className='bg-white rounded-lg px-3 flex items-center'>
                <FaPlay size={16} className='text-secondary' />
              </div>
              <label
                className={`select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg trans-200  ${
                  isActiveChecked ? 'bg-green-500 text-white' : 'bg-white text-green-500'
                }`}
                htmlFor='active'
                onClick={() => setIsActiveChecked(!isActiveChecked)}
              >
                Active
              </label>
              <input type='checkbox' id='active' hidden {...register('active', { required: false })} />
            </div>

            <Divider size={3} />

            <p className='font-semibold text-dark mb-1'>Features</p>
            <div className='flex justify-between rounded-lg shadow-lg border-1 border-dark overflow-hidden'>
              <input
                name='features'
                className='w-full px-4 py-2 text-sm text-dark outline-none'
                placeholder='Feature...'
                value={featureValue}
                onChange={e => setFeatureValue(e.target.value)}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    setFeatures(prev => [...prev, featureValue])
                    setFeatureValue('')
                  }
                }}
              />
              <button
                className='bg-primary text-dark px-2 trans-200 hover:text-white hover:bg-secondary'
                onClick={() => {
                  setFeatures(prev => [...prev, featureValue])
                  setFeatureValue('')
                }}
              >
                <FaPlusCircle />
              </button>
            </div>
            {features.length > 0 && (
              <ul className='flex flex-col text-dark text-sm font-body tracking-wider rounded-lg border border-dark py-1 px-2 mt-2 max-h-[100px] overflow-y-auto'>
                {features.map((feature, index) => (
                  <li className='flex justify-between items-center' key={index}>
                    <p>{feature}</p>
                    <button
                      className='group'
                      onClick={() => setFeatures(prev => prev.filter(f => f !== feature))}
                    >
                      <FaDeleteLeft size={16} className='wiggle' />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Divider size={8} />

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
                onClick={handleSubmit(pkg ? onEditSubmit : onAddSubmit)}
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

export default memo(PackageModal)
