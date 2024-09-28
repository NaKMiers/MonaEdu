'use client'

import { changeNotificationSettingApi } from '@/requests'
import { useSession } from 'next-auth/react'
import { memo, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Divider from '../Divider'

interface NotificationSettingsProps {
  className?: string
}

function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  // hook
  const { data: session, update } = useSession()
  const curUser: any = session?.user

  // states
  const [userNotificationSettings, setUserNotificationSettings] = useState<any>({
    newLesson: false,
    repliedComment: false,
    emotionComment: false,
  })

  // auto update initials states
  useEffect(() => {
    if (curUser?._id && curUser.notificationSettings) {
      setUserNotificationSettings({
        ...curUser.notificationSettings,
      })
    }
  }, [curUser?._id, curUser])

  // handle change notification settings
  const handleChangeNotificationSetting = useCallback(
    async (type: string) => {
      if (!curUser?._id) {
        toast.error('User not found!')
        return
      }

      try {
        // update first
        setUserNotificationSettings((prev: any) => ({ ...prev, [type]: !prev[type] }))

        const { message } = await changeNotificationSettingApi(type, !userNotificationSettings[type])

        // notify success
        toast.success(message)

        // update user session
        console.log('Session - notification-setting...')
        await update()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [curUser?._id, update, userNotificationSettings]
  )

  return (
    <div
      className={`relative overflow-x-scroll rounded-lg border border-dark py-8 shadow-lg ${className}`}
    >
      <div className="absolute left-1/2 h-0.5 w-[calc(100%_-_20px)] -translate-x-1/2 bg-slate-700 text-2xl font-semibold">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-2 py-1 text-center text-sm">
          Cài đặt thông báo
        </span>
      </div>

      <Divider size={5} />

      <div className="p-5">
        <p className="font-semibold">Gửi thông báo cho tôi khi:</p>

        <Divider size={4} />

        <ul className="flex w-full max-w-[500px] flex-col gap-4 pl-21 md:pl-20">
          <li className="flex items-center justify-between gap-4">
            <span>Có khóa học mới</span>

            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={userNotificationSettings.newLesson}
                onChange={() => handleChangeNotificationSetting('newLesson')}
                className="peer sr-only"
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-light rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700"></div>
            </label>
          </li>
          <li className="flex items-center justify-between gap-4">
            <span>Bình luận của tôi được trả lời</span>

            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={userNotificationSettings.repliedComment}
                onChange={() => handleChangeNotificationSetting('repliedComment')}
                className="peer sr-only"
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-light rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700"></div>
            </label>
          </li>
          <li className="flex items-center justify-between gap-4">
            <span>Bình luận của tôi được thích</span>

            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={userNotificationSettings.emotionComment}
                onChange={() => handleChangeNotificationSetting('emotionComment')}
                className="peer sr-only"
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-light rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700"></div>
            </label>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default memo(NotificationSettings)
