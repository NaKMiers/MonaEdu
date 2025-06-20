'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { addVoucherApi, getRoleUsersApi } from '@/requests'
import { generateRandomString } from '@/utils/generate'
import { toUTC } from '@/utils/time'
import moment from 'moment-timezone'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowCircleLeft, FaMinus, FaQuoteRight, FaUserEdit, FaWindowMaximize } from 'react-icons/fa'
import { FaPause, FaPlay } from 'react-icons/fa6'

import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine, RiCheckboxMultipleBlankLine } from 'react-icons/ri'

function AddVoucherPage() {
  // store
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const [roleUsers, setRoleUsers] = useState<IUser[]>([])

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      code: generateRandomString(5),
      description: '',
      // default begin is today
      begin: moment().format('YYYY-MM-DDTHH:mm'),
      expire: '',
      minTotal: 0,
      maxReduce: '',
      type: 'fixed-reduce',
      value: '',
      timesLeft: 1,
      owner: '',
      active: true,
    },
  })

  // MARK: Get Data
  // get roleUsers, admins, editors
  useEffect(() => {
    const getRoleUsers = async () => {
      try {
        // send request to server to get role-users
        const { roleUsers } = await getRoleUsersApi() // cache: no-store

        // set roleUsers to state
        setRoleUsers(roleUsers)
        setValue('owner', roleUsers.find((user: IUser) => user.role === 'admin')._id)
      } catch (err: any) {
        console.log(err)
      }
    }
    getRoleUsers()
  }, [setValue])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true
      // code >= 5
      if (data.code.length < 5) {
        setError('code', {
          type: 'manual',
          message: 'Code must be at least 5 characters',
        })
        isValid = false
      } else {
        // code < 10
        if (data.code.length > 10) {
          setError('code', {
            type: 'manual',
            message: 'Code must be at most 10 characters',
          })
          isValid = false
        }
      }

      // begin < expire when expire is not empty
      if (data.expire && data.begin > data.expire) {
        setError('expire', {
          type: 'manual',
          message: 'Expire must be greater than begin',
        })
        isValid = false
      }

      // minTotal >= 0
      if (+data.minTotal < 0) {
        setError('minTotal', {
          type: 'manual',
          message: 'Min total must be >= 0',
        })
        isValid = false
      }

      // maxReduce >= 0
      if (+data.maxReduce < 0) {
        setError('maxReduce', {
          type: 'manual',
          message: 'Max reduce must be >= 0',
        })
        isValid = false
      }

      // timesLeft >= 0
      if (+data.timesLeft < 0) {
        setError('timesLeft', {
          type: 'manual',
          message: 'Times left must be >= 0',
        })
        isValid = false
      }

      // value < maxReduce
      if (+data.value > +data.maxReduce) {
        setError('value', {
          type: 'manual',
          message: 'Value must be <= max reduce',
        })
        isValid = false
      }

      // if type if percentage, value must have % at the end
      if (data.type === 'percentage') {
        if (!data.value.endsWith('%')) {
          setError('value', { type: 'manual', message: 'Value must have %' })
          isValid = false
        }
      } else {
        // if type is fixed, value must be number
        if (isNaN(+data.value)) {
          setError('value', { type: 'manual', message: 'Value must be a number' })
          isValid = false
        }
      }

      return isValid
    },
    [setError]
  )

  // MARK: Submit
  // handle send request to server to add voucher
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      dispatch(setLoading(true))

      try {
        // send request to server to add voucher
        const { message } = await addVoucherApi({
          ...data,
          begin: toUTC(data.begin),
          expire: data.expire ? toUTC(data.expire) : '',
        })

        // show success message
        toast.success(message)
        // reset form
        reset()
        setValue('code', generateRandomString(5))
        const adminUser = roleUsers.find((user: IUser) => user.role === 'admin')
        if (adminUser) {
          setValue('onwer', adminUser._id)
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [handleValidate, reset, dispatch, setValue, roleUsers]
  )

  // Enter key to submit
  useEffect(() => {
    // page title
    document.title = 'Add Voucher - Mona Edu'

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit(onSubmit)()
    }

    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [handleSubmit, onSubmit])

  return (
    <div className="mx-auto max-w-1200">
      {/* MARK: Admin Header */}
      <AdminHeader
        title="Add Voucher"
        backLink="/admin/voucher/all"
      />
      <div className="mt-5 rounded-lg bg-slate-200 p-3">
        <div className="b-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Code */}
          <Input
            id="code"
            label="Code"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="text"
            icon={RiCharacterRecognitionLine}
            onFocus={() => clearErrors('code')}
          />

          {/* Owner */}
          <Input
            id="owner"
            label="Owner"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="select"
            onFocus={() => clearErrors('owner')}
            options={roleUsers.map(user => ({
              value: user._id,
              label: `${user.firstName} ${user.lastName} - (${
                user.role.charAt(0).toUpperCase() + user.role.slice(1)
              })`,
              selected: user.role === 'admin',
            }))}
            icon={FaUserEdit}
            className="mb-5"
          />
        </div>

        {/* Description */}
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="textarea"
          icon={FaQuoteRight}
          className="mb-5"
          onFocus={() => clearErrors('description')}
        />

        {/* MARK: Begin - End */}
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Begin */}
          <Input
            id="begin"
            label="Begin"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="datetime-local"
            min={moment().format('YYYY-MM-DDTHH:mm')}
            icon={FaPlay}
            onFocus={() => clearErrors('begin')}
          />

          {/* Expire */}
          <Input
            id="expire"
            label="Expire"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="datetime-local"
            icon={FaPause}
            onFocus={() => clearErrors('expire')}
          />
        </div>

        {/* MARK: Min - Max */}
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Min Total */}
          <Input
            id="minTotal"
            label="Min Total"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            icon={FaMinus}
            onFocus={() => clearErrors('minTotal')}
          />

          {/* Max Reduce */}
          <Input
            id="maxReduce"
            label="Max Reduce"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            icon={FaWindowMaximize}
            onFocus={() => clearErrors('maxReduce')}
          />
        </div>

        {/* MARK: Type - Value */}
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Type */}
          <Input
            id="type"
            label="Type"
            disabled={isLoading}
            register={register}
            errors={errors}
            icon={RiCheckboxMultipleBlankLine}
            type="select"
            onFocus={() => clearErrors('type')}
            options={[
              {
                value: 'fixed-reduce',
                label: 'Fixed Reduce',
                selected: true,
              },
              {
                value: 'percentage',
                label: 'Percentage',
              },
              {
                value: 'fixed',
                label: 'Fixed',
              },
            ]}
          />

          {/* Value */}
          <Input
            id="value"
            label="Value"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="text"
            icon={MdNumbers}
            onFocus={() => clearErrors('value')}
          />
        </div>

        {/* Times Left */}
        <Input
          id="timesLeft"
          label="Times Left"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="number"
          icon={FaArrowCircleLeft}
          className="mb-5"
          onFocus={() => clearErrors('timesLeft')}
        />

        {/* Active */}
        <div className="flex">
          <div className="flex items-center rounded-lg bg-white px-3">
            <FaPlay
              size={16}
              className="text-secondary"
            />
          </div>
          <input
            className="peer"
            type="checkbox"
            id="active"
            hidden
            {...register('active', { required: false })}
          />
          <label
            className="trans-200 cursor-pointer select-none rounded-lg border border-green-500 bg-white px-4 py-2 text-green-500 peer-checked:bg-green-500 peer-checked:text-light"
            htmlFor="active"
          >
            Active
          </label>
        </div>

        {/* MARK: Add Butoton */}
        <LoadingButton
          className="trans-200 mt-4 rounded-lg bg-secondary px-4 py-2 font-semibold text-light hover:bg-primary"
          onClick={handleSubmit(onSubmit)}
          text="Add"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddVoucherPage
