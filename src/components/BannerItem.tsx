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
import { memo, ReactNode, useCallback } from 'react'
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
            Mua <span className="text-[10px] text-violet-400">(-1 credit)</span>
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
          Học tiếp <span className="text-xs text-violet-400">(-1 credit)</span>
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
    <div
      className={`relative h-full w-full flex-shrink-0 snap-center ${className}`}
      key={course._id}
    >
      <div className="h-full w-full">
        <Image
          className="img h-full w-full object-cover object-center brightness-[0.8]"
          src={course.images[course.images.length - 1]}
          width={1920}
          height={1920}
          alt={course.title}
          loading="lazy"
        />
      </div>
      <div className="content absolute left-1/2 top-[20%] w-full max-w-[1200px] -translate-x-1/2 px-21 text-light drop-shadow-2xl md:top-[15%]">
        <div className="w-full max-w-[700px]">
          {/* <div className="author font-bold uppercase tracking-[10px] drop-shadow-lg">
            {course.author}
          </div>
          <div
            className="title line-clamp-2 text-ellipsis stroke-neutral-950 stroke-2 text-[30px] font-bold leading-[1.3em] drop-shadow-md md:text-[3em]"
            title={course.title}
          >
            {course.title}
          </div>

          <div className="desc line-clamp-4 text-ellipsis pr-[20%] font-body tracking-wider drop-shadow-md">
            {course.textHook}
          </div> */}
          <div className="buttons mt-5 flex flex-wrap gap-1.5">
            <Link
              href={`/${course.slug}`}
              className="trans-200 flex h-10 items-center justify-center rounded-md bg-slate-100 px-2 font-body font-semibold tracking-wider text-dark shadow-md hover:bg-dark-0 hover:text-light"
            >
              CHI TIẾT
            </Link>

            {/* Buy Now */}
            <button
              className="trans-200 relative flex h-10 items-center justify-center overflow-hidden rounded-md border-2 border-light px-2 font-body font-semibold uppercase tracking-wider text-light shadow-md hover:bg-white hover:text-dark"
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
                  className="absolute left-0 top-0 h-full bg-orange-500"
                  style={{
                    width: `${
                      curUser?.courses.find((c: any) => c.course === course._id)?.progress || 0
                    }%`,
                  }}
                />
              )}

              <p className="relative z-10 line-clamp-1 flex items-center gap-1 text-ellipsis text-nowrap text-sm sm:max-w-max sm:text-base">
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
