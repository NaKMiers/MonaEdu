'use client'

import Divider from '@/components/Divider'
import NotificationSettings from '@/components/setting/NotificationSettings'
import PersonalInfo from '@/components/setting/PersonalInfo'
import PrivateInfo from '@/components/setting/PrivateInfo'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setAuthenticated, setOpenAuthentication } from '@/libs/reducers/modalReducer'
import { checkAuthenticationApi } from '@/requests'
import { getTimeRemaining } from '@/utils/time'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
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
    <div className='max-w-1200 mx-auto px-21'>
      <Divider size={8} />

      {/* MARK: Account Information */}
      <div className='relative flex justify-between gap-21 rounded-lg border border-dark shadow-lg p-4 overflow-x-scroll bg-slate-300 bg-opacity-95'>
        <div className='flex gap-2'>
          {curUser?.avatar && (
            <div className='flex-shrink-0 w-[50px] h-[50px] rounded-full shadow-lg overflow-hidden'>
              <Image
                src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
                width={80}
                height={80}
                alt='avatar'
              />
            </div>
          )}
          <div className='font-body tracking-wider'>
            <p className='font-semibold text-xl'>
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
          <div className='flex flex-col items-end'>
            <p className='inline-block rounded-3xl text-center border border-neutral-800 bg-neutral-950 text-light font-semibold px-4 py-1 shadow-lg'>
              {curUser.package.title}
            </p>
            <Divider size={2} />
            {curUser.package.credit !== null && (
              <p className='text-sm font-semibold'>
                Còn lại: <span className='text-violet-800'>{curUser.package.credit} credits</span>
              </p>
            )}
            {curUser.package.expire !== null && (
              <p className='text-sm font-semibold'>
                Còn lại:{' '}
                <span className={`text-violet-800 underline`}>
                  {getTimeRemaining(curUser.package.expire).toString()}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      <Divider size={8} />

      {/* MARK: Personal Information */}
      <PersonalInfo className='bg-slate-200 bg-opacity-95' />
      <Divider size={8} />

      {/* MARK: Private Information */}
      <PrivateInfo className='bg-slate-100 bg-opacity-95' />
      <Divider size={8} />

      {/* MARK: Notification Setting */}
      <NotificationSettings className='bg-slate-50 bg-opacity-95' />
      <Divider size={16} />

      {/* Check Authentication */}
      <div
        className={`${
          openAuthentication ? 'block' : 'hidden'
        } flex items-center justify-center fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50`}
        onClick={() => dispatch(setOpenAuthentication(false))}
      >
        <div
          className='flex flex-col items-center relative rounded-lg shadow-lg max-w-[500px] w-full bg-white p-21'
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className='absolute top-3 right-3 group'
            onClick={() => dispatch(setOpenAuthentication(false))}
          >
            <IoMdCloseCircleOutline size={22} className='wiggle' />
          </button>
          <p className='flex items-center justify-center gap-1'>
            <IoWarningOutline size={18} />
            <span>Hãy nhập mật khẩu</span>
          </p>

          <Divider size={4} />

          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='rounded-lg shadow-lg w-full px-4 py-1 bg-slate-200 outline-none'
            placeholder='Password...'
          />

          <Divider size={4} />

          <button
            onClick={handleCheckAuthentication}
            disabled={isCheckingAuthentication}
            className={`h-8 flex items-center justify-center rounded-lg shadow-lg px-4 py-1 text-slate-500 bg-slate-200 hover:bg-white trans-200 ${
              isCheckingAuthentication ? 'bg-slate-200 pointer-events-none' : ''
            }`}
          >
            {isCheckingAuthentication ? (
              <FaCircleNotch
                size={18}
                className='text-slate-500 group-hover:text-dark trans-200 animate-spin'
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
