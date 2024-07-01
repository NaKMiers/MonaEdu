'use client'

import { useAppSelector } from '@/libs/hooks'
import { getSession, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface MenuProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

function Menu({ open, setOpen, className = '' }: MenuProps) {
  // hooks
  const { data: session } = useSession()

  // reducer
  const cartLength = useAppSelector(state => state.cart.items.length)

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || {})

  // update user session
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession()
      setCurUser(session?.user)
    }

    if (!curUser?._id) {
      getUser()
    }
  }, [curUser])

  // key board event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // clean up
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])

  return (
    <>
      {/* MARK: Overlay */}
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <div
        className={`${
          open
            ? 'max-h-[358px] sm:max-w-full sm:w-[300px] sm:max-h-[358px] p-2 sm:border-2 opacity-1'
            : 'max-h-0 sm:max-h-0 p-0 border-0 sm:max-w-0 sm:w-0 opacity-0'
        } ${
          curUser && !curUser?._id ? 'hidden' : ''
        } rounded-t-xl bg-dark-100 border-white shadow-primary text-white w-full overflow-hidden trans-300 absolute bottom-[72px] md:bottom-auto md:top-[60px] right-0 sm:right-21 z-30 sm:rounded-xl shadow-md`}
      >
        {curUser ? (
          // MARK: User Logged In
          curUser?._id && (
            <>
              <Link
                href={`/user/${curUser?.username || curUser?.email}`}
                className='flex items-center gap-2 py-2 px-3 rounded-lg group hover:bg-white hover:text-dark trans-200'
              >
                <Image
                  className='aspect-square rounded-full wiggle-0'
                  src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                  height={40}
                  width={40}
                  alt='avatar'
                />
                <div className='flex flex-col'>
                  <p className='font-semibold text-2xl leading-6 mb-1'>
                    {curUser?.firstName && curUser?.lastName
                      ? `${curUser.firstName} ${curUser.lastName}`
                      : curUser.username}
                  </p>
                  <p className='text-xs '>{curUser.email}</p>
                </div>
              </Link>

              <div className='group relative' onClick={() => setOpen(false)}>
                <Link
                  href={`/cart`}
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                >
                  <Image
                    src='/images/cart-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='icon'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Giỏ hàng</span>
                  {!!cartLength && (
                    <span className='absolute top-1/2 -translate-y-1/2 right-2 bg-primary text-dark rounded-full text-center px-[7px] py-[2px] text-[10px] font-bold'>
                      {cartLength}
                    </span>
                  )}
                </Link>
              </div>

              <div className='group' onClick={() => setOpen(false)}>
                <Link
                  href={`/user/${curUser?.username || curUser?.email}`}
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                >
                  <Image
                    src='/images/info-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='icon'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Trang cá nhân</span>
                </Link>
              </div>
              <div className='group' onClick={() => setOpen(false)}>
                <Link
                  href={`/my-courses`}
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                >
                  <Image
                    src='/images/my-courses-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='icon'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Khóa học của tôi</span>
                </Link>
              </div>
              <div className='group' onClick={() => setOpen(false)}>
                <Link
                  href='/setting'
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                >
                  <Image
                    src='/images/setting-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='icon'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Cài đặt</span>
                </Link>
              </div>
              {curUser?.role !== 'user' && (
                <div className='group' onClick={() => setOpen(false)}>
                  <Link
                    href={
                      ['admin', 'editor'].includes(curUser?.role)
                        ? '/admin/order/all'
                        : '/admin/summary/all'
                    }
                    className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                  >
                    <Image
                      src='/images/order-icon.png'
                      className='wiggle'
                      width={30}
                      height={30}
                      alt='icon'
                    />
                    <span className='font-body text-xl font-semibold tracking-wide'>
                      {['admin', 'editor'].includes(curUser?.role) ? 'Orders' : 'Collaborator'}
                    </span>
                  </Link>
                </div>
              )}
              <div className='group' onClick={() => setOpen(false)}>
                <button
                  className='flex items-center w-full gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                  onClick={() => signOut()}
                >
                  <Image
                    src='/images/logout-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='icon'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Đăng xuất</span>
                </button>
              </div>
            </>
          )
        ) : (
          // MARK: User Not Logged In
          <>
            <div className='group' onClick={() => setOpen(false)}>
              <Link
                href='/auth/login'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
              >
                <Image
                  src='/images/sign-in-icon.png'
                  className='wiggle'
                  width={30}
                  height={30}
                  alt='icon'
                />
                <span className='font-body text-xl font-semibold tracking-wide'>Đăng nhập</span>
              </Link>
            </div>
            <div className='group' onClick={() => setOpen(false)}>
              <Link
                href='/categories'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
              >
                <Image src='/images/category.png' className='wiggle' width={30} height={30} alt='icon' />
                <span className='font-body text-xl font-semibold tracking-wide'>Danh Mục</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Menu
