'use client'

import Divider from '@/components/Divider'
import NotificationSettings from '@/components/setting/NotificationSettings'
import PersonalInfo from '@/components/setting/PersonalInfo'
import PrivateInfo from '@/components/setting/PrivateInfo'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setAuthenticated, setOpenAuthentication } from '@/libs/reducers/modalReducer'
import { checkAuthenticationApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { getTimeRemaining } from '@/utils/time'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { IoWarningOutline } from 'react-icons/io5'

function PersonalSetting() {
  // hook
  const dispatch = useAppDispatch()
  const openAuthentication = useAppSelector(state => state.modal.openAuthentication)
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  // authentication
  const [isCheckingAuthentication, setIsCheckingAuthentication] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')

  // handle check authentication
  const handleCheckAuthentication = useCallback(async () => {
    if (!password.trim()) {
      toast.error('Mật khẩu bắt buộc!')
      return
    }

    // start loading
    setIsCheckingAuthentication(true)

    try {
      // send request to server to check authentication
      const { message } = await checkAuthenticationApi(password)

      // set authenticated
      dispatch(setAuthenticated(true))

      // reset password
      setPassword('')

      // close modal
      dispatch(setOpenAuthentication(false))

      // notify success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsCheckingAuthentication(false)
    }
  }, [dispatch, password])

  // set page title
  useEffect(() => {
    document.title = 'Cài đặt - Mona Edu'
  }, [])

  return (
    <div className="mx-auto max-w-1200 px-21">
      <Divider size={8} />

      {/* MARK: Account Information */}
      <div className="relative flex justify-between gap-21 overflow-x-scroll rounded-lg border border-dark bg-slate-300 bg-opacity-95 p-4 shadow-lg">
        <div className="flex gap-2">
          {curUser?.avatar && (
            <div className="h-[50px] w-[50px] flex-shrink-0 overflow-hidden rounded-full shadow-lg">
              <Image
                src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
                width={80}
                height={80}
                alt="avatar"
              />
            </div>
          )}
          <div className="font-body tracking-wider">
            <p className="text-xl font-semibold">
              {curUser?.firstName && curUser?.lastName
                ? `${curUser.firstName} ${curUser.lastName}`
                : curUser?.username}
            </p>
            <p>{curUser?.email}</p>
            <p>{curUser?.phone}</p>
            <p>{curUser?.address}</p>
          </div>
        </div>

        {curUser.package && (
          <div className="flex flex-col items-end">
            <p className="inline-block rounded-3xl border border-neutral-800 bg-neutral-950 px-4 py-1 text-center font-semibold text-light shadow-lg">
              {curUser.package.title}
            </p>
            <Divider size={2} />
            {curUser.package.credit && (
              <p className="text-sm font-semibold">
                Còn lại: <span className="text-violet-800">{curUser.package.credit} credits</span>
              </p>
            )}
            {curUser.package.expire &&
              (new Date(curUser.package.expire) > new Date() ? (
                <p className="text-sm font-semibold">
                  Còn lại:{' '}
                  <span className={`text-violet-800 underline`}>
                    {getTimeRemaining(curUser.package.expire).toString()}
                  </span>
                </p>
              ) : (
                <p className="text-right text-sm font-semibold text-slate-500">
                  Đã hết hạn.
                  <br />
                  <Link
                    href="/subscription"
                    className="text-violet-600 underline"
                  >
                    (Gia hạn ngay)
                  </Link>
                </p>
              ))}
            {curUser.package.maxPrice && (
              <p className="text-sm font-semibold">
                Tham gia khóa học tối đa:{' '}
                <span className="text-rose-500">{formatPrice(curUser.package.maxPrice)}</span>
              </p>
            )}
            {!curUser.package.maxPrice && !curUser.package.credit && !curUser.package.expire && (
              <p className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-center text-sm font-semibold text-transparent">
                Thời hạn vĩnh viễn
              </p>
            )}
          </div>
        )}
      </div>

      <Divider size={8} />

      {/* MARK: Personal Information */}
      <PersonalInfo className="bg-slate-200 bg-opacity-95" />
      <Divider size={8} />

      {/* MARK: Private Information */}
      <PrivateInfo className="bg-slate-100 bg-opacity-95" />
      <Divider size={8} />

      {/* MARK: Notification Setting */}
      <NotificationSettings className="bg-slate-50 bg-opacity-95" />
      <Divider size={16} />

      {/* Check Authentication */}
      <div
        className={`${
          openAuthentication ? 'block' : 'hidden'
        } fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50`}
        onClick={() => dispatch(setOpenAuthentication(false))}
      >
        <div
          className="relative flex w-full max-w-[500px] flex-col items-center rounded-lg bg-white p-21 shadow-lg"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="group absolute right-3 top-3"
            onClick={() => dispatch(setOpenAuthentication(false))}
          >
            <IoMdCloseCircleOutline
              size={22}
              className="wiggle"
            />
          </button>
          <p className="flex items-center justify-center gap-1">
            <IoWarningOutline size={18} />
            <span>Hãy nhập mật khẩu</span>
          </p>

          <Divider size={4} />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-200 px-4 py-1 shadow-lg outline-none"
            placeholder="Password..."
          />

          <Divider size={4} />

          <button
            onClick={handleCheckAuthentication}
            disabled={isCheckingAuthentication}
            className={`trans-200 flex h-8 items-center justify-center rounded-lg bg-slate-200 px-4 py-1 text-slate-500 shadow-lg hover:bg-white ${
              isCheckingAuthentication ? 'pointer-events-none bg-slate-200' : ''
            }`}
          >
            {isCheckingAuthentication ? (
              <FaCircleNotch
                size={18}
                className="trans-200 animate-spin text-slate-500 group-hover:text-dark"
              />
            ) : (
              'Xác nhận'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PersonalSetting
