'use client'

import { CardBody, CardContainer, CardItem } from '@/components/effects/3dCard'
import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { addToCartApi, likeCourseApi } from '@/requests'
import { applyFlashSalePrice, countPercent } from '@/utils/number'
import { duration } from '@/utils/time'
import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus, FaRegThumbsUp, FaShareAlt } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { PiStudentBold } from 'react-icons/pi'
import { RiDonutChartFill } from 'react-icons/ri'
import { FacebookShareButton } from 'react-share'
import Divider from './Divider'
import Price from './Price'
import BuyNowButton from './admin/BuyNowButton'

interface CourseCardProps {
  course: ICourse
  hideBadge?: boolean
  className?: string
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'transparent',
  },
}))

function CourseCard({ course: data, hideBadge, className = '' }: CourseCardProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const router = useRouter()

  // states
  const [course, setCourse] = useState<ICourse>(data)
  const [showActions, setShowActions] = useState<boolean>(false)
  const [showActions2, setShowActions2] = useState<boolean>(false)

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
  }, [dispatch, curUser?._id, course._id])

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
    <HtmlTooltip
      placement="right-start"
      arrow
      enterDelay={120}
      title={
        <div className="rounded-xl border border-slate-600 bg-white p-21/2 text-dark">
          <h1 className="text-xl font-semibold leading-6">{course?.title}</h1>

          <Divider size={2} />

          {/* Likes - Joined - Share */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="group flex items-center justify-center gap-1.5">
              <FaRegThumbsUp
                size={16}
                className={`${
                  !course.likes.includes(curUser?._id)
                    ? 'text-dark group-hover:text-rose-500'
                    : 'text-rose-500 group-hover:text-dark'
                } trans-200`}
                onClick={handleLike}
              />
              <span className="text-base font-semibold">{course.likes.length}</span>{' '}
            </button>

            <div className="h-5 w-px rounded-lg bg-slate-300" />

            <div className="flex items-center justify-center gap-1.5">
              <PiStudentBold size={16} />
              <span className="text-base font-semibold">{course.joined}</span>
            </div>

            <div className="h-5 w-px rounded-lg bg-slate-300" />

            <div className="flex items-center justify-center">
              <FacebookShareButton
                url={`https://monaedu.com/${course.slug}`}
                hashtag="#mona"
              >
                <FaShareAlt size={16} />
              </FacebookShareButton>
            </div>
          </div>

          <Divider size={2} />

          <p className="text-xs text-slate-600">{duration(course.duration, 'long')} tổng thời lượng</p>

          <Divider size={2} />

          <p className="font-body tracking-wider">{course.textHook}</p>

          <Divider size={4} />
          <div className="flex w-full items-center gap-1">
            <BuyNowButton course={course} />

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

            {curUser?._id &&
              curUser.courses.map((course: any) => course.course).includes(course._id) && (
                <div className="relative flex h-[42px] w-[30px] items-center justify-end text-light">
                  <button
                    className="group"
                    onClick={() => setShowActions2(prev => !prev)}
                  >
                    <HiDotsVertical
                      size={24}
                      className="wiggle text-dark"
                    />
                  </button>
                  <div
                    className={`${
                      showActions2 ? 'max-h-[40px] max-w-[120px] px-1.5 py-1' : 'max-h-0 max-w-0 p-0'
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
        </div>
      }
    >
      <div className="h-full">
        <CardContainer className={`inter-var ${className}`}>
          <CardBody className="group/card relative flex h-full flex-col rounded-xl border border-black/[0.1] bg-neutral-800 p-2.5 md:p-4 dark:border-light/[0.2] dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
            {course.oldPrice && !hideBadge && (
              <CardItem
                translateZ="35"
                className="absolute -left-2 -top-2 rounded-br-lg rounded-tl-lg bg-yellow-400 px-1 py-0.5 text-center font-body text-[12px] font-semibold leading-4 text-dark"
              >
                Giảm{' '}
                {countPercent(
                  applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
                  course.oldPrice
                )}
              </CardItem>
            )}

            <Divider size={2} />

            <CardItem
              translateZ={50}
              className="text-xl font-bold text-neutral-600 dark:text-light"
            >
              <Link
                href={`/${course.slug}`}
                prefetch={false}
                className="mb-1 line-clamp-2 text-ellipsis font-body text-[14px] leading-[20px] tracking-wider md:mb-2 md:text-[21px] md:leading-[28px]"
                title={course.title}
              >
                {course.title}
              </Link>
            </CardItem>

            <CardItem
              as="p"
              translateZ={30}
              className="mb-2 line-clamp-2 text-ellipsis text-xs text-neutral-300 md:text-sm"
              title={course.textHook}
            >
              {course.textHook}
            </CardItem>

            <CardItem
              translateZ={80}
              className="w-full"
            >
              <Link
                href={`/${course.slug}`}
                prefetch={false}
                className="group relative block aspect-video overflow-hidden rounded-lg shadow-lg"
              >
                <div className="trans-500 flex w-full snap-x snap-mandatory overflow-x-scroll hover:scale-105">
                  {course.images.slice(0, course.images.length === 1 ? 1 : -1).map(src => (
                    <Image
                      className="h-full w-full flex-shrink-0 snap-start object-cover"
                      src={src}
                      width={320}
                      height={320}
                      alt={course.title}
                      loading="lazy"
                      key={src}
                    />
                  ))}
                </div>
              </Link>
            </CardItem>

            <Divider size={2} />

            <CardItem
              translateZ={40}
              className="w-full text-xl font-bold text-neutral-600 dark:text-light"
            >
              <Price
                price={course.price}
                oldPrice={course.oldPrice}
                flashSale={course.flashSale as IFlashSale}
                className="border-2"
              />
            </CardItem>

            <Divider size={4} />

            <div className="flex flex-1 items-end justify-between">
              <CardItem
                translateZ={80}
                className="flex w-full items-center gap-1"
              >
                {/* Buy Now Button */}
                <BuyNowButton course={course} />

                {/* Add To Cart Button */}
                {(!curUser ||
                  !curUser.courses?.map((course: any) => course.course).includes(course._id)) && (
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

                {/* Buy As Gift Button */}
                {curUser?._id &&
                  curUser.courses.map((course: any) => course.course).includes(course._id) && (
                    <div className="relative flex h-[42px] w-[30px] items-center justify-end text-light">
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
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </HtmlTooltip>
  )
}

export default memo(CourseCard)
