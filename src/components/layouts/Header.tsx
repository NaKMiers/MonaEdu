'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setCartItems } from '@/libs/reducers/cartReducer'
import { setOpenSearchBar } from '@/libs/reducers/modalReducer'
import { INotification } from '@/models/NotificationModel'
import { getCartApi, getUserNotificationsApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
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

  // notification states
  const [isOpenNotificationMenu, setIsOpenNotificationMenu] = useState<boolean>(false)

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

  return (
    <header
      className={`fixed z-[60] ${
        isTransparent
          ? 'drop-shadow-lg md:bg-opacity-0'
          : 'shadow-medium-light border-b-2 md:rounded-b-[40px] md:rounded-t-0'
      }  bg-dark-100 text-white w-full trans-300 bottom-0 md:bottom-auto md:top-0 ${className}`}
    >
      {/* Main Header */}
      <div className='relative flex justify-between gap-1 items-center max-w-1200 trans-300 w-full h-[72px] m-auto px-3 sm:px-21'>
        {/* MARK: Left */}
        <div
          className={`flex items-center gap-3 pl-4 -ml-4 h-full overflow-x-scroll no-scrollbar trans-300`}
        >
          <Link href='/' prefetch={false} className='shrink-0 trans-200 spin rounded-md'>
            <Image
              className='aspect-square rounded-md'
              src='/images/logo.png'
              width={32}
              height={32}
              alt='logo'
            />
          </Link>
          <Link href='/' prefetch={false} className='text-2xl font-bold hidden md:block'>
            MonaEdu
          </Link>

          {/* Categories */}
          <div className=''>
            <Link
              href='/categories'
              className='flex items-center justify-center gap-2 group text-nowrap bg-primary text-sm md:text-base font-semibold text-dark px-1.5 md:px-3 py-1 rounded-md hover:bg-secondary hover:text-light trans-200'
              onMouseOver={() => setOpenCategoryTabs(true)}
            >
              <BiSolidCategory size={20} className='hidden md:block' />
              Danh Mục
            </Link>
          </div>
        </div>

        {/* Categories Tabs */}
        <CategoryTabs open={openCategoryTabs} setOpen={setOpenCategoryTabs} />

        {/* Search */}
        <SearchBar />

        {/* MARK: Nav */}
        <div className='flex-shrink-0 hidden md:flex items-center gap-4'>
          <button className='lg:hidden' onClick={() => dispatch(setOpenSearchBar(true))}>
            <FaSearch size={20} className='wiggle' />
          </button>

          {curUser ? (
            <>
              <Link href='/cart' prefetch={false} className='relative wiggle'>
                <FaShoppingCart size={24} />
                {!!cartLength && (
                  <span className='absolute -top-2 right-[-5px] bg-primary text-dark rounded-full text-center px-[6px] py-[2px] text-[10px] font-bold flex items-center justify-center min-w-[24px]'>
                    {cartLength}
                  </span>
                )}
              </Link>
              <button
                className='relative wiggle'
                onClick={() => setIsOpenNotificationMenu(prev => !prev)}
              >
                <FaBell size={24} />
                {!!notifications.filter(n => n.status === 'unread').length && (
                  <span className='absolute -top-2 right-[-5px] bg-orange-400 rounded-full text-center px-[6px] py-[2px] text-[10px] font-bold flex items-center justify-center min-w-[24px]'>
                    {notifications.filter((n: any) => n.status === 'unread').length}
                  </span>
                )}
              </button>
              <div
                className='flex items-center gap-2 cursor-pointer'
                onClick={() => setIsOpenMenu(prev => !prev)}
              >
                <Image
                  className='aspect-square rounded-full wiggle-0 shadow-lg'
                  src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                  width={40}
                  height={40}
                  alt='avatar'
                />
              </div>
            </>
          ) : (
            <div className='flex items-center gap-3'>
              <Link
                href='/auth/login'
                className='bg-dark text-white hover:bg-primary hover:text-dark border border-white text-nowrap trans-200 px-4 py-1.5 rounded-3xl font-body font-semibold tracking-wider cursor-pointer'
              >
                Sign In
              </Link>
              <Link
                href='/auth/register'
                className='bg-sky-500 hover:bg-primary hover:text-dark text-white border border-dark text-nowrap trans-200 px-4 py-1.5 rounded-3xl font-body font-semibold tracking-wider cursor-pointer'
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className='md:hidden flex items-center gap-1'>
          <button className='lg:hidden' onClick={() => dispatch(setOpenSearchBar(true))}>
            <FaSearch size={20} className='w-8' />
          </button>

          <Link href='/cart' prefetch={false} className='relative wiggle mr-2'>
            <FaShoppingCart size={24} />
            {!!cartLength && (
              <span className='absolute -top-2 right-[-5px] bg-primary text-dark rounded-full text-center px-[6px] py-[2px] text-[10px] font-bold'>
                {cartLength}
              </span>
            )}
          </Link>

          <button className='relative group' onClick={() => setIsOpenNotificationMenu(prev => !prev)}>
            <FaBell size={22} className='wiggle' />
            {!!notifications?.filter(n => n.status === 'unread').length && (
              <span className='absolute -top-2 right-[-5px] bg-orange-400 rounded-full text-center px-[6px] py-[2px] text-[10px] font-bold'>
                {notifications.filter(n => n.status === 'unread').length}
              </span>
            )}
          </button>

          <button
            className='flex justify-center items-center w-[40px] h-[40px]'
            onClick={() => setIsOpenMenu(prev => !prev)}
          >
            <FaBars size={22} className='trans-200 wiggle' />
          </button>
        </div>

        {/* MARK: Menu */}
        <Menu open={isOpenMenu} setOpen={setIsOpenMenu} />

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

export default Header
