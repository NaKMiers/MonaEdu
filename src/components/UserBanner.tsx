'use client'

import { IUser } from '@/models/UserModel'
import { changeBannerApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
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
    (e: ChangeEvent<HTMLInputElement>) => {
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
      console.log('Session - banner...')
      await update()

      // show success message
      toast.success(message)

      // reset form
      setFile(null)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      // stop changing banner
      setIsChangingBanner(false)
    }
  }, [update, file])

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
    <div className={`group relative w-full ${className}`}>
      {(imageUrl || user.banner) && (
        <Image
          className="h-full w-full object-cover"
          src={imageUrl || user.banner || process.env.NEXT_PUBLIC_DEFAULT_BANNER!}
          width={1500}
          height={300}
          alt="banner"
        />
      )}

      <input
        id="images"
        hidden
        placeholder=" "
        disabled={isChangingBanner}
        type="file"
        accept="image/*"
        onChange={handleAddFile}
        ref={bannerInputRef}
      />
      {!isChangingBanner && curUser?._id === user?._id && (
        <div
          className="trans-200 absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center bg-dark-0 bg-opacity-20 opacity-0 drop-shadow-lg group-hover:opacity-100"
          onClick={() => !file && bannerInputRef.current?.click()}
        >
          {file ? (
            <div className="flex items-center justify-center gap-21">
              <FaSave
                size={40}
                className="wiggle-1 text-green-400"
                onClick={handleSaveBanner}
              />
              <ImCancelCircle
                size={40}
                className="wiggle-1 text-slate-200"
                onClick={handleCancelBanner}
              />
            </div>
          ) : (
            <FaCamera
              size={52}
              className="wiggle-0 text-light"
            />
          )}
        </div>
      )}
      {isChangingBanner && (
        <div className="absolute left-0 top-0 h-full w-full bg-white bg-opacity-20 pl-2 pt-2">
          <Image
            className="animate-spin"
            src="/icons/loading.png"
            width={50}
            height={50}
            alt="loading"
          />
        </div>
      )}
    </div>
  )
}

export default memo(UserBanner)
