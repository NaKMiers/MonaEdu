'use client'

import { INotification } from '@/models/NotificationModel'
import { readNotificationsApi, removeNotificationsApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { IoCloseCircleOutline, IoMail, IoMailOpen } from 'react-icons/io5'
import { format, register as timeAgoRegister } from 'timeago.js'
import vi from 'timeago.js/lib/lang/vi'

interface NotificationMenuProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  notifications: INotification[]
  setNotifications: Dispatch<SetStateAction<INotification[]>>
  className?: string
}

function NotificationMenu({
  open,
  setOpen,
  notifications,
  setNotifications,
  className = '',
}: NotificationMenuProps) {
  // hooks
  const { data: session } = useSession()
  const router = useRouter()
  const curUser: any = session?.user

  // refs
  const menuRef = useRef<HTMLUListElement>(null)

  // values
  timeAgoRegister('vi', vi)

  // handle remove notifications
  const handleRemoveNotifications = useCallback(
    async (ids: string[]) => {
      try {
        const { message } = await removeNotificationsApi(ids)

        // remove notifications
        const newNotifications = notifications.filter(n => !ids.includes(n._id))
        setNotifications(newNotifications)
        if (newNotifications.length === 0) {
          setOpen(false)
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [setNotifications, setOpen, notifications]
  )

  // handle read notifications
  const handleReadNotifications = useCallback(
    async (ids: string[], status: 'read' | 'unread') => {
      try {
        const { message } = await readNotificationsApi(ids, status)

        // read / unread notifications
        setNotifications(prev => prev.map(noti => (ids.includes(noti._id) ? { ...noti, status } : noti)))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [setNotifications]
  )

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
          open && notifications.length ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <ul
        className={`hidden opacity-0 max-h-[400px] sm:max-w-full sm:w-[300px] sm:max-h-[350px] p-2 opacity-1x ${
          curUser && !curUser?._id ? 'hidden' : ''
        } text-dark flex flex-col gap-2 overflow-y-auto w-full overflow-hidden trans-300 absolute bottom-[72px] md:bottom-auto md:top-[60px] right-0 sm:right-21 z-30 sm:rounded-medium sm:shadow-sky-400 shadow-md bg-slate-100`}
        ref={menuRef}
      >
        <li className='flex items-center justify-end px-2'>
          <button
            className='text-xs font-semibold trans-200'
            onClick={() =>
              handleReadNotifications(
                notifications.map(n => n._id),
                notifications.some(n => n.status === 'unread') ? 'read' : 'unread'
              )
            }
          >
            {notifications.some(n => n.status === 'unread') ? 'Đọc tất cả' : 'Chưa đọc tất cả'}
          </button>
        </li>

        {notifications.length <= 0 && (
          <li>
            <p className='italic text-slate-500 font-body tracking-wider text-center'>
              Không có thông báo.
            </p>
          </li>
        )}

        {notifications
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
          .map((noti: INotification) => (
            <li
              className={`relative ${
                noti.status === 'unread' ? 'bg-red-100' : ''
              } rounded-lg hover:bg-white trans-300 p-2`}
              key={noti._id}
            >
              <div
                className={`flex gap-2 ${noti.link ? 'cursor-pointer' : ''}`}
                onClick={() => noti.link && router.push(noti.link)}
              >
                <div className='max-w-[28px] max-h-[28px] w-full h-full rounded-md shadow-lg overflow-hidden'>
                  <Image
                    className='w-full h-full object-cover'
                    src={noti.image}
                    width={28}
                    height={28}
                    alt='avatar'
                  />
                </div>
                <div className='flex gap-1 font-body tracking-wider -mt-1 w-full'>
                  <div className='font-semibold text-xs flex-1'>
                    <span>{noti.title}</span>
                    <p className='text-xs text-slate-500 font-normal'>{format(noti.createdAt, 'vi')}</p>
                  </div>
                  <div className='flex flex-col gap-0.5 items-center'>
                    <IoCloseCircleOutline
                      size={18}
                      className='wiggle-1 flex-shrink-0 cursor-pointer'
                      onClick={e => {
                        e.stopPropagation()
                        handleRemoveNotifications([noti._id])
                      }}
                    />
                    {noti.status === 'unread' ? (
                      <IoMail
                        size={16}
                        className='wiggle-1 flex-shrink-0 cursor-pointer'
                        onClick={e => {
                          e.stopPropagation()
                          handleReadNotifications([noti._id], 'read')
                        }}
                      />
                    ) : (
                      <IoMailOpen
                        size={16}
                        className='wiggle-1 flex-shrink-0 cursor-pointer'
                        onClick={e => {
                          e.stopPropagation()
                          handleReadNotifications([noti._id], 'unread')
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              {noti.content && <p className='font-body text-xs tracking-wider mt-2'>{noti.content}</p>}
            </li>
          ))}
      </ul>
    </>
  )
}

export default memo(NotificationMenu)
