import { IPackage } from '@/models/PackageModel'
import { addPackageApi, updatePackageApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch, FaMoneyBillAlt, FaPlay, FaPlusCircle } from 'react-icons/fa'
import { FaCalendarDays, FaDeleteLeft } from 'react-icons/fa6'
import { MdNumbers } from 'react-icons/md'
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
    setError,
  } = useForm<FieldValues>({
    defaultValues: {
      title: pkg?.title || '',
      oldPrice: pkg?.oldPrice || '',
      price: pkg?.price || '',
      description: pkg?.description || '',
      packageGroup: pkg?.packageGroup || '',
      credit: pkg?.credit || '',
      days: pkg?.days || '',
      maxPrice: pkg?.maxPrice || '',
    },
  })

  // validate form before submit
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // +credit -> -days, -maxPrice
      // +days -> -credit, -maxPrice
      // +maxPrice -> -credit, -days
      // -> -maxPrice, -credit, -days

      let count = 0

      const keys = ['credit', 'days', 'maxPrice']
      keys.forEach((key: string, index: number) => (data[key] ? count++ : count))

      if (count > 1) {
        setError('credit', {
          type: 'manual',
          message: '(Credit or Days or Max Price or Nothing) is required',
        })
        setError('days', {
          type: 'manual',
          message: '(Credit or Days or Max Price or Nothing) is required',
        })
        setError('maxPrice', {
          type: 'manual',
          message: '(Credit or Days or Max Price or Nothing) is required',
        })

        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // add new packageGroup
  const onAddSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!setPackages || !handleValidate(data)) return

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
    },
    [reset, setOpen, setPackages, handleValidate, packageGroupId, features, isActiveChecked, ,]
  )

  const onEditSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!pkg || !setPackages || !handleValidate(data)) return

      // start loading
      setIsLoading(true)

      try {
        // send request to server
        const { updatedPackage: pG, message } = await updatePackageApi(pkg?._id, {
          ...data,
          features,
          active: isActiveChecked,
        })

        // update packages from state
        setPackages(prev => prev.map(p => (p._id === pkg._id ? pG : p)))

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
    [setOpen, handleValidate, setPackages, pkg, features, isActiveChecked]
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
            className="max-h-[calc(100vh-2*80px)] w-full max-w-[600px] overflow-y-auto rounded-medium bg-white p-21 shadow-medium"
            onClick={e => e.stopPropagation()}
          >
            <h1 className="text-center text-xl font-semibold text-dark">{title}</h1>

            <Divider size={2} />

            <Input
              id="title"
              label="Title"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="text"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('title')}
            />

            <Input
              id="description"
              label="Description"
              disabled={isLoading}
              register={register}
              errors={errors}
              type="textarea"
              rows={2}
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('description')}
            />

            <Divider size={3} />

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {/* Price */}
              <Input
                id="price"
                label="Price"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="number"
                icon={FaMoneyBillAlt}
                onFocus={() => clearErrors('price')}
              />

              {/* Old Price */}
              <Input
                id="oldPrice"
                label="Old Price"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="number"
                icon={FaMoneyBillAlt}
                onFocus={() => clearErrors('oldPrice')}
              />
            </div>

            <Divider size={3} />

            {/* MARK: Credit - Expire - Max Price */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {/* Credit */}
              <Input
                id="credit"
                label="Credit"
                disabled={isLoading}
                register={register}
                errors={errors}
                min={0}
                max={10}
                type="number"
                icon={MdNumbers}
                onFocus={() => clearErrors(['credit', 'days', 'maxPrice'])}
              />

              {/* Days */}
              <Input
                id="days"
                label="Days"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="number"
                icon={FaCalendarDays}
                onFocus={() => clearErrors(['credit', 'days', 'maxPrice'])}
              />

              {/* Max Price */}
              <Input
                id="maxPrice"
                label="Max Price"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="number"
                icon={FaMoneyBillAlt}
                onFocus={() => clearErrors(['credit', 'days', 'maxPrice'])}
              />
            </div>

            <Divider size={3} />

            {/* Active */}
            <div className="flex">
              <div className="flex items-center rounded-lg bg-white px-3">
                <FaPlay
                  size={16}
                  className="text-secondary"
                />
              </div>
              <label
                className={`trans-200 cursor-pointer select-none rounded-lg border border-green-500 px-4 py-2 ${
                  isActiveChecked ? 'bg-green-500 text-light' : 'bg-white text-green-500'
                }`}
                htmlFor="active"
                onClick={() => setIsActiveChecked(!isActiveChecked)}
              >
                Active
              </label>
              <input
                type="checkbox"
                id="active"
                hidden
                {...register('active', { required: false })}
              />
            </div>

            <Divider size={3} />

            <p className="mb-1 font-semibold text-dark">Features</p>
            <div className="border-1 flex justify-between overflow-hidden rounded-lg border-dark shadow-lg">
              <input
                name="features"
                className="w-full px-4 py-2 text-sm text-dark outline-none"
                placeholder="Feature..."
                value={featureValue}
                onChange={e => setFeatureValue(e.target.value)}
                onKeyUp={e => {
                  if (e.key === 'Enter' && featureValue.trim()) {
                    setFeatures(prev => [...prev, featureValue])
                    setFeatureValue('')
                  }
                }}
              />
              <button
                className="trans-200 bg-primary px-2 text-dark hover:bg-secondary hover:text-light"
                onClick={() => {
                  if (featureValue.trim()) {
                    setFeatures(prev => [...prev, featureValue])
                    setFeatureValue('')
                  }
                }}
              >
                <FaPlusCircle />
              </button>
            </div>
            {features.length > 0 && (
              <ul className="mt-2 flex max-h-[100px] flex-col overflow-y-auto rounded-lg border border-dark px-2 py-1 font-body text-sm tracking-wider text-dark">
                {features.map((feature, index) => (
                  <li
                    className="flex items-center justify-between"
                    key={index}
                  >
                    <p>{feature}</p>
                    <button
                      className="group"
                      onClick={() => setFeatures(prev => prev.filter(f => f !== feature))}
                    >
                      <FaDeleteLeft
                        size={16}
                        className="wiggle"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Divider size={8} />

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
                onClick={handleSubmit(pkg ? onEditSubmit : onAddSubmit)}
              >
                {isLoading ? (
                  <FaCircleNotch
                    size={18}
                    className="trans-200 animate-spin text-slate-400"
                  />
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
