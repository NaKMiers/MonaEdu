'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addToCartApi, likeCourseApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus, FaRegThumbsUp, FaShareAlt } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { RiDonutChartFill } from 'react-icons/ri'
import { FacebookShareButton } from 'react-share'

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
    if (!curUser?._id) return
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
      <div className='flex items-center gap-2 sm:gap-2.5 mr-1 sm:mr-2.5'>
        <button className='flex items-center justify-center group'>
          <span className='hidden sm:block mr-1.5 font-semibold'>{course.likes.length}</span>{' '}
          <FaRegThumbsUp
            size={16}
            className={`${
              !course.likes.includes(curUser?._id)
                ? 'text-dark group-hover:text-rose-500'
                : 'text-rose-500 group-hover:text-dark'
            } -mt-1 trans-200`}
            onClick={handleLike}
          />
        </button>

        <FacebookShareButton url={`https://monaedu.com/${course.slug}`} hashtag='#monaedu'>
          <div className='flex justify-center items-center w-full'>
            <FaShareAlt size={16} />
            <span className='hidden sm:block font-semibold ml-1.5 text-nowrap'>Chia sẻ</span>
          </div>
        </FacebookShareButton>
      </div>

      {/* Price */}
      <div className='flex flex-col justify-center tracking-tighter text-dark font-semibold pl-2 sm:px-4 border-l'>
        <span className='font-bold leading-4 text-sm sm:text-[18px]'>
          {formatPrice(course.price * 1000)}
        </span>
        {course.oldPrice && (
          <span className='line-through leading-4 text-slate-400 text-[10px] sm:text-sm'>
            {formatPrice(course.oldPrice * 1000)}
          </span>
        )}
      </div>

      {/* Buy Now */}
      <button
        className='font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-white border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1 px-2'
        onClick={e => {
          if (curUser?.courses.map((course: any) => course.course).includes(course._id)) {
            router.push(`/learning/${course?.slug}/continue`)
          } else {
            buyNow()
          }
        }}
      >
        <span className='block sm:text-sm md:text-base text-ellipsis text-nowrap line-clamp-1 sm:max-w-max'>
          {curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
            ? 'Học tiếp'
            : 'Mua ngay'}
        </span>
      </button>

      {/* Add To Cart */}
      {(!curUser || !curUser?.courses?.map((course: any) => course.course).includes(course._id)) && (
        <button
          className={`group font-semibold h-[42px] px-3 flex items-center justify-center rounded-lg shadow-lg bg-dark-100 border-2 border-dark hover:bg-white trans-300 hover:-translate-y-1 ${
            isLoading ? 'pointer-events-none bg-slate-200' : ''
          }`}
          onClick={addCourseToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <RiDonutChartFill size={18} className='animate-spin text-dark' />
          ) : (
            <FaCartPlus className='text-[18px] sm:text-[20px] wiggle text-white group-hover:text-dark' />
          )}
        </button>
      )}

      {curUser?._id && curUser.courses.map((course: any) => course.course).includes(course._id) && (
        <div className='text-white relative flex justify-end items-center w-[30px] h-[42px]'>
          <button className='group' onClick={() => setShowActions(prev => !prev)}>
            <HiDotsVertical size={24} className='wiggle' />
          </button>
          <div
            className={`${
              showActions ? 'max-w-[100px] max-h-[40px] px-1.5 py-1' : 'max-w-0 max-h-0 p-0'
            }  overflow-hidden absolute z-20 top-[80%] flex gap-2 rounded-md trans-300`}
          >
            <button
              className={`font-bold text-nowrap px-1.5 py-1 text-[10px] bg-white hover:bg-dark-0 hover:text-white border border-dark text-dark rounded-md shadow-md trans-200`}
              onClick={buyNow}
            >
              Mua tặng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(FloatingActionButtons)
