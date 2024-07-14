'use client'

import { IUser } from '@/models/UserModel'
import { changeBannerApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCamera, FaSave } from 'react-icons/fa'
import { ImCancelCircle } from 'react-icons/im'

interface UserBannerProps {
  user: IUser
  className?: string
}

function UserBanner({ user, className = '' }: UserBannerProps) {
  // hook
  const { data: session, update } = useSession()
  const curUser: any = session?.user

  // states
  const [imageUrl, setImageUrl] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [isChangingBanner, setIsChangingBanner] = useState<boolean>(false)

  // refs
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // handle add file when user select files
  const handleAddFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        // validate file type and size
        if (!file.type.startsWith('image/')) {
          return toast.error('Hãy chọn 1 tệp ảnh')
        }
        if (file.size > 5 * 1024 * 1024) {
          return toast.error('Kích thước tệp quá lớn, hãy chọn tệp dưới 5Mb')
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

  // update banner
  const handleSaveBanner = useCallback(async () => {
    if (!file) return

    // start changing banner
    setIsChangingBanner(true)

    try {
      const formData = new FormData()
      formData.append('banner', file)

      // send request to server to update banner
      const { message } = await changeBannerApi(formData)

      // update user session
      await update()

      // show success message
      toast.success(message)

      // reset form
      setFile(null)
      setImageUrl('')
      URL.revokeObjectURL(imageUrl)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      // stop changing banner
      setIsChangingBanner(false)
    }
  }, [update, file, imageUrl])

  // cancel changing banner
  const handleCancelBanner = useCallback(async () => {
    setFile(null)
    setImageUrl('')

    URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  // revoke blob url when component unmount
  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  return (
    <div className={`relative w-full group ${className}`}>
      {(imageUrl || user.banner) && (
        <Image
          className='w-full h-full object-cover'
          src={imageUrl || user.banner || process.env.NEXT_PUBLIC_DEFAULT_BANNER!}
          width={1500}
          height={300}
          alt='banner'
        />
      )}

      <input
        id='images'
        hidden
        placeholder=' '
        disabled={isChangingBanner}
        type='file'
        accept='image/*'
        onChange={handleAddFile}
        ref={bannerInputRef}
      />
      {!isChangingBanner && curUser?._id === user?._id && (
        <div
          className='absolute top-0 left-0 flex opacity-0 group-hover:opacity-100 items-center justify-center bg-dark-0 w-full h-full bg-opacity-20 trans-200 cursor-pointer drop-shadow-lg'
          onClick={() => !imageUrl && bannerInputRef.current?.click()}
        >
          {imageUrl ? (
            <div className='flex items-center justify-center gap-21'>
              <FaSave size={40} className='text-green-400 wiggle-1' onClick={handleSaveBanner} />
              <ImCancelCircle
                size={40}
                className='text-slate-200 wiggle-1'
                onClick={handleCancelBanner}
              />
            </div>
          ) : (
            <FaCamera size={52} className='text-white wiggle-0' />
          )}
        </div>
      )}
      {isChangingBanner && (
        <div className='absolute top-0 left-0 w-full h-full bg-white bg-opacity-20 pt-2 pl-2'>
          <Image
            className='animate-spin'
            src='/icons/loading.png'
            width={50}
            height={50}
            alt='loading'
          />
        </div>
      )}
    </div>
  )
}

export default memo(UserBanner)
