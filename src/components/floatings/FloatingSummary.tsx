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
import BuyNowButton from '../admin/BuyNowButton'

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
    <div className={`max-h-[calc(100vh-100px)] overflow-y-auto px-4 ${className}`}>
      {/* Thumbnails */}
      <div className="group relative -mx-4 block aspect-video overflow-hidden rounded-lg shadow-lg">
        <div className="trans-500 flex w-full snap-x snap-mandatory overflow-x-scroll hover:scale-105">
          {course?.images.slice(0, course.images.length === 1 ? 1 : -1).map(src => (
            <Image
              className="h-full w-full flex-shrink-0 snap-start object-cover"
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

      <div className="h-full overflow-y-auto">
        {/* Price */}
        <Price
          price={course.price}
          oldPrice={course.oldPrice}
          flashSale={course.flashSale as IFlashSale}
          className="border-2"
        />

        <Divider size={4} />

        {/* Action Buttons */}
        <div className="flex w-full items-center gap-1">
          <BuyNowButton course={course} />

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
            <div className="relative flex h-[42px] w-[30px] items-center justify-end text-light">
              <button
                className="group"
                onClick={() => setShowActions(prev => !prev)}
              >
                <HiDotsVertical
                  size={24}
                  className="text-dark"
                />
              </button>
              <div
                className={`${
                  showActions ? 'max-h-[40px] max-w-[120px] px-1.5 py-1' : 'max-h-0 max-w-0 p-0'
                } trans-300 absolute top-[80%] z-20 flex gap-2 overflow-hidden rounded-md`}
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

        <Divider size={4} />

        {/* Like & Share */}
        <div className="flex h-[28px]">
          <div className="flex w-full items-center justify-center border-r-2 border-slate-300">
            <button className="group -mb-1 flex items-center justify-center">
              <span className="mr-1.5 font-semibold">{course.likes.length}</span>{' '}
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
          </div>

          <div className="flex w-full items-center justify-center">
            <FacebookShareButton
              url={`https://monaedu.com/${course.slug}`}
              hashtag="#monaedu"
            >
              <FaShareAlt size={16} />
            </FacebookShareButton>
          </div>
        </div>

        <Divider
          size={5}
          border
        />

        {/* Tags */}
        <p className="font-body">
          Thẻ:{' '}
          {(course.tags as ITag[]).map((tag, index) => (
            <Fragment key={tag._id}>
              <Link
                href={`/tags/${tag.slug}`}
                key={tag._id}
                className="text-sky-500 underline-offset-1 hover:underline"
              >
                {tag.title}
              </Link>
              <span className="text-sky-500">{index !== course.tags.length - 1 ? ', ' : ''}</span>
            </Fragment>
          ))}
        </p>

        <Divider
          size={5}
          border
        />

        <div className="font-body tracking-wider">
          <p className="font-semibold">Khóa học gồm có: </p>

          <p className="flex flex-wrap items-center">
            <MdVideoLibrary
              size={16}
              className="mr-3"
            />
            <span>
              {chapters.length} chương,{' '}
              {chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)} bài giảng
            </span>
          </p>
          <p className="flex flex-wrap items-center">
            <IoTimer
              size={16}
              className="mr-3"
            />
            <span className="mr-1">Thời lượng: </span>
            <span>
              {totalTime.hours > 0 && `${totalTime.hours} giờ`}{' '}
              {totalTime.minutes > 0 && `${totalTime.minutes} phút`}
            </span>
          </p>
          <p className="flex flex-wrap items-center">
            <IoIosPhonePortrait
              size={16}
              className="mr-3"
            />
            <span>Tương thích trên mọi thiết bị</span>
          </p>
        </div>

        <Divider size={8} />
      </div>
    </div>
  )
}

export default memo(FloatingSummary)
