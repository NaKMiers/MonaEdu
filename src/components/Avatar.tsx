'use client'

import { IUser } from '@/models/UserModel'
import { changeAvatarApi } from '@/requests'
import { checkCrown } from '@/utils/string'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCamera, FaSave } from 'react-icons/fa'
import { ImCancelCircle } from 'react-icons/im'

interface AvatarProps {
  user: IUser
  className?: string
}

function Avatar({ user, className = '' }: AvatarProps) {
  // hook
  const { data: session, update } = useSession()
  const curUser: any = session?.user

  // states
  const [imageUrl, setImageUrl] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [isChangingAvatar, setIsChangingAvatar] = useState<boolean>(false)

  // values
  let isShowCrown = checkCrown(curUser?.package)

  // refs
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // handle add file when user select files
  const handleAddFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        // validate file type and size
        if (!file.type.startsWith('image/')) {
          return toast.error('Please select an image file')
        }
        if (file.size > 3 * 1024 * 1024) {
          return toast.error('Please select an image file less than 3MB')
        }

        setFile(file)
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }
        setImageUrl(URL.createObjectURL(file))

        e.target.value = ''
        e.target.files = null
      }
    },
    [imageUrl]
  )

  // update avatar
  const handleSaveAvatar = useCallback(async () => {
    if (!file) return

    // start changing avatar
    setIsChangingAvatar(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      // send request to server to update avatar
      const { message } = await changeAvatarApi(formData)

      // update user session
      console.log('Session - avatar...')
      await update()

      // show success message
      toast.success(message)

      // reset form
      setFile(null)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      // stop changing avatar
      setIsChangingAvatar(false)
    }
  }, [update, file])

  // cancel changing avatar
  const handleCancelAvatar = useCallback(async () => {
    setFile(null)
    setImageUrl('')

    URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  // revoke blob url when component unmount
  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  return (
    <div className={`group relative w-full rounded-full aspect-square ${className}`}>
      {isShowCrown && (
        <Image
          className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square rounded-full overflow-hidden'
          src='/icons/ring-circle.png'
          width={200}
          height={200}
          alt='ring'
        />
      )}
      {(imageUrl || user?.avatar) && (
        <Image
          className={`w-full h-full object-cover rounded-full overflow-hidden aspect-square ${
            isShowCrown ? 'p-2.5' : ''
          }`}
          src={imageUrl || user?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
          width={200}
          height={200}
          alt='avatar'
        />
      )}
      {isShowCrown && (
        <Image
          className='absolute z-20 -top-[30px] right-[24px] rotate-[18deg]'
          src='/icons/crown-icon-2.png'
          width={60}
          height={60}
          alt='crown'
        />
      )}

      <input
        id='images'
        hidden
        placeholder=' '
        disabled={isChangingAvatar}
        type='file'
        accept='image/*'
        onChange={handleAddFile}
        ref={avatarInputRef}
      />
      {!isChangingAvatar && curUser?._id === user?._id && (
        <div
          className='absolute top-0 left-0 flex rounded-full aspect-square overflow-hidden opacity-0 group-hover:opacity-100 items-center justify-center bg-dark-0 w-full h-full bg-opacity-20 trans-200 cursor-pointer drop-shadow-lg'
          onClick={() => !file && avatarInputRef.current?.click()}
        >
          {file ? (
            <div className='flex items-center justify-center gap-21'>
              <FaSave size={40} className='text-green-400 wiggle-1' onClick={handleSaveAvatar} />
              <ImCancelCircle
                size={40}
                className='text-slate-200 wiggle-1'
                onClick={handleCancelAvatar}
              />
            </div>
          ) : (
            <FaCamera size={52} className='text-white wiggle-0' />
          )}
        </div>
      )}
      {isChangingAvatar && (
        <div className='absolute top-0 left-0 rounded-full aspect-square overflow-hidden w-full h-full bg-white bg-opacity-20'>
          <Image
            className='animate-spin'
            src='/icons/loading.png'
            width={200}
            height={200}
            alt='loading'
          />
        </div>
      )}
    </div>
  )
}

export default memo(Avatar)
