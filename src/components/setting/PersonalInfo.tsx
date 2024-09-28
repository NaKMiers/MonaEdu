'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenAuthentication } from '@/libs/reducers/modalReducer'
import { updatePersonalInfoApi } from '@/requests'
import { useSession } from 'next-auth/react'
import { memo, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSave } from 'react-icons/fa'
import { MdCancel, MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import Divider from '../Divider'
import Input from '../Input'

interface PersonalInfoProps {
  className?: string
}

function PersonalInfo({ className = '' }: PersonalInfoProps) {
  // hook
  const dispatch = useAppDispatch()
  const { data: session, update } = useSession()
  const authenticated = useAppSelector(state => state.modal.authenticated)
  const curUser: any = session?.user

  // states
  const [editMode, setEditMode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      birthday: '',
      job: '',
      gender: '',
      bio: '',
    },
  })

  // auto fill data
  useEffect(() => {
    if (curUser?._id) {
      reset({
        firstName: curUser.firstName,
        lastName: curUser.lastName,
        birthday: curUser.birthday ? new Date(curUser.birthday).toISOString().split('T')[0] : '',
        job: curUser.job,
        bio: curUser.bio,
        gender: curUser.gender,
      })
    }
  }, [reset, curUser])

  // update personal info
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setLoading(true)

      try {
        const { message } = await updatePersonalInfoApi(data)

        // notify success
        toast.success(message)

        // hide edit mode
        setEditMode(false)

        // update user session
        console.log('Session - personal-info...')
        await update()
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop loading
        setLoading(false)
      }
    },
    [update]
  )

  return (
    <div className={`relative rounded-lg border border-dark pt-8 shadow-lg ${className}`}>
      <div className="absolute left-1/2 h-0.5 w-[calc(100%_-_20px)] -translate-x-1/2 bg-slate-700 text-2xl font-semibold">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-2 py-1 text-center text-sm">
          Cá nhân
        </span>
      </div>

      <Divider size={6} />

      <div className="relative grid grid-cols-3 gap-21 p-5">
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Họ</p>
              <p>{getValues('lastName') || <span className="text-sm text-slate-500">Trống</span>}</p>
            </>
          ) : (
            <Input
              id="lastName"
              label="Họ"
              disabled={loading}
              register={register}
              errors={errors}
              type="text"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('lastName')}
            />
          )}
        </div>
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Tên</p>
              <p>{getValues('firstName') || <span className="text-sm text-slate-500">Trống</span>}</p>
            </>
          ) : (
            <Input
              id="firstName"
              label="Tên"
              disabled={loading}
              register={register}
              errors={errors}
              type="text"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('firstName')}
            />
          )}
        </div>
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Ngày sinh</p>
              <p>
                {(getValues('birthday') &&
                  new Date(getValues('birthday')).toISOString().split('T')[0]) || (
                  <span className="text-sm text-slate-500">Trống</span>
                )}
              </p>
            </>
          ) : (
            <Input
              id="birthday"
              label="Ngày sinh"
              disabled={loading}
              register={register}
              errors={errors}
              min={new Date('01/01/1910').toISOString().split('T')[0]}
              max={new Date().toISOString().split('T')[0]}
              type="date"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('birthday')}
            />
          )}
        </div>
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Giới tính</p>
              <p>
                {getValues('gender') === 'male'
                  ? 'Nam'
                  : getValues('gender') === 'female'
                    ? 'Nữ'
                    : 'Khác' || <span className="text-sm text-slate-500">Trống</span>}
              </p>
            </>
          ) : (
            <Input
              id="gender"
              label="Giới tính"
              disabled={loading}
              register={register}
              errors={errors}
              type="select"
              options={[
                {
                  value: 'male',
                  label: 'Nam',
                },
                {
                  value: 'female',
                  label: 'Nữ',
                },
                {
                  value: 'Other',
                  label: 'Khác',
                },
              ]}
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('gender')}
            />
          )}
        </div>
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Giới thiệu</p>
              <p>{getValues('bio') || <span className="text-sm text-slate-500">Trống</span>}</p>
            </>
          ) : (
            <Input
              id="bio"
              label="Giới thiệu"
              disabled={loading}
              register={register}
              errors={errors}
              type="textarea"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('bio')}
            />
          )}
        </div>
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Công việc</p>
              <p>{getValues('job') || <span className="text-sm text-slate-500">Trống</span>}</p>
            </>
          ) : (
            <Input
              id="job"
              label="Công việc"
              disabled={loading}
              register={register}
              errors={errors}
              type="text"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('job')}
            />
          )}
        </div>

        <div className="col-span-full flex items-center justify-center gap-2">
          {!editMode ? (
            <button
              className="trans-200 flex items-center justify-center gap-1 rounded-lg border border-dark bg-slate-200 px-2 py-1 shadow-lg hover:bg-white"
              onClick={() =>
                curUser?.authType === 'local'
                  ? !authenticated
                    ? dispatch(setOpenAuthentication(true))
                    : setEditMode(true)
                  : setEditMode(true)
              }
            >
              <MdEdit size={18} />
              <span className="font-semibold">Chỉnh sửa</span>
            </button>
          ) : (
            <>
              <button
                className="trans-200 flex items-center justify-center gap-1 rounded-lg border border-dark bg-slate-200 px-2 py-1 shadow-lg hover:bg-white"
                onClick={() => setEditMode(false)}
              >
                <MdCancel size={18} />
                <span className="font-semibold">Hủy</span>
              </button>

              <button
                className="trans-200 group flex items-center justify-center gap-1 rounded-lg border border-dark bg-slate-200 px-2 py-1 shadow-lg hover:bg-white"
                onClick={handleSubmit(onSubmit)}
              >
                {loading ? (
                  <RiDonutChartFill
                    size={23}
                    className="animate-spin text-slate-400"
                  />
                ) : (
                  <>
                    <FaSave
                      size={16}
                      className="wiggle"
                    />
                    <span className="font-semibold">Lưu</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(PersonalInfo)
