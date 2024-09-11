'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addToCartApi, likeCourseApi } from '@/requests'
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
import { CardBody, CardContainer, CardItem } from './effects/3dCard'
import Divider from './Divider'
import BuyNowButton from './admin/BuyNowButton'

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

interface BestSellerCardProps {
  course: ICourse
  index: number
  className?: string
}

function BestSellerCard({ course: data, index, className = '' }: BestSellerCardProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user
  const router = useRouter()

  // reducer
  const dispatch = useAppDispatch()

  // states
  const [course, setCourse] = useState<ICourse>(data)
  const [showActions, setShowActions] = useState<boolean>(false)
  const [showActions2, setShowActions2] = useState<boolean>(false)
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
      placement='right-start'
      arrow
      enterDelay={120}
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

          <p className='text-xs text-slate-600'>{duration(course.duration, 'long')} tổng thời lượng</p>

          <Divider size={2} />

          <p className='font-body tracking-wider'>{course.textHook}</p>

          <Divider size={4} />
          <div className='flex items-center gap-1 w-full'>
            <BuyNowButton course={course} />

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
      <div className='w-full'>
        <CardContainer className='inter-var w-full'>
          <CardBody className='w-full flex flex-col relative group/card dark:hover:shadow-2xl rounded-xl'>
            <CardItem className='w-full' translateZ={100} rotateX={20} rotateZ={-10}>
              <Link
                href={`/${course.slug}`}
                className='block w-full aspect-video shadow-lg rounded-lg overflow-hidden'
              >
                <Image
                  className='w-full h-full object-cover group-hover:scale-105 trans-500'
                  src={course.images[0]}
                  width={300}
                  height={300}
                  alt={course.title}
                />
              </Link>
            </CardItem>

            <CardItem
              translateZ={120}
              className='relative w-full rounded-lg px-21 pt-4 pb-4 gap-21 bg-white'
            >
              <p className='text-xs text-slate-400'>Học viên: {course.joined}</p>
              <p className='font-semibold text-sm text-ellipsis line-clamp-2 mt-1'>{course.title}</p>

              {index <= 2 && (
                <CardItem
                  translateZ={50}
                  className='hidden xs:block absolute w-[50px] h-[50px] right-8 -top-5'
                >
                  <Image
                    className='w-full h-full object-cover'
                    src={`/icons/top-${index + 1}-badge.png`}
                    fill
                    alt='badge'
                  />
                </CardItem>
              )}
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </HtmlTooltip>
  )
}

export default memo(BestSellerCard)
