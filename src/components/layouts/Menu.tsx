'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenActivateCourse } from '@/libs/reducers/modalReducer'
import { checkCrown, checkPackageType, getUserName } from '@/utils/string'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface MenuProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

function Menu({ open, setOpen, className = '' }: MenuProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // reducer
  const cartLength = useAppSelector(state => state.cart.items.length)

  // refs
  const menuRef = useRef<HTMLDivElement>(null)

  // values
  let isShowCrown = checkCrown(curUser?.package)

  // handle open transition
  useEffect(() => {
    if (!menuRef.current) return

    if (open) {
      menuRef.current.classList.remove('hidden')
      setTimeout(() => {
        menuRef.current?.classList.remove('opacity-0')
        menuRef.current?.classList.add('opacity-100')
      }, 0)
    } else {
      menuRef.current.classList.remove('opacity-100')
      menuRef.current?.classList.add('opacity-0')
      setTimeout(() => {
        if (!menuRef.current) return
        menuRef.current.classList.add('hidden')
      }, 300)
    }
  }, [open])

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
        } fixed bottom-0 left-0 right-0 top-0 z-30 h-screen w-screen ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <div
        className={`max-h-360 hidden max-h-[405px] p-2 opacity-0 sm:max-h-[405px] sm:w-[300px] sm:max-w-full sm:border-2 ${
          curUser && !curUser?._id ? 'hidden' : ''
        } trans-300 absolute bottom-[72px] right-0 z-30 w-full overflow-hidden rounded-t-xl border-light bg-dark-100 text-light shadow-md shadow-primary sm:right-21 sm:rounded-xl md:bottom-auto md:top-[60px]`}
        ref={menuRef}
      >
        {curUser ? (
          // MARK: User Logged In
          curUser?._id && (
            <>
              <Link
                href={`/user/${curUser?.username || curUser?.email}`}
                className="trans-200 group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
              >
                <div className="relative">
                  {isShowCrown && (
                    <Image
                      className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
                      src="/icons/ring-circle.png"
                      width={40}
                      height={40}
                      alt="ring"
                    />
                  )}
                  <Image
                    className={`wiggle-0 relative z-10 aspect-square rounded-full shadow-lg ${
                      isShowCrown ? 'p-1' : ''
                    }`}
                    src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                    height={40}
                    width={40}
                    alt="avatar"
                  />
                  {isShowCrown && (
                    <Image
                      className="absolute -top-[11px] right-[3px] z-20 rotate-[18deg]"
                      src="/icons/crown-icon-2.png"
                      width={24}
                      height={24}
                      alt="crown"
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="mb-1 line-clamp-1 text-ellipsis text-xl font-semibold leading-6">
                    {getUserName(curUser)}
                  </p>
                  {curUser.username && <p className="text-xs">@{curUser.username}</p>}
                </div>
              </Link>

              <div
                className="group relative"
                onClick={() => setOpen(false)}
              >
                <Link
                  href={`/cart`}
                  className="trans-200 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                >
                  <Image
                    src="/icons/cart-icon.png"
                    className="wiggle"
                    width={30}
                    height={30}
                    alt="cart"
                  />
                  <span className="font-body text-xl font-semibold tracking-wide">Giỏ hàng</span>
                  {!!cartLength && (
                    <span className="absolute right-2 top-1/2 flex h-[20px] -translate-y-1/2 items-center justify-center rounded-full bg-primary px-[7px] text-[10px] font-bold text-dark">
                      {cartLength}
                    </span>
                  )}
                </Link>
              </div>

              <div
                className="group"
                onClick={() => setOpen(false)}
              >
                <Link
                  href={`/my-courses`}
                  className="trans-200 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                >
                  <Image
                    src="/icons/my-courses-icon.png"
                    className="wiggle"
                    width={30}
                    height={30}
                    alt="my-courses"
                  />
                  <span className="font-body text-xl font-semibold tracking-wide">Khóa học của tôi</span>
                </Link>
              </div>
              <div
                className="group"
                onClick={() => setOpen(false)}
              >
                <Link
                  href={`/subscription`}
                  className="trans-200 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                >
                  <Image
                    src="/icons/crown-icon.png"
                    className="wiggle"
                    width={30}
                    height={30}
                    alt="subscription"
                  />
                  {curUser?.package ? (
                    <p className="inline-block rounded-3xl border border-slate-300 bg-neutral-950 px-4 py-1 text-center font-semibold shadow-sm">
                      <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        {checkPackageType(curUser.package.credit, curUser.package.type) === 'credit' ? (
                          <span>
                            {curUser.package.title}{' '}
                            <span className="text-sm text-slate-500">
                              ({curUser.package.credit} credit{curUser.package.credit === 1 ? '' : 's'})
                            </span>
                          </span>
                        ) : (
                          curUser.package.title
                        )}
                      </span>
                    </p>
                  ) : (
                    <span className="font-body text-xl font-semibold tracking-wide">Gói học viên</span>
                  )}
                </Link>
              </div>
              <button
                className="group"
                onClick={() => {
                  if (!curUser) {
                    setOpen(false)
                    toast.error('Vui lòng đăng nhập để kích hoạt khóa học')
                    return
                  }
                  setOpen(false)
                  dispatch(setOpenActivateCourse(true))
                }}
              >
                <div className="trans-200 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark">
                  <Image
                    src="/icons/activate-courses-icon.png"
                    className="wiggle"
                    width={30}
                    height={30}
                    alt="activate-courses"
                  />
                  <span className="font-body text-xl font-semibold tracking-wide">
                    Kích hoạt khóa học
                  </span>
                </div>
              </button>
              <div
                className="group"
                onClick={() => setOpen(false)}
              >
                <Link
                  href="/setting"
                  className="trans-200 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                >
                  <Image
                    src="/icons/setting-icon.png"
                    className="wiggle"
                    width={30}
                    height={30}
                    alt="setting"
                  />
                  <span className="font-body text-xl font-semibold tracking-wide">Cài đặt</span>
                </Link>
              </div>

              <div
                className="group"
                onClick={() => setOpen(false)}
              >
                <button
                  className="trans-200 flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                  onClick={() => signOut()}
                >
                  <Image
                    src="/icons/logout-icon.png"
                    className="wiggle"
                    width={30}
                    height={30}
                    alt="logout"
                  />
                  <span className="font-body text-xl font-semibold tracking-wide">Đăng xuất</span>
                </button>
              </div>

              {['admin', 'editor'].includes(curUser?.role) && (
                <div
                  className="no-scrollbar items-center5 flex gap-0.5 overflow-x-auto"
                  onClick={() => setOpen(false)}
                >
                  <Link
                    href="/admin"
                    className="trans-200 group flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                  >
                    <Image
                      src="/icons/dashboard-icon.png"
                      className="wiggle"
                      width={30}
                      height={30}
                      alt="order"
                    />
                  </Link>
                  <Link
                    href="/admin/order/all"
                    className="trans-200 group flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                  >
                    <Image
                      src="/icons/order-icon.png"
                      className="wiggle"
                      width={30}
                      height={30}
                      alt="order"
                    />
                  </Link>
                  <Link
                    href="/admin/course/all"
                    className="trans-200 group flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                  >
                    <Image
                      src="/icons/course-icon.png"
                      className="wiggle"
                      width={30}
                      height={30}
                      alt="order"
                    />
                  </Link>
                  <Link
                    href="/admin/user/all"
                    className="trans-200 group flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                  >
                    <Image
                      src="/icons/user-icon.png"
                      className="wiggle"
                      width={30}
                      height={30}
                      alt="order"
                    />
                  </Link>
                  <Link
                    href="/admin/voucher/all"
                    className="trans-200 group flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                  >
                    <Image
                      src="/icons/voucher-icon.png"
                      className="wiggle"
                      width={30}
                      height={30}
                      alt="order"
                    />
                  </Link>
                </div>
              )}

              {['collaborator'].includes(curUser?.role) && (
                <div
                  className="flex items-center gap-2 overflow-x-auto"
                  onClick={() => setOpen(false)}
                >
                  <Link
                    href="/admin/summary/all"
                    className="trans-200 group flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
                  >
                    <Image
                      src="/icons/collaborator-icon.png"
                      className="wiggle"
                      width={30}
                      height={30}
                      alt="order"
                    />
                  </Link>
                </div>
              )}
            </>
          )
        ) : (
          // MARK: User Not Logged In
          <>
            <div
              className="group"
              onClick={() => setOpen(false)}
            >
              <Link
                href="/auth/login"
                className="trans-200 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
              >
                <Image
                  src="/icons/sign-in-icon.png"
                  className="wiggle"
                  width={30}
                  height={30}
                  alt="sign-in"
                />
                <span className="font-body text-xl font-semibold tracking-wide">Đăng nhập</span>
              </Link>
            </div>
            <div
              className="group"
              onClick={() => setOpen(false)}
            >
              <Link
                href="/categories"
                className="trans-200 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:text-dark"
              >
                <Image
                  src="/icons/category.png"
                  className="wiggle"
                  width={30}
                  height={30}
                  alt="categories"
                />
                <span className="font-body text-xl font-semibold tracking-wide">Danh Mục</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default memo(Menu)
