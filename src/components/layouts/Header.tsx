'use client'

import { useAppDispatch } from '@/libs/hooks'
import { setCartItems } from '@/libs/reducers/cartReducer'
import { INotification } from '@/models/UserModel'
import { getCartApi, removeNotificationApi } from '@/requests'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BiSolidCategory } from 'react-icons/bi'
import { FaBell, FaChevronUp, FaShoppingCart } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa6'
import NotificationMenu from '../NotificationMenu'
import SearchBar from './SearchBar'
import Menu from './Menu'

interface HeaderProps {
  className?: string
}

function Header({ className = '' }: HeaderProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session, update } = useSession()
  const pathname = usePathname()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || {})
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const [isTransparent, setIsTransparent] = useState<boolean>(pathname === '/')
  const [isOpenNotificationMenu, setIsOpenNotificationMenu] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<INotification[]>(curUser?.notifications || [])
  const [cartLength, setCartLength] = useState<number>(0)

  // MARK: Side Effects
  // update user session
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession()
      const user: any = session?.user
      setCurUser(user)
      setNotifications(user.notifications || [])

      await update()
    }

    if (!curUser?._id) {
      getUser()
    }
  }, [update, curUser])

  // get user's cart
  useEffect(() => {
    const getUserCart = async () => {
      if (curUser?._id) {
        try {
          // send request to get user's cart
          const { cart } = await getCartApi() // cache: no-store

          // set cart to state
          dispatch(setCartItems(cart))

          setCartLength(cart.length)
        } catch (err: any) {
          console.log(err)
          toast.error(err.response.data.message)
        }
      }
    }
    getUserCart()
  }, [dispatch, curUser?._id])

  // handle remove notification
  const handleRemoveNotification = useCallback(
    async (id: string) => {
      try {
        const { message } = await removeNotificationApi(id)

        // remove notification
        const newNotifications = notifications.filter(noti => noti._id !== id)
        setNotifications(newNotifications)
        if (newNotifications.length === 0) {
          setIsOpenNotificationMenu(false)
        }

        // show success
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [setNotifications, setIsOpenNotificationMenu, notifications]
  )

  // handle scroll
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
      className={`fixed z-50 ${
        isTransparent
          ? 'text-white drop-shadow-lg md:bg-opacity-0'
          : 'text-dark shadow-lg md:rounded-b-[40px] bg-white bg-opacity-95'
      } w-full trans-300 bottom-0 md:bottom-auto md:top-0 ${className}`}
    >
      {/* Main Header */}
      <div className='relative flex justify-between gap-3 items-center max-w-1200 trans-300 w-full h-[72px] m-auto px-21'>
        {/* MARK: Left */}
        <div
          className={`flex items-center gap-3 pl-4 -ml-4 h-full overflow-x-scroll no-scrollbar trans-300`}
        >
          <Link href='/' prefetch={false} className='shrink-0 trans-200 spin'>
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
          <div className='relative'>
            <button className='group text-nowrap bg-primary font-semibold flex items-center justify-center gap-2 text-dark px-3 py-1 rounded-md hover:bg-secondary hover:text-light trans-200'>
              <BiSolidCategory size={20} />
              Danh Mục
              <FaChevronUp size={14} className='group-hover:rotate-180 trans-200' />
            </button>
          </div>
        </div>

        {/* Search */}
        {/* <SearchBar /> */}

        {/* MARK: Nav */}
        <div className='flex-shrink-0 hidden md:flex items-center gap-4'>
          {curUser ? (
            !!curUser._id && (
              <>
                <Link href='/cart' prefetch={false} className='relative wiggle'>
                  <FaShoppingCart size={24} />
                  {!!cartLength && (
                    <span className='absolute -top-2 right-[-5px] bg-primary rounded-full text-center px-[6px] py-[2px] text-[10px] font-bold'>
                      {cartLength}
                    </span>
                  )}
                </Link>
                <button
                  className='relative group'
                  onClick={() => setIsOpenNotificationMenu(prev => !prev)}
                >
                  <FaBell size={24} className='wiggle' />
                  {!!notifications.length && (
                    <span className='absolute top-0 right-0 w-1.5 h-1.5 rounded-lg bg-green-400' />
                  )}
                </button>
                <div
                  className='flex items-center gap-2 cursor-pointer'
                  onClick={() => setIsOpenMenu(prev => !prev)}
                >
                  <Image
                    className='aspect-square rounded-full wiggle-0'
                    src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                    width={40}
                    height={40}
                    alt='avatar'
                  />

                  <span className='font-semibold text-lg'>
                    {curUser?.firstName && curUser?.lastName
                      ? `${curUser.firstName} ${curUser.lastName}`
                      : curUser.username}
                  </span>
                </div>
              </>
            )
          ) : (
            <div className='flex items-center gap-3'>
              <Link
                href='/auth/login'
                className='bg-dark-100 text-white hover:bg-primary hover:text-dark border border-dark text-nowrap trans-200 px-4 py-1.5 rounded-3xl font-body font-semibold tracking-wider cursor-pointer'
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

        {/* Menu Button */}
        <div className='md:hidden flex items-center gap-0.5'>
          <button className='relative group' onClick={() => setIsOpenNotificationMenu(prev => !prev)}>
            <FaBell size={22} className='wiggle' />
            {!!notifications.length && (
              <span className='absolute top-0 right-0 w-1.5 h-1.5 rounded-lg bg-green-400' />
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
          handleRemoveNotification={handleRemoveNotification}
        />
      </div>
    </header>
  )
}

export default Header
