'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addToCartApi, joinCourseOnSubscriptionApi } from '@/requests'
import { checkPackageType } from '@/utils/string'
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
  const joinedCourse = curUser?.courses.find((c: any) => c.course === course._id)
  let packageType: 'lifetime' | 'credit' | 'monthly' | 'no-subscription' = 'no-subscription'
  let actionText: ReactNode = 'Mua ngay'
  let action: 'join' | 'buy' = 'buy'
  let isRedirect: boolean =
    joinedCourse && (!joinedCourse.expire || new Date(joinedCourse.expire) > new Date())

  if (curUser?.package) {
    const { credit, expire } = curUser.package

    switch (checkPackageType(credit, expire)) {
      case 'lifetime': {
        packageType = 'lifetime'
        actionText = 'Tham gia'
        action = 'join'
        break
      }
      case 'credit': {
        packageType = 'credit'
        actionText = (
          <span title={`Tham gia (-1 credit})`}>
            Mua <span className='text-[10px] text-violet-400'>(-1 credit)</span>
          </span>
        )
        action = 'join'
        break
      }
      case 'monthly': {
        packageType = 'monthly'
        actionText = 'Tham gia'
        action = 'join'
        break
      }
    }

    // if user has joined course by monthly package and package expired
    if (joinedCourse && packageType === 'credit' && new Date(joinedCourse.expire) < new Date()) {
      actionText = (
        <>
          Học tiếp <span className='text-xs text-violet-400'>(-1 credit)</span>
        </>
      )
      action = 'join'
    }

    // if user hasn't joined the course yet, package type === 'lifetime' and course price > user max price
    if (
      !joinedCourse &&
      packageType === 'lifetime' &&
      curUser.package.maxPrice !== null &&
      course.price >= curUser.package.maxPrice
    ) {
      actionText = 'Mua ngay'
      action = 'buy'
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

      // move to learning page
      router.push(`/learning/${course.slug}/continue`)

      // update user session
      await update()

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
      className={`relative font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-light border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1 px-2 overflow-hidden ${className}`}
      onClick={() => {
        if (isRedirect) {
          router.push(`/learning/${course?.slug}/continue`)
        } else {
          action === 'buy' ? buyNow() : joinOnSubscription()
        }
      }}
    >
      {!!joinedCourse && (
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

      <p className='relative z-10 flex items-center gap-1 text-sm sm:text-base text-ellipsis text-nowrap line-clamp-1 sm:max-w-max'>
        {isRedirect ? 'Học tiếp' : actionText}
      </p>
    </button>
  )
}

export default memo(BuyNowButton)
