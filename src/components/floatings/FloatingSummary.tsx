'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IChapter } from '@/models/ChapterModel'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { ITag } from '@/models/TagModel'
import { addToCartApi, likeCourseApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus, FaRegThumbsUp, FaShareAlt } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { IoIosPhonePortrait } from 'react-icons/io'
import { IoTimer } from 'react-icons/io5'
import { MdVideoLibrary } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import { FacebookShareButton } from 'react-share'
import Divider from '../Divider'
import Price from '../Price'

interface FloatingSummaryProps {
  course: ICourse
  chapters: IChapter[]
  totalTime: any
  className?: string
}

function FloatingSummary({ course: data, chapters, totalTime, className = '' }: FloatingSummaryProps) {
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
    <div className={`px-4 max-h-[calc(100vh-100px)] overflow-y-auto ${className}`}>
      {/* Thumbnails */}
      <div className='relative -mx-4 aspect-video rounded-lg overflow-hidden shadow-lg block group'>
        <div className='flex w-full overflow-x-scroll snap-x snap-mandatory hover:scale-105 trans-500'>
          {course?.images.map(src => (
            <Image
              className='flex-shrink-0 snap-start w-full h-full object-cover'
              src={src}
              width={320}
              height={320}
              alt={course.title}
              key={src}
            />
          ))}
        </div>
      </div>

      <Divider size={4} />

      <div className='overflow-y-auto h-full'>
        {/* Price */}
        <Price
          price={course.price}
          oldPrice={course.oldPrice}
          flashSale={course.flashSale as IFlashSale}
          className='border-2'
        />

        <Divider size={4} />

        {/* Action Buttons */}
        <div className='flex items-center gap-1 w-full'>
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
                <HiDotsVertical size={24} className='text-dark' />
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

        <Divider size={4} />

        {/* Like & Share */}
        <div className='flex h-[28px]'>
          <div className='flex justify-center items-center w-full border-r-2 border-slate-300'>
            <button className='flex items-center justify-center group -mb-1'>
              <span className='mr-1.5 font-semibold'>{course.likes.length}</span>{' '}
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
          </div>

          <div className='flex justify-center items-center w-full'>
            <FacebookShareButton url={`https://monaedu.com/${course.slug}`} hashtag='#mona'>
              <FaShareAlt size={16} />
            </FacebookShareButton>
          </div>
        </div>

        <Divider size={5} border />

        {/* Tags */}
        <p className='font-body'>
          Thẻ:{' '}
          {(course.tags as ITag[]).map((tag, index) => (
            <Fragment key={tag._id}>
              <Link
                href={`/tags?tag=${tag.slug}`}
                key={tag._id}
                className='text-sky-500 hover:underline underline-offset-1'
              >
                {tag.title}
              </Link>
              <span className='text-sky-500'>{index !== course.tags.length - 1 ? ', ' : ''}</span>
            </Fragment>
          ))}
        </p>

        <Divider size={5} border />

        <div className='font-body tracking-wider'>
          <p className='font-semibold'>Khóa học gồm có: </p>

          <p className='flex items-center flex-wrap'>
            <MdVideoLibrary size={16} className='mr-3' />
            <span>
              {chapters.length} chương,{' '}
              {chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)} bài giảng
            </span>
          </p>
          <p className='flex items-center flex-wrap'>
            <IoTimer size={16} className='mr-3' />
            <span className='mr-1'>Thời lượng: </span>
            <span>
              {totalTime.hours > 0 && `${totalTime.hours} giờ`}{' '}
              {totalTime.minutes > 0 && `${totalTime.minutes} phút`}
            </span>
          </p>
          <p className='flex items-center flex-wrap'>
            <IoIosPhonePortrait size={16} className='mr-3' />
            <span>Tương thích trên mọi thiết bị</span>
          </p>
        </div>

        <Divider size={8} />
      </div>
    </div>
  )
}

export default memo(FloatingSummary)
