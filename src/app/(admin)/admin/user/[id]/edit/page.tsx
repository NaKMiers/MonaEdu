'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading, setPageLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { editUserApi, getUserApi, revokeCourseApi } from '@/requests'
import { getTimeRemaining } from '@/utils/time'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendarAlt, FaDollarSign, FaPhone, FaUser } from 'react-icons/fa'
import { GoSingleSelect } from 'react-icons/go'
import { IoText } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'

function EditUserPage({ params: { id } }: { params: { id: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const router = useRouter()

  // states
  const [user, setUser] = useState<IUser | null>(null)
  const [revokingCourse, setRevokingCourse] = useState<string>('')

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      username: user?.username,
      nickname: user?.nickname,
      email: user?.email,
      phone: user?.phone,
      bio: user?.bio,
      authType: user?.authType,
      firstName: user?.firstName,
      lastName: user?.lastName,
      birthday: user?.birthday,
      gender: user?.gender,
      address: user?.address,
      job: user?.job,
      expended: user?.expended,
      commission: user?.commission,
    },
  })

  // MARK: Get Data
  // get user to edit
  useEffect(() => {
    const getUser = async () => {
      // star page loading
      dispatch(setPageLoading(true))

      try {
        const { user } = await getUserApi(id) // no-cache

        console.log('user', user)

        // set user to state
        setUser(user)

        // set value to form
        setValue('username', user.username)
        setValue('nickname', user.nickname)
        setValue('email', user.email)
        setValue('phone', user.phone)
        setValue('bio', user.bio)
        setValue('authType', user.authType)
        setValue('firstName', user.firstName)
        setValue('lastName', user.lastName)
        setValue('birthday', moment(user.birthday).format('YYYY-MM-DD'))
        setValue('gender', user.gender)
        setValue('address', user.address)
        setValue('job', user.job)
        setValue('expended', user.expended)
        setValue('commission', user.commission)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getUser()
  }, [dispatch, id, setValue])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // check if user is not found
      if (!user) {
        toast.error('User not found')
        return false
      }

      // only update if there is any change
      let countChanges: number = 0

      if (data.username !== user.username) countChanges++
      if (data.nickname !== user.nickname) countChanges++
      if (data.email !== user.email) countChanges++
      if (data.phone !== user.phone) countChanges++
      if (data.bio !== user.bio) countChanges++
      if (data.authType !== user.authType) countChanges++
      if (data.firstName !== user.firstName) countChanges++
      if (data.lastName !== user.lastName) countChanges++
      if (data.birthday !== moment(user.birthday).format('YYYY-MM-DD')) countChanges++
      if (data.gender !== user.gender) countChanges++
      if (data.address !== user.address) countChanges++
      if (data.job !== user.job) countChanges++
      if (data.expended !== user.expended) countChanges++
      if (data.commission.type !== user.commission?.type) countChanges++
      if (data.commission.value !== user.commission?.value) countChanges++

      if (countChanges === 0) {
        toast.error('No changes to update')
        return false
      }

      return isValid
    },
    [user]
  )

  // MARK: Submit
  // send request to server to edit account
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    // validate form
    if (!handleValidate(data)) return

    // start loading
    dispatch(setLoading(true))

    try {
      const { message } = await editUserApi(id, data)

      // show success message
      toast.success(message)

      // reset form
      reset()
      dispatch(setPageLoading(false))

      // redirect back
      router.back()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      dispatch(setLoading(false))
    }
  }

  // MARK: handle revoke user course
  const handleRevokeCourse = useCallback(
    async (courseId: string) => {
      if (!user) return

      // start loading
      setRevokingCourse(courseId)

      try {
        // send request to revoke course
        const { message } = await revokeCourseApi(user._id, courseId)

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setRevokingCourse('')
      }
    },
    [user]
  )

  return (
    <div className="mx-auto max-w-1200">
      {/* MARK: Admin Header */}
      <AdminHeader
        title="Edit User"
        backLink="/admin/user/all"
      />

      <div className="mt-5">
        <div className="flex flex-col items-start gap-21 md:flex-row">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="aspect-square w-full max-w-[100px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={user?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                height={200}
                width={200}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>

            {user?.role && (
              <div className="absolute -top-2 left-1/2 z-30 -translate-x-1/2 rounded-md bg-secondary px-1.5 py-[2px] font-body text-xs text-yellow-300 shadow-md">
                {user.role}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex w-full flex-col gap-2">
            {/* Package */}
            {user?.package && (
              <div className="mb-3 flex items-center gap-2">
                <p className="text-nowrap rounded-3xl border border-neutral-800 bg-neutral-950 px-4 py-1 text-center font-semibold text-light shadow-lg shadow-primary">
                  {user.package.title}
                </p>
                <Divider size={2} />
                {user.package.credit && (
                  <p className="text-sm font-semibold">
                    Còn lại: <span className="text-violet-800">{user.package.credit} credits</span>
                  </p>
                )}
                {user.package.expire &&
                  (new Date(user.package.expire) > new Date() ? (
                    <p className="text-sm font-semibold">
                      Còn lại:{' '}
                      <span className={`text-violet-800 underline`}>
                        {getTimeRemaining(user.package.expire).toString()}
                      </span>
                    </p>
                  ) : (
                    <p className="text-right text-sm font-semibold text-slate-500">Đã hết hạn.</p>
                  ))}
              </div>
            )}

            {/* Names & Auth Type */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <Input
                id="firstName"
                label="First Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="text"
                icon={IoText}
                onFocus={() => clearErrors('firstName')}
              />
              <Input
                id="lastName"
                label="Last Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="text"
                icon={IoText}
                onFocus={() => clearErrors('lastName')}
              />
              <Input
                id="nickname"
                label="Nickname"
                disabled={isLoading}
                register={register}
                errors={errors}
                required={!!user?.nickname}
                type="text"
                icon={FaUser}
                onFocus={() => clearErrors('nickname')}
              />
              <Input
                id="authType"
                label="Auth Type"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="select"
                options={[
                  { value: 'local', label: 'Local' },
                  { value: 'google', label: 'Google' },
                  { value: 'github', label: 'Github' },
                ]}
                icon={GoSingleSelect}
                onFocus={() => clearErrors('authType')}
              />
            </div>

            {/* Unique Info */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                id="username"
                label="Username"
                disabled={isLoading}
                register={register}
                errors={errors}
                required={!!user?.username}
                type="text"
                icon={FaUser}
                onFocus={() => clearErrors('username')}
              />

              <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="email"
                icon={MdEmail}
                onFocus={() => clearErrors('email')}
              />
              <Input
                id="phone"
                label="Phone"
                disabled={isLoading}
                register={register}
                errors={errors}
                required={!!user?.phone}
                type="text"
                icon={FaPhone}
                onFocus={() => clearErrors('phone')}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid w-full grid-cols-1 gap-2 md:grid-cols-3">
          <Input
            id="expended"
            label="Expended"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            icon={FaDollarSign}
            onFocus={() => clearErrors('expended')}
          />
          <Input
            id="commission.type"
            label="Commission"
            disabled={isLoading}
            register={register}
            errors={errors}
            required={!!user?.commission}
            type="select"
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'fixed', label: 'Fixed' },
            ]}
            icon={GoSingleSelect}
            onFocus={() => clearErrors('commission.type')}
          />
          <Input
            id="commission.value"
            label="Commission"
            disabled={isLoading}
            register={register}
            errors={errors}
            required={!!user?.commission}
            type="text"
            icon={FaDollarSign}
            onFocus={() => clearErrors('commission.value')}
          />
        </div>

        <div className="mt-5 grid w-full grid-cols-1 gap-2 md:grid-cols-3">
          <Input
            id="birthday"
            label="Birthday"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="date"
            icon={FaCalendarAlt}
            onFocus={() => clearErrors('birthday')}
          />
          <Input
            id="job"
            label="Job"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="text"
            icon={IoText}
            onFocus={() => clearErrors('job')}
          />
          <Input
            id="gender"
            label="Gender"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="select"
            options={[
              {
                value: 'male',
                label: 'Male',
              },
              {
                value: 'female',
                label: 'Female',
              },
            ]}
            icon={IoText}
            onFocus={() => clearErrors('gender')}
          />
          <Input
            id="address"
            label="Address"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="text"
            icon={IoText}
            onFocus={() => clearErrors('address')}
            className="md:col-span-3"
          />
        </div>

        <Input
          id="bio"
          label="Bio"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="textarea"
          rows={3}
          icon={IoText}
          onFocus={() => clearErrors('bio')}
          className="mt-3"
        />

        {/* Courses */}
        {user && user.courses.length > 0 ? (
          <div className="mt-5 flex flex-col gap-1 rounded-lg border-2 border-light bg-white p-2 font-body text-sm tracking-wider text-dark">
            {user.courses.map((item: any, index) => (
              <div
                className="flex items-center gap-2"
                key={index}
              >
                <Link
                  href={`/${item.course.slug}`}
                  className="trans-200 flex w-full items-center gap-2 hover:text-sky-500"
                >
                  <span className="border-dark-100 min-w-6 rounded-full border border-e-slate-500 border-s-slate-500 px-0.5 text-center text-[10px]">
                    {index + 1}
                  </span>
                  <span>{item.course.title}</span> -{' '}
                  <span className="font-semibold text-orange-500">{item.progress}%</span>
                </Link>
                <button
                  className={`trans-200 flex min-h-5 min-w-8 items-center justify-center rounded-md border border-rose-400 px-1.5 text-[10px] text-rose-400 !no-underline shadow-lg hover:bg-red-400 hover:text-light ${revokingCourse ? 'pointer-events-none flex justify-center' : ''}`}
                  disabled={revokingCourse === item.course._id}
                  onClick={() => handleRevokeCourse(item.course._id)}
                >
                  {revokingCourse === item.course._id ? (
                    <RiDonutChartFill
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    'Revoke'
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-center font-semibold italic text-slate-400">User courses is empty.</p>
        )}

        {/* Save Button */}
        <LoadingButton
          className="trans-200 mt-6 rounded-lg bg-secondary px-4 py-2 font-semibold text-white hover:bg-primary"
          onClick={handleSubmit(onSubmit)}
          text="Save"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default EditUserPage
