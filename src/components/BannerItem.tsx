import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addToCartApi, joinCourseOnSubscriptionApi } from '@/requests'
import { checkPackageType } from '@/utils/string'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, ReactNode, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface BannerItemProps {
  course: ICourse
  className?: string
}

function BannerItem({ course, className }: BannerItemProps) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: session, update } = useSession()
  const curUser: any = session?.user

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
    <div className={`relative flex-shrink-0 w-full h-full snap-center ${className}`} key={course._id}>
      <div className='w-full h-full'>
        <Image
          className='img w-full h-full object-cover object-center brightness-[0.8]'
          src={course.images[course.images.length - 1]}
          width={1920}
          height={1920}
          alt={course.title}
          loading='lazy'
        />
      </div>
      <div className='content absolute top-[20%] md:top-[15%] left-1/2 -translate-x-1/2 max-w-[1200px] px-21 w-full drop-shadow-2xl text-light'>
        <div className='max-w-[700px] w-full'>
          <div className='author font-bold tracking-[10px] drop-shadow-lg uppercase'>
            {course.author}
          </div>
          <div
            className='title font-bold text-[30px] md:text-[3em] leading-[1.3em] drop-shadow-md stroke-neutral-950 stroke-2 text-ellipsis line-clamp-2'
            title={course.title}
          >
            {course.title}
          </div>

          <div className='desc drop-shadow-md font-body tracking-wider pr-[20%] text-ellipsis line-clamp-4'>
            {course.textHook}
          </div>
          <div className='buttons flex flex-wrap gap-1.5 mt-5'>
            <Link
              href={`/${course.slug}`}
              className='h-10 flex items-center justify-center px-2 shadow-md text-dark bg-slate-100 font-semibold font-body tracking-wider rounded-md hover:bg-dark-0 hover:text-light trans-200'
            >
              CHI TIẾT
            </Link>

            {/* Buy Now */}
            <button
              className='overflow-hidden relative h-10 flex items-center justify-center px-2 shadow-md text-light border-2 border-light font-semibold font-body tracking-wider rounded-md hover:bg-white hover:text-dark trans-200 uppercase'
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
                    width: `${
                      curUser?.courses.find((c: any) => c.course === course._id)?.progress || 0
                    }%`,
                  }}
                />
              )}

              <p className='relative z-10 flex items-center gap-1 text-sm sm:text-base text-ellipsis text-nowrap line-clamp-1 sm:max-w-max'>
                {isRedirect ? 'Học tiếp' : actionText}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BannerItem)
