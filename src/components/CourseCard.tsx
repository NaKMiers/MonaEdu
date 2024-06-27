'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { addToCartApi } from '@/requests'
import { applyFlashSalePrice, countPercent } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import Divider from './Divider'
import Price from './Price'
import { RiDonutChartFill } from 'react-icons/ri'

interface CourseCardProps {
  course: ICourse
  hideBadge?: boolean
  className?: string
}

function CourseCard({ course, hideBadge, className = '' }: CourseCardProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const router = useRouter()

  // states
  const [showActions, setShowActions] = useState<boolean>(false)

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // MARK: Add
  // add course to cart - DATABASE
  const addCourseToCart = useCallback(async () => {
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
  }, [dispatch, course._id])

  // MARK: Buy
  // handle buy now (add to cart and move to cart page)
  const buyNow = useCallback(async () => {
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
      router.push(`/cart?courseId=${course.slug}`)
    } catch (err: any) {
      console.log(err)
    }
  }, [course._id, dispatch, course.slug, router])

  return (
    <div
      className={`relative flex flex-col w-full h-full p-4 bg-white bg-opacity-80 shadow-lg rounded-xl hover:-translate-y-1 transition duration-500 ${className}`}
    >
      {/* MARK: Thumbnails */}
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
              width={350}
              height={350}
              alt='netflix'
              key={src}
            />
          ))}
        </div>
      </Link>

      {/* Badge */}
      {course.oldPrice && !hideBadge && (
        <div className='absolute z-10 -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 p-1 max-w-10 text-white font-semibold font-body text-center text-[13px] leading-4'>
          Sale{' '}
          {countPercent(
            applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
            course.oldPrice
          )}
        </div>
      )}

      {/* Title */}
      <Link href={`/${course.slug}`} prefetch={false}>
        <h3
          className='font-body text-[21px] text-dark tracking-wider leading-[22px] my-4'
          title={course.title}
        >
          {course.title}
        </h3>
      </Link>

      {/* Price */}
      <Price
        price={course.price}
        oldPrice={course.oldPrice}
        flashSale={course.flashSale as IFlashSale}
      />

      <Divider size={2} />

      {/* Categories */}
      <div className='flex flex-wrap gap-1'>
        {course.categories.map(cat => (
          <Link
            href={`/courses?ctg=${(cat as ICategory).slug}`}
            key={(cat as ICategory).slug}
            className='text-xs font-semibold font-body tracking-wide text-dark px-2 py-1 shadow rounded-lg bg-sky-300'
          >
            {(cat as ICategory).title}
          </Link>
        ))}
      </div>

      <Divider size={2} />

      <p className='font-body tracking-wider text-sm text-ellipsis line-clamp-2'>{course.description}</p>

      <Divider size={3} />

      <div className='flex-1 flex items-end'>
        <div className='flex w-full gap-3'>
          <button
            // href={
            //   curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
            //     ? `/learning/${course?._id}/continue`
            //     : `/checkout/${course?.slug}`
            // }
            className='font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-white border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1'
            onClick={buyNow}
          >
            {curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
              ? 'Tiếp tục học'
              : 'Mua ngay'}
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
              <FaCartPlus size={20} className='wiggle text-white group-hover:text-dark' />
            )}
          </button>

          {curUser?._id && curUser.courses.map((course: any) => course.course).includes(course._id) && (
            <div className='relative h-[42px] flex justify-end items-center pl-1'>
              <button className='group' onClick={() => setShowActions(prev => !prev)}>
                <HiDotsVertical size={24} className='wiggle' />
              </button>
              <div
                className={`${
                  showActions ? 'max-w-[100px] max-h-[40px] px-1.5 py-1' : 'max-w-0 max-h-0 p-0'
                }  overflow-hidden absolute z-20 top-[80%] flex gap-2 rounded-md trans-300`}
              >
                <Link
                  href={`/checkout/${course.slug}`}
                  className={`font-bold text-nowrap px-1.5 py-1 text-[10px] bg-white hover:bg-dark-0 hover:text-white border border-dark text-dark rounded-md shadow-md trans-200`}
                >
                  Buy as a gift
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider size={2} />
    </div>
  )
}

export default CourseCard
