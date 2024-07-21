'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addToCartApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface BannerProps {
  courses: ICourse[]
  className?: string
}

function Banner({ courses, className = '' }: BannerProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const router = useRouter()

  // ref
  const carouselRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const timeout = useRef<any>(null)
  const interval = useRef<any>(null)

  // values
  const time = 2000

  // methods
  const handleSlide = useCallback((type: 'prev' | 'next') => {
    if (!carouselRef.current || !listRef.current || !thumbnailsRef.current) return
    clearInterval(interval.current)
    const slideItems = listRef.current.children
    const thumbItems = thumbnailsRef.current.children

    if (type === 'next') {
      listRef.current?.appendChild(slideItems[0])
      thumbnailsRef.current?.appendChild(thumbItems[0])
      carouselRef.current?.classList.add('next')
    } else {
      listRef.current?.prepend(slideItems[slideItems.length - 1])
      thumbnailsRef.current?.prepend(thumbItems[thumbItems.length - 1])
      carouselRef.current?.classList.add('prev')
    }

    // timeout
    clearTimeout(timeout.current)
    setTimeout(() => {
      carouselRef.current?.classList.remove('prev')
      carouselRef.current?.classList.remove('next')
    }, time)
  }, [])

  const prevSlide = useCallback(() => {
    handleSlide('prev')
  }, [handleSlide])

  const nextSlide = useCallback(() => {
    handleSlide('next')
  }, [handleSlide])

  // auto slide
  useEffect(() => {
    setTimeout(() => {
      interval.current = setInterval(() => {
        nextSlide()
      }, time * 5)
    }, time * 2)
  }, [nextSlide])

  // MARK: Buy
  // handle buy now (add to cart and move to cart page)
  const buyNow = useCallback(
    async (course: ICourse) => {
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
    },
    [dispatch, router]
  )

  return (
    <div
      className={`carousel mt-[-72px] relative w-full h-[calc(100vh)] overflow-hidden shadow-medium-light ${className}`}
      ref={carouselRef}
    >
      {/* List Items */}
      <div className='list bg-white' ref={listRef}>
        {courses.map(course => (
          <div className='item absolute inset-0' key={course._id}>
            <div className='w-full h-full'>
              <Image
                className='img w-full h-full object-cover object-right brightness-[0.8]'
                src={course.images[0]}
                width={1920}
                height={1080}
                alt='item'
                quality={100}
                loading='lazy'
              />
            </div>
            <div className='content absolute top-[20%] md:top-[15%] left-1/2 -translate-x-1/2 max-w-[1200px] px-21 w-full drop-shadow-2xl text-white'>
              <div className='max-w-[700px] w-full'>
                <div className='author font-bold tracking-[10px] drop-shadow-lg uppercase'>
                  {course.author}
                </div>
                <div
                  className='title font-bold text-[30px] md:text-[3em] leading-[1.3em] drop-shadow-md stroke-neutral-950 stroke-2 text-ellipsis line-clamp-2'
                  title={course.title}
                >
                  {course.title}
                </div>

                <div className='desc drop-shadow-md font-body tracking-wider pr-[20%] text-ellipsis line-clamp-4'>
                  {course.textHook}
                </div>
                <div className='buttons flex flex-wrap gap-1.5 mt-5'>
                  <Link
                    href={`/${course.slug}`}
                    className='h-10 flex items-center justify-center px-2 shadow-md text-dark bg-slate-100 font-semibold font-body tracking-wider rounded-md hover:bg-dark-0 hover:text-white trans-200'
                  >
                    CHI TIẾT
                  </Link>
                  <button
                    onClick={e => {
                      if (curUser?.courses.map((course: any) => course.course).includes(course._id)) {
                        router.push(`/learning/${course?.slug}/continue`)
                      } else {
                        buyNow(course)
                      }
                    }}
                    className='h-10 flex items-center justify-center px-2 shadow-md text-white border-2 border-white font-semibold font-body tracking-wider rounded-md hover:bg-white hover:text-dark trans-200 uppercase'
                  >
                    {curUser?._id &&
                    curUser?.courses.map((course: any) => course.course).includes(course._id)
                      ? 'Học tiếp'
                      : 'Mua ngay'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      {!!courses.length && (
        <div
          className='thumbnails absolute bottom-[50px] left-1/2 z-10 flex gap-21 text-white'
          ref={thumbnailsRef}
        >
          {[...courses.slice(1), courses[0]].map(course => (
            <div
              className='item relative w-[150px] h-[220px] flex-shrink-0 overflow-hidden rounded-medium'
              key={course._id}
            >
              <Image
                className='img w-full h-full object-cover'
                src={course.images[0]}
                width={300}
                height={300}
                alt='item'
              />
              <div className='content absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 px-3 py-1 text-sm rounded-t-lg text-dark'>
                <div className='title font-semibold'>{course.title}</div>
                <div className='description drop-shadow-lg'>{course.joined} students</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Arrows */}
      <div className='arrows absolute bottom-[50px] left-[10%] md:left-1/3 flex gap-4'>
        <button
          className='prev flex items-center justify-center w-12 h-12 rounded-full text-dark border border-dark bg-white shadow-lg z-10 hover:bg-dark-0 hover:text-white trans-200'
          onClick={prevSlide}
        >
          <FaChevronLeft size={16} />
        </button>
        <button
          className='next flex items-center justify-center w-12 h-12 rounded-full text-dark border border-dark bg-white shadow-lg z-10 hover:bg-dark-0 hover:text-white trans-200'
          onClick={nextSlide}
        >
          <FaChevronRight size={16} />
        </button>
      </div>

      {/* Duration */}
      <div className='time w-0 h-1 bg-sky-500 absolute top-0 left-0 z-10' />
    </div>
  )
}

export default memo(Banner)
