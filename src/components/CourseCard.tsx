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
import { CardBody, CardContainer, CardItem } from '@/components/3dCard'

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
      router.push(`/cart?course=${course.slug}`)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop page loading
      dispatch(setPageLoading(false))
    }
  }, [course._id, dispatch, course.slug, router])

  return (
    <CardContainer className='inter-var'>
      <CardBody className='flex flex-col bg-neutral-800 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:border-white/[0.2] border-black/[0.1] h-full rounded-xl p-2.5 md:p-4 border'>
        {course.oldPrice && !hideBadge && (
          <CardItem
            translateZ='35'
            className='absolute -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 px-1 py-0.5 text-dark font-semibold font-body text-center text-[12px] leading-4'
          >
            Sale{' '}
            {countPercent(
              applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
              course.oldPrice
            )}
          </CardItem>
        )}

        <Divider size={2} />

        <CardItem translateZ='50' className='text-xl font-bold text-neutral-600 dark:text-white'>
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
          translateZ='60'
          className='text-ellipsis line-clamp-2 text-xs md:text-sm mb-2 text-neutral-300'
          title={course.description}
        >
          {course.description}
        </CardItem>

        <CardItem translateZ='100' className='w-full'>
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
        </CardItem>

        <Divider size={2} />

        {/* <CardItem translateZ={75} className='w-full flex flex-wrap gap-1'>
          {course.categories.map(cat => (
            <Link
              href={`/courses?ctg=${(cat as ICategory).slug}`}
              key={(cat as ICategory).slug}
              className='text-[10px] text-nowrap text-ellipsis max-w-[80px] sm:max-w-max block line-clamp-1 font-semibold font-body tracking-wide text-dark px-1.5 py-0.5 shadow rounded-lg bg-sky-300'
            >
              {(cat as ICategory).title}
            </Link>
          ))}
        </CardItem> */}

        <Divider size={2} />

        <CardItem translateZ='40' className='w-full text-xl font-bold text-neutral-600 dark:text-white'>
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
              className='font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-white border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1'
              onClick={e => {
                if (curUser?.courses.map((course: any) => course.course).includes(course._id)) {
                  router.push(`/learning/${course?._id}/continue`)
                } else {
                  buyNow()
                }
              }}
            >
              <span className='block text-xs sm:text-sm md:text-base text-ellipsis text-nowrap line-clamp-1 max-w-[60px] sm:max-w-max'>
                {curUser?._id &&
                curUser?.courses.map((course: any) => course.course).includes(course._id)
                  ? 'Tiếp tục học'
                  : 'Mua ngay'}
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
                <div className='pl-3 text-white relative flex justify-center items-center w-full h-[42px]'>
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
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  )
}

export default CourseCard
