'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addToCartApi, joinCourseOnSubscriptionApi } from '@/requests'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { memo, ReactNode, useCallback } from 'react'
import toast from 'react-hot-toast'

interface BuyNowButtonProps {
  course: ICourse
  className?: string
}

function BuyNowButton({ course, className }: BuyNowButtonProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session, update } = useSession()
  const curUser: any = session?.user
  const router = useRouter()

  // values
  const isJoined: boolean =
    curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)

  let packageType: 'lifetime' | 'credit' | 'monthly' | 'no-subscription' = 'no-subscription'
  let actionText: ReactNode = 'Mua ngay'

  if (curUser?.package) {
    const { credit, expire } = curUser.package

    if (credit === null && expire === null) {
      packageType = 'lifetime'
      actionText = 'Tham gia'
    } else if (typeof credit === 'number' && credit > 0 && expire === null) {
      packageType = 'credit'
      actionText = (
        <>
          Tham gia <span className='text-xs text-violet-400'>(-1 credit)</span>
        </>
      )
    } else if (credit === null && expire !== null && new Date(expire) > new Date()) {
      packageType = 'monthly'
      actionText = 'Tham gia'
    }
  }

  // handle buy on subscription features
  const joinOnSubscription = useCallback(async () => {
    // check package type
    if (packageType === 'no-subscription') {
      toast.error('Bạn cần mua gói học viênO để tham gia khóa học này')
      return
    }

    // start page loading
    dispatch(setPageLoading(true))

    try {
      const { message } = await joinCourseOnSubscriptionApi(course.slug, packageType)

      // show success message
      toast.success(message)

      // update user session
      await update()

      // move to learning page
      router.push(`/learning/${course.slug}/continue`)

      // stop page loading
      dispatch(setPageLoading(false))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)

      // stop page loading
      dispatch(setPageLoading(false))
    }
  }, [update, dispatch, router, packageType, course.slug])

  // handle buy now
  const buyNow = useCallback(async () => {
    // check if user is logged in
    if (!curUser?._id) {
      toast.error('Vui lòng đăng nhập để thêm khóa học vào giỏ hàng')
      return
    }

    // start page loading
    dispatch(setPageLoading(true))

    try {
      // send request to add course to cart
      const { cartItem, message } = await addToCartApi(course._id)

      console.log('cartItem', cartItem)

      // show toast success
      toast.success(message)

      // add cart items to state
      dispatch(addCartItem(cartItem))

      // move to cart page
      router.push(`/cart?course=${course.slug}`)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
      router.push(`/cart?course=${course.slug}`)
    } finally {
      // stop page loading
      dispatch(setPageLoading(false))
    }
  }, [course._id, dispatch, course.slug, router, curUser?._id])

  return (
    <button
      className='relative font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-white border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1 px-2 overflow-hidden'
      onClick={() => {
        if (curUser?.courses.map((course: any) => course.course).includes(course._id)) {
          router.push(`/learning/${course?.slug}/continue`)
        } else {
          packageType === 'no-subscription' ? buyNow() : joinOnSubscription()
        }
      }}
    >
      {isJoined && (
        <div
          className='absolute top-0 left-0 h-full bg-orange-500'
          style={{
            width: `${curUser?.courses.find((c: any) => c.course === course._id)?.progress || 0}%`,
          }}
        >
          <span className='absolute top-1 left-1 text-xs rounded-full font-semibold'>
            {curUser?.courses.find((c: any) => c.course === course._id)?.progress + '%'}
          </span>
        </div>
      )}

      <p className='relative z-10 flex items-center gap-1 sm:text-sm md:text-base text-ellipsis text-nowrap line-clamp-1 sm:max-w-max'>
        {isJoined ? 'Học tiếp' : actionText}
      </p>
    </button>
  )
}

export default memo(BuyNowButton)
