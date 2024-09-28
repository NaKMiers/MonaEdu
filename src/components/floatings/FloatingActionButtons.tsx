'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addToCartApi, likeCourseApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus, FaRegThumbsUp, FaShareAlt } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { RiDonutChartFill } from 'react-icons/ri'
import { FacebookShareButton } from 'react-share'
import BuyNowButton from '../admin/BuyNowButton'

interface FloatingActionButtonsProps {
  course: ICourse
  className?: string
}

function FloatingActionButtons({ course: data, className = '' }: FloatingActionButtonsProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const router = useRouter()

  // states
  const [course, setCourse] = useState<ICourse>(data)
  const [showActions, setShowActions] = useState<boolean>(false)

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // MARK: Add
  // add course to cart - DATABASE
  const addCourseToCart = useCallback(async () => {
    // check if user is logged in
    if (!curUser?._id) {
      toast.error('Vui lòng đăng nhập để thêm khóa học vào giỏ hàng')
      return
    }

    // start loading
    setIsLoading(true)

    try {
      // send request to add course to cart
      const { cartItem, message } = await addToCartApi(course._id)

      // show toast success
      toast.success(message)

      // add cart items to state
      dispatch(addCartItem(cartItem))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [dispatch, course._id, curUser?._id])

  // MARK: Buy
  // handle buy now (add to cart and move to cart page)
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

  // like course
  const handleLike = useCallback(async () => {
    if (!curUser?._id) {
      toast.error('Vui lòng đăng nhập để like khóa học')
      return
    }

    const value = !course.likes.includes(curUser?._id) ? 'y' : 'n'

    try {
      // send request to like / dislike comment
      await likeCourseApi(course._id, value)
    } catch (err: any) {
      toast.error(err.message)
      console.log(err)
    }

    setCourse(prev => ({
      ...prev,
      likes: value === 'y' ? [...prev.likes, curUser._id] : prev.likes.filter(id => id !== curUser._id),
    }))
  }, [course._id, curUser?._id, course.likes])

  return (
    <div className={`fixed ${className}`}>
      {/* Like & Share */}
      <div className="mr-1 flex items-center gap-2 sm:mr-2.5 sm:gap-2.5">
        <button className="group flex items-center justify-center">
          <span className="mr-1.5 hidden font-semibold sm:block">{course.likes.length}</span>{' '}
          <FaRegThumbsUp
            size={16}
            className={`${
              !course.likes.includes(curUser?._id)
                ? 'text-dark group-hover:text-rose-500'
                : 'text-rose-500 group-hover:text-dark'
            } trans-200 -mt-1`}
            onClick={handleLike}
          />
        </button>

        <FacebookShareButton
          url={`https://monaedu.com/${course.slug}`}
          hashtag="#monaedu"
        >
          <div className="flex w-full items-center justify-center">
            <FaShareAlt size={16} />
            <span className="ml-1.5 hidden text-nowrap font-semibold sm:block">Chia sẻ</span>
          </div>
        </FacebookShareButton>
      </div>

      {/* Price */}
      <div className="flex flex-col justify-center border-l pl-2 font-semibold tracking-tighter text-dark sm:px-4">
        <span className="text-sm font-bold leading-4 sm:text-[18px]">{formatPrice(course.price)}</span>
        {course.oldPrice && (
          <span className="text-[10px] leading-4 text-slate-400 line-through sm:text-sm">
            {formatPrice(course.oldPrice)}
          </span>
        )}
      </div>

      {/* Buy Now */}
      <BuyNowButton course={course} />

      {/* Add To Cart */}
      {(!curUser || !curUser?.courses?.map((course: any) => course.course).includes(course._id)) && (
        <button
          className={`trans-300 group flex h-[42px] items-center justify-center rounded-lg border-2 border-dark bg-dark-100 px-3 font-semibold shadow-lg hover:-translate-y-1 hover:bg-white ${
            isLoading ? 'pointer-events-none bg-slate-200' : ''
          }`}
          onClick={addCourseToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <RiDonutChartFill
              size={18}
              className="animate-spin text-dark"
            />
          ) : (
            <FaCartPlus className="wiggle text-[18px] text-light group-hover:text-dark sm:text-[20px]" />
          )}
        </button>
      )}

      {curUser?._id && curUser.courses.map((course: any) => course.course).includes(course._id) && (
        <div className="relative flex h-[42px] w-[30px] items-center justify-end text-dark">
          <button
            className="group"
            onClick={() => setShowActions(prev => !prev)}
          >
            <HiDotsVertical
              size={24}
              className="wiggle"
            />
          </button>
          <div
            className={`${
              showActions ? 'max-h-[40px] max-w-[120px] px-1.5 py-1' : 'max-h-0 max-w-0 p-0'
            } trans-300 absolute bottom-[80%] z-20 flex gap-2 overflow-hidden rounded-md`}
          >
            <button
              className={`trans-200 text-nowrap rounded-md border border-dark bg-white px-1.5 py-1 text-[10px] font-bold text-dark shadow-md hover:bg-dark-0 hover:text-light`}
              onClick={buyNow}
            >
              Mua tặng
            </button>
            {['admin', 'editor'].includes(curUser.role) && (
              <Link
                href={`/admin/course/all?slug=${course.slug}`}
                className={`trans-200 text-nowrap rounded-md border border-dark bg-white px-1.5 py-1 text-[10px] font-bold text-dark shadow-md hover:bg-dark-0 hover:text-light`}
              >
                Edit
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(FloatingActionButtons)
