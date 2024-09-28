'use client'

import { commonEmailMistakes } from '@/constants/mistakes'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenAuthentication } from '@/libs/reducers/modalReducer'
import { updatePrivateInfoApi } from '@/requests'
import { useSession } from 'next-auth/react'
import { memo, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEyeSlash, FaSave } from 'react-icons/fa'
import { MdCancel, MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import Divider from '../Divider'
import Input from '../Input'

interface PrivateInfoProps {
  className?: string
}

function PrivateInfo({ className = '' }: PrivateInfoProps) {
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
      username: '',
      email: '',
      phone: '',
      newPassword: '',
    },
  })

  // auto fill data
  useEffect(() => {
    if (curUser?._id) {
      reset({
        username: curUser.username,
        email: curUser.email,
        phone: curUser.phone,
      })
    }
  }, [reset, curUser])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // username must be at least 5 characters
      if (data.username.length < 5) {
        setError('username', {
          type: 'manual',
          message: 'Username phải có ít nhất 5 ký tự',
        })
        isValid = false
      }

      // email must be valid
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/.test(data.email)) {
        setError('email', {
          type: 'manual',
          message: 'Email không hợp lệ',
        })
        isValid = false
      } else {
        if (commonEmailMistakes.some(mistake => data.email.toLowerCase().includes(mistake))) {
          setError('email', { message: 'Email không hợp lệ' })
          isValid = false
        }
      }

      // new password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (
        curUser?.role === 'local' &&
        data.newPassword.trim() &&
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.newPassword)
      ) {
        setError('newPassword', {
          type: 'manual',
          message: 'Mật khẩu mới phải chứa ít nhất 6 kí tự, 1 chữ thường, 1 chữ hoa và 1 chữ số',
        })
        isValid = false
      }

      return isValid
    },
    [setError, curUser?.role]
  )

  // update personal info
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setLoading(true)

      try {
        const { message } = await updatePrivateInfoApi(data)

        // notify success
        toast.success(message)

        // hide edit mode
        setEditMode(false)

        // update user session
        console.log('Session - private-info...')
        await update()
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop loading
        setLoading(false)
      }
    },
    [update, handleValidate, setLoading]
  )

  return (
    <div
      className={`relative overflow-x-scroll rounded-lg border border-dark pt-8 shadow-lg ${className}`}
    >
      <div className="absolute left-1/2 h-0.5 w-[calc(100%_-_20px)] -translate-x-1/2 bg-slate-700 text-2xl font-semibold">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-2 py-1 text-center text-sm">
          Riêng tư
        </span>
      </div>

      <Divider size={6} />

      <div className="relative grid grid-cols-3 gap-21 p-5">
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Tên người dùng</p>
              <p>{getValues('username') || <span className="text-sm text-slate-500">Trống</span>}</p>
            </>
          ) : (
            <Input
              id="username"
              label="Tên người dùng"
              disabled={false}
              register={register}
              errors={errors}
              required
              type="username"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('username')}
            />
          )}
        </div>
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Email</p>
              <p>{getValues('email') || <span className="text-sm text-slate-500">Trống</span>}</p>
            </>
          ) : (
            <Input
              id="email"
              label="Email"
              disabled={false}
              register={register}
              errors={errors}
              required
              type="email"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('email')}
            />
          )}
        </div>
        <div className="col-span-3 md:col-span-1">
          {!editMode ? (
            <>
              <p className="text-slate-600">Số điện thoại</p>
              <p>{getValues('phone') || <span className="text-sm text-slate-500">Trống</span>}</p>
            </>
          ) : (
            <Input
              id="phone"
              label="Số điện thoại"
              disabled={false}
              register={register}
              errors={errors}
              type="number"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('phone')}
            />
          )}
        </div>
        {curUser?.authType === 'local' && (
          <div className="col-span-3 md:col-span-1">
            {!editMode ? (
              <>
                <p className="text-slate-600">Mật khẩu</p>
                <p>*********</p>
              </>
            ) : (
              <Input
                id="newPassword"
                label="Đổi mật khẩu"
                disabled={false}
                register={register}
                errors={errors}
                icon={FaEyeSlash}
                type="password"
                labelBg="bg-white"
                className="mt-3 min-w-[40%]"
                onFocus={() => clearErrors('newPassword')}
              />
            )}
          </div>
        )}

        <div className="col-span-full flex items-center justify-center gap-2">
          {!editMode ? (
            <button
              className="trans-2000 flex items-center justify-center gap-1 rounded-lg border border-dark bg-slate-200 px-2 py-1 shadow-lg hover:bg-white"
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
                className={`trans-200 flex items-center justify-center gap-1 rounded-lg border border-dark bg-slate-200 px-2 py-1 shadow-lg hover:bg-white ${
                  loading ? 'pointer-events-none' : 'cursor-pointer'
                }`}
                onClick={() => setEditMode(false)}
              >
                <MdCancel size={18} />
                <span className="font-semibold">Hủy</span>
              </button>

              <button
                className={`trans-200 group flex items-center justify-center gap-1 rounded-lg border border-dark bg-slate-200 px-2 py-1 shadow-lg hover:bg-white ${
                  loading ? 'pointer-events-none' : 'cursor-pointer'
                }`}
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

export default memo(PrivateInfo)
