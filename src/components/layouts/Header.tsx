'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setCartItems } from '@/libs/reducers/cartReducer'
import { setOpenSearchBar } from '@/libs/reducers/modalReducer'
import { INotification } from '@/models/NotificationModel'
import { getCartApi, getUserNotificationsApi } from '@/requests'
import { checkCrown } from '@/utils/string'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BiSolidCategory } from 'react-icons/bi'
import { FaBell, FaSearch, FaShoppingCart } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa6'
import NotificationMenu from '../NotificationMenu'
import CategoryTabs from './CategoryTabs'
import Menu from './Menu'
import SearchBar from './SearchBar'

interface HeaderProps {
  className?: string
}

function Header({ className = '' }: HeaderProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const pathname = usePathname()

  // reducer
  const cartLength = useAppSelector(state => state.cart.items.length)

  // states
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [isTransparent, setIsTransparent] = useState<boolean>(pathname === '/')
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const [openCategoryTabs, setOpenCategoryTabs] = useState<boolean>(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [openAds, setOpenAds] = useState<boolean>(true)

  // notification states
  const [isOpenNotificationMenu, setIsOpenNotificationMenu] = useState<boolean>(false)

  // values
  const isShowCrown = checkCrown(curUser?.package)

  // get user's cart
  useEffect(() => {
    const getUserCart = async () => {
      try {
        // send request to get user's cart
        const { cart } = await getCartApi() // cache: no-store

        // set cart to state
        dispatch(setCartItems(cart))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    if (curUser?._id) {
      getUserCart()
    }
  }, [dispatch, curUser?._id])

  // get user's notifications
  useEffect(() => {
    const getUserNotifications = async () => {
      try {
        console.log('Getting user notifications...')
        // send request to get user's notifications
        const { notifications } = await getUserNotificationsApi() // cache: no-store

        // set notifications
        setNotifications(notifications)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    if (curUser?._id) {
      getUserNotifications()
    }
  }, [curUser?._id])

  // handle show/hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/') {
        // set dark if scroll height > 100vh
        if (window.scrollY > window.innerHeight) {
          setIsTransparent(false)
        } else {
          setIsTransparent(true)
        }
      } else {
        setIsTransparent(false)
      }
    }

    // initial
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // MARK: ADS
  useEffect(() => {
    const showTime = 15000
    const interval = 30000

    setTimeout(() => {
      setOpenAds(false)

      setInterval(() => {
        setOpenAds(true)

        setTimeout(() => {
          setOpenAds(false)
        }, showTime)
      }, interval)
    }, showTime)

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setOpenAds(prev => !prev)
      }
    }

    window.addEventListener('keypress', handleKeyPress)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [])

  return (
    <header
      className={`fixed z-[60] ${
        isTransparent
          ? 'drop-shadow-lg md:bg-opacity-0'
          : 'md:rounded-t-0 border-b-2 shadow-medium-light md:rounded-b-[40px]'
      } trans-300 bottom-0 w-full bg-dark-100 text-light md:bottom-auto md:top-0 ${className}`}
    >
      {/* Ads */}
      <Link
        href="https://monaedu.com"
        target="_blank"
        rel="noreferrer"
        className={`${true ? 'max-h-[200px] py-0.5 sm:max-h-12 md:-mt-0.5 md:max-h-6' : 'max-h-0 py-0'} trans-300 group absolute bottom-0 left-0 z-[100] block w-full overflow-hidden px-3 font-body text-sm tracking-wider text-light md:bottom-auto md:top-0`}
        title='Giảm đến 100.000đ hoặc 50% khi nhập mã "BIGSALE50" học tại monaedu.com'
      >
        <p className="mx-auto line-clamp-1 w-full max-w-1200 text-ellipsis px-21 text-center text-xs md:text-left">
          Nhập voucher{' '}
          <span className="wiggle-0 inline-block font-semibold text-primary">&quot;BIGSALE50&quot;</span>{' '}
          giảm ngay <span className="font-semibold">50%</span> hoặc{' '}
          <span className="font-semibold">100K</span>
        </p>
      </Link>

      {/* Main Header */}
      <div className="trans-300 relative m-auto flex h-[72px] w-full max-w-1200 items-center justify-between gap-1 px-3 sm:px-21">
        {/* MARK: Left */}
        <div
          className={`no-scrollbar trans-300 -ml-4 flex h-full items-center gap-3 overflow-x-scroll pl-4`}
        >
          <Link
            href="/"
            prefetch={false}
            className="trans-200 spin shrink-0 rounded-md"
          >
            <Image
              className="aspect-square rounded-md"
              src="/images/logo.png"
              width={32}
              height={32}
              alt="Mona-Edu"
            />
          </Link>
          <Link
            href="/"
            prefetch={false}
            className="hidden text-2xl font-bold md:block"
          >
            MonaEdu
          </Link>

          {/* Categories */}
          <div className="">
            <Link
              href="/categories"
              className="trans-200 group flex items-center justify-center gap-2 text-nowrap rounded-md bg-primary px-1.5 py-1 text-sm font-semibold text-dark hover:bg-secondary hover:text-light md:px-3 md:text-base"
              onMouseOver={() => {
                const timeoutId = setTimeout(() => {
                  setOpenCategoryTabs(true)
                }, 100)
                setHoverTimeout(timeoutId)
              }}
              onMouseOut={() => {
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout)
                  setHoverTimeout(null)
                }
              }}
            >
              <BiSolidCategory
                size={20}
                className="hidden md:block"
              />
              Danh Mục
            </Link>
          </div>
        </div>

        {/* Categories Tabs */}
        <CategoryTabs
          open={openCategoryTabs}
          setOpen={setOpenCategoryTabs}
        />

        {/* Search */}
        <SearchBar />

        {/* MARK: Nav */}
        <div className="hidden flex-shrink-0 items-center gap-4 md:flex">
          <button
            className="lg:hidden"
            onClick={() => dispatch(setOpenSearchBar(true))}
          >
            <FaSearch
              size={20}
              className="wiggle"
            />
          </button>

          {curUser ? (
            <>
              <Link
                href="/cart"
                prefetch={false}
                className="wiggle relative"
              >
                <FaShoppingCart size={24} />
                {!!cartLength && (
                  <span className="absolute -top-2 right-[-5px] flex min-w-[24px] items-center justify-center rounded-full bg-primary px-[6px] py-[2px] text-center text-[10px] font-bold text-dark">
                    {cartLength}
                  </span>
                )}
              </Link>
              <button
                className="wiggle relative"
                onClick={() => setIsOpenNotificationMenu(prev => !prev)}
              >
                <FaBell size={24} />
                {!!notifications.filter(n => n.status === 'unread').length && (
                  <span className="absolute -top-2 right-[-5px] flex min-w-[24px] items-center justify-center rounded-full bg-orange-400 px-[6px] py-[2px] text-center text-[10px] font-bold">
                    {notifications.filter((n: any) => n.status === 'unread').length}
                  </span>
                )}
              </button>
              <div
                className="relative flex cursor-pointer items-center gap-2"
                onClick={() => setIsOpenMenu(prev => !prev)}
              >
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
                  width={40}
                  height={40}
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
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="bg-dark trans-200 cursor-pointer text-nowrap rounded-3xl border border-light bg-dark-100 px-4 py-1.5 font-body font-semibold tracking-wider text-light hover:bg-primary hover:text-dark"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="trans-200 cursor-pointer text-nowrap rounded-3xl border border-dark bg-white px-4 py-1.5 font-body font-semibold tracking-wider text-dark hover:bg-primary hover:text-dark"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            className="lg:hidden"
            onClick={() => dispatch(setOpenSearchBar(true))}
          >
            <FaSearch
              size={20}
              className="w-8"
            />
          </button>

          <Link
            href="/cart"
            prefetch={false}
            className="wiggle relative mr-2"
          >
            <FaShoppingCart size={24} />
            {!!cartLength && (
              <span className="absolute -top-2 right-[-5px] rounded-full bg-primary px-[6px] py-[2px] text-center text-[10px] font-bold text-dark">
                {cartLength}
              </span>
            )}
          </Link>

          <button
            className="group relative"
            onClick={() => setIsOpenNotificationMenu(prev => !prev)}
          >
            <FaBell
              size={22}
              className="wiggle"
            />
            {!!notifications?.filter(n => n.status === 'unread').length && (
              <span className="absolute -top-2 right-[-5px] rounded-full bg-orange-400 px-[6px] py-[2px] text-center text-[10px] font-bold">
                {notifications.filter(n => n.status === 'unread').length}
              </span>
            )}
          </button>

          <button
            className="flex h-[40px] w-[40px] items-center justify-center"
            onClick={() => setIsOpenMenu(prev => !prev)}
          >
            <FaBars
              size={22}
              className="trans-200 wiggle"
            />
          </button>
        </div>

        {/* MARK: Menu */}
        <Menu
          open={isOpenMenu}
          setOpen={setIsOpenMenu}
        />

        {/* MARK: Notification Menu */}
        <NotificationMenu
          open={isOpenNotificationMenu}
          setOpen={setIsOpenNotificationMenu}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </div>
    </header>
  )
}

export default memo(Header)
