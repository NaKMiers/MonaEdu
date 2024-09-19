import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { ICourse } from '@/models/CourseModel'
import { addToCartApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus } from 'react-icons/fa'
import { PiLightningFill } from 'react-icons/pi'
import { RiDonutChartFill } from 'react-icons/ri'

interface SearchResultItemProps {
  course: ICourse
  className?: string
}

function SearchResultItem({ course, className = '' }: SearchResultItemProps) {
  // hook
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

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

  return (
    <Link
      href={`/${course.slug}`}
      key={course._id}
      className={`flex gap-4 py-2 items-start rounded-lg p-2 hover:bg-slate-200 hover:text-dark text-light trans-200 ${className}`}
    >
      <div className='relative aspect-video flex-shrink-0'>
        <Image className='rounded-md' src={course.images[0]} width={70} height={70} alt={course.title} />

        {course.flashSale && (
          <PiLightningFill
            className='absolute -top-1.5 left-1 text-yellow-400 animate-bounce'
            size={16}
          />
        )}
      </div>

      <p className='w-full text-ellipsis line-clamp-2 font-body text-sm tracking-wide leading-5 -mt-0.5 trans-200'>
        {course.title}
      </p>

      <div className='flex-1 flex justify-end' onClick={e => e.preventDefault()}>
        <button
          className={`group font-semibold h-8 px-2.5 py-1 flex items-center justify-center rounded-md shadow-lg bg-light border-2 border-dark hover:bg-white trans-300 hover:-translate-y-1 ${
            isLoading ? 'pointer-events-none bg-slate-200' : ''
          }`}
          onClick={addCourseToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
          ) : (
            <FaCartPlus
              size={18}
              className='text-[18px] sm:text-[20px] wiggle text-light group-hover:text-dark'
            />
          )}
        </button>
      </div>
    </Link>
  )
}

export default memo(SearchResultItem)
