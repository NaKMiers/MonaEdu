'use client'

import { INotification } from '@/models/UserModel'
import { readNotificationsApi, removeNotificationsApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoCloseCircleOutline, IoMail, IoMailOpen } from 'react-icons/io5'
import { format } from 'timeago.js'

interface NotificationMenuProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
}

function NotificationMenu({ open, setOpen, className = '' }: NotificationMenuProps) {
  // hooks
  const { data: session, update } = useSession()
  const router = useRouter()
  const curUser: any = session?.user

  // states
  const [notifications, setNotifications] = useState<INotification[]>(curUser?.notifications || [])

  console.log('notifications:', notifications)

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

        // update user
        await update()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [update, setOpen, notifications]
  )

  // handle read notifications
  const handleReadNotifications = useCallback(
    async (ids: string[], value: boolean) => {
      try {
        const { message } = await readNotificationsApi(ids, value)

        // read / unread notifications

        setNotifications(prev =>
          prev.map(noti =>
            ids.includes(noti._id) ? { ...noti, status: value ? 'read' : 'unread' } : noti
          )
        )

        // update user
        await update()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [update]
  )

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
        className={`${
          open && notifications.length
            ? 'max-h-[400px] sm:max-w-full sm:w-[300px] sm:max-h-[350px] p-2 opacity-1x'
            : 'max-h-0 sm:max-h-0 p-0 sm:max-w-0 sm:w-0 opacity-0x'
        } ${
          curUser && !curUser?._id ? 'hidden' : ''
        } text-dark flex flex-col gap-2 overflow-y-auto w-full overflow-hidden trans-300 absolute bottom-[72px] md:bottom-auto md:top-[60px] right-0 sm:right-21 z-30 sm:rounded-medium sm:shadow-sky-400 shadow-md bg-slate-100`}
      >
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
                    <p className='text-xs text-slate-500 font-normal'>{format(noti.createdAt)}</p>
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
                          handleReadNotifications([noti._id], true)
                        }}
                      />
                    ) : (
                      <IoMailOpen
                        size={16}
                        className='wiggle-1 flex-shrink-0 cursor-pointer'
                        onClick={e => {
                          e.stopPropagation()
                          handleReadNotifications([noti._id], false)
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
