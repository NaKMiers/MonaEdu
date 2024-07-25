'use client'

import { CardBody, CardContainer, CardItem } from '@/components/3dCard'
import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { addToCartApi, likeCourseApi } from '@/requests'
import { applyFlashSalePrice, countPercent } from '@/utils/number'
import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus, FaRegThumbsUp, FaShareAlt } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { IoTimer } from 'react-icons/io5'
import { MdVideoLibrary } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import Divider from './Divider'
import Price from './Price'
import { FacebookShareButton } from 'react-share'
import { PiStudentBold } from 'react-icons/pi'

interface CourseCardProps {
  course: ICourse
  hideBadge?: boolean
  className?: string
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'transparent',
    // color: 'rgba(0, 0, 0, 0.87)',
    // maxWidth: 220,
    // fontSize: theme.typography.pxToRem(12),
    // border: '1px solid #dadde9',
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
    <HtmlTooltip
      placement='right-start'
      arrow
      title={
        <div className='p-21/2 border border-slate-600 rounded-xl bg-white text-dark'>
          <h1 className='font-semibold text-xl leading-6'>{course?.title}</h1>

          <Divider size={2} />

          <div className='flex items-center flex-wrap gap-3'>
            <button className='flex justify-center items-center gap-1.5 group'>
              <FaRegThumbsUp
                size={16}
                className={`${
                  !course.likes.includes(curUser?._id)
                    ? 'text-dark group-hover:text-rose-500'
                    : 'text-rose-500 group-hover:text-dark'
                } trans-200`}
                onClick={handleLike}
              />
              <span className='font-semibold text-base'>{course.likes.length}</span>{' '}
            </button>

            <div className='w-px h-5 bg-slate-300 rounded-lg' />

            <div className='flex justify-center items-center gap-1.5'>
              <PiStudentBold size={16} />
              <span className='font-semibold text-base'>{course.joined}</span>
            </div>

            <div className='w-px h-5 bg-slate-300 rounded-lg' />

            <div className='flex justify-center items-center'>
              <FacebookShareButton url={`https://monaedu.com/${course.slug}`} hashtag='#mona'>
                <FaShareAlt size={16} />
              </FacebookShareButton>
            </div>
          </div>

          <Divider size={2} />

          <p className='font-body tracking-wider'>{course.textHook}</p>

          <Divider size={4} />
          <div className='flex items-center gap-1 w-full'>
            <button
              className='font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-white border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1 px-2'
              onClick={buyNow}
            >
              <span className='block sm:text-sm md:text-base text-ellipsis text-nowrap line-clamp-1 sm:max-w-max'>
                Mua ngay
              </span>
            </button>

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

            {curUser?._id &&
              curUser.courses.map((course: any) => course.course).includes(course._id) && (
                <div className='text-white relative flex justify-end items-center w-[30px] h-[42px]'>
                  <button className='group' onClick={() => setShowActions2(prev => !prev)}>
                    <HiDotsVertical size={24} className='wiggle text-dark' />
                  </button>
                  <div
                    className={`${
                      showActions2 ? 'max-w-[100px] max-h-[40px] px-1.5 py-1' : 'max-w-0 max-h-0 p-0'
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
        </div>
      }
    >
      <div className='h-full'>
        <CardContainer className={`inter-var ${className}`}>
          <CardBody className='flex flex-col bg-neutral-800 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:border-white/[0.2] border-black/[0.1] h-full rounded-xl p-2.5 md:p-4 border'>
            {course.oldPrice && !hideBadge && (
              <CardItem
                translateZ='35'
                className='absolute -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 px-1 py-0.5 text-dark font-semibold font-body text-center text-[12px] leading-4'
              >
                Giảm{' '}
                {countPercent(
                  applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
                  course.oldPrice
                )}
              </CardItem>
            )}

            <Divider size={2} />

            <CardItem translateZ={50} className='text-xl font-bold text-neutral-600 dark:text-white'>
              <Link
                href={`/${course.slug}`}
                prefetch={false}
                className='font-body text-[14px] md:text-[21px] tracking-wider leading-[18px] md:leading-[24px] mb-1 md:mb-2 text-ellipsis line-clamp-2'
                title={course.title}
              >
                {course.title}
              </Link>
            </CardItem>

            <CardItem
              as='p'
              translateZ={30}
              className='text-ellipsis line-clamp-2 text-xs md:text-sm mb-2 text-neutral-300'
              title={course.textHook}
            >
              {course.textHook}
            </CardItem>

            <CardItem translateZ={80} className='w-full'>
              <Link
                href={`/${course.slug}`}
                prefetch={false}
                className='relative aspect-video rounded-lg overflow-hidden shadow-lg block group'
              >
                <div className='flex w-full overflow-x-scroll snap-x snap-mandatory hover:scale-105 trans-500'>
                  {course.images.map(src => (
                    <Image
                      className='flex-shrink-0 snap-start w-full h-full object-cover'
                      src={src}
                      width={320}
                      height={320}
                      alt='netflix'
                      loading='lazy'
                      key={src}
                    />
                  ))}
                </div>
              </Link>
            </CardItem>

            <Divider size={2} />

            <CardItem
              translateZ={40}
              className='w-full text-xl font-bold text-neutral-600 dark:text-white'
            >
              <Price
                price={course.price}
                oldPrice={course.oldPrice}
                flashSale={course.flashSale as IFlashSale}
                className='border-2'
              />
            </CardItem>

            <Divider size={4} />

            <div className='flex flex-1 items-end justify-between'>
              <CardItem translateZ={80} className='flex items-center gap-1 w-full'>
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
                    {curUser?._id &&
                    curUser?.courses.map((course: any) => course.course).includes(course._id)
                      ? 'Học tiếp'
                      : 'Mua ngay'}
                  </span>
                </button>

                {(!curUser ||
                  !curUser.courses?.map((course: any) => course.course).includes(course._id)) && (
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

                {curUser?._id &&
                  curUser.courses.map((course: any) => course.course).includes(course._id) && (
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
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </HtmlTooltip>
  )
}

export default memo(CourseCard)
