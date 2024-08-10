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
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface SliderProps {
  courses: ICourse[]
  time?: number
  className?: string
}

function Banner({ time, courses, className = '' }: SliderProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const router = useRouter()

  // states
  const [slide, setSlide] = useState<number>(1)
  const [isSliding, setIsSliding] = useState<boolean>(false)
  const [touchStartX, setTouchStartX] = useState<number>(0)
  const [touchEndX, setTouchEndX] = useState<number>(0)

  // refs
  const slideTrackRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // MARK: Slide Functions
  // change slide main function
  useEffect(() => {
    if (slideTrackRef.current && indicatorRef.current) {
      slideTrackRef.current.style.marginLeft = `calc(-100% * ${slide})`
      indicatorRef.current.scrollTo({
        left: (slide - 1) * indicatorRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [slide])

  // to next slide
  const nextSlide = useCallback(() => {
    // not sliding
    if (!isSliding) {
      // start sliding
      setIsSliding(true)

      if (slide === courses.length) {
        setSlide(courses.length + 1)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'none'
            setSlide(1)
          }
        }, 310)

        setTimeout(() => {
          if (slideTrackRef.current) {
            // slideTrackRef.current.style.transition = 'all 0.3s linear'
          }
        }, 350)
      } else {
        setSlide(prev => prev + 1)
      }

      // stop sliding after slided
      setTimeout(() => {
        setIsSliding(false)
      }, 350)
    }
  }, [courses.length, isSliding, slide])

  // to previous slide
  const prevSlide = useCallback(() => {
    // if not sliding
    if (!isSliding) {
      // start sliding
      setIsSliding(true)

      if (slide === 1) {
        setSlide(0)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'none'
            setSlide(courses.length)
          }
        }, 310)

        setTimeout(() => {
          if (slideTrackRef.current) {
            // slideTrackRef.current.style.transition = 'all 0.3s linear'
          }
        }, 350)
      } else {
        setSlide(prev => prev - 1)
      }

      // stop sliding after slided
      setTimeout(() => {
        setIsSliding(false)
      }, 350)
    }
  }, [courses.length, isSliding, slide])

  // next slide by time
  useEffect(() => {
    if (time) {
      const interval = setInterval(() => {
        nextSlide()
      }, time)

      return () => clearInterval(interval)
    }
  }, [time, nextSlide])

  // MARK: Touch Events
  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    setTouchEndX(event.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const touchDiff = touchStartX - touchEndX
    if (touchDiff > 0 && touchDiff > 50) {
      nextSlide() // Swiped left
    } else if (touchDiff < 0 && touchDiff < -50) {
      prevSlide() // Swiped right
    }
  }

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
      className={`relative w-full h-screen overflow-hidden group mt-[-72px] ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* MARK: Slide Track */}
      <div
        className={`flex w-full h-full no-scrollbar ease-linear`}
        style={{ marginLeft: '-100%' }}
        ref={slideTrackRef}
      >
        {[courses[courses.length - 1], ...courses, courses[0]].map(course => (
          <div className='relative flex-shrink-0 w-full h-full' key={course._id}>
            <div className='w-full h-full'>
              <Image
                className='img w-full h-full object-cover object-right brightness-[0.8]'
                src={course.images[0]}
                width={1920}
                height={1080}
                alt='item'
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

      {/* Arrows */}
      <div className='arrows absolute z-20 bottom-[50px] left-[10%] md:left-[30%] flex gap-4'>
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

      {/* MARK: Indicators */}
      {courses.length >= 2 && (
        <div
          className={`absolute z-10 left-[43%] w-[57%] p-21 flex items-center bottom-[0] trans-300 overflow-x-auto no-scrollbar snap-x snap-mandatory`}
          ref={indicatorRef}
        >
          {courses.map((course, index) => (
            <div className='p-21/2 flex-shrink-0 snap-start' key={course._id}>
              <button
                className={`relative max-w-[200px] aspect-video rounded-lg border-2 ${
                  slide === index + 1 ? 'shadow-primary shadow-lg' : 'border-white shadow-md'
                } trans-300 hover:opacity-100 hover:scale-105 hover:-translate-y-1 overflow-hidden`}
                onClick={() => setSlide(index + 1)}
                key={course._id}
              >
                <Image
                  className='w-full h-full object-cover'
                  src={course.images[0]}
                  width={200}
                  height={200}
                  alt='slide-thumb'
                />

                <div
                  className={`flex flex-col justify-center items-center absolute top-0 left-0 w-full h-full p-2 text-light bg-neutral-900 bg-opacity-40`}
                >
                  <div
                    className='text-xs font-bold tracking-[5px] drop-shadow-lg uppercase text-ellipsis line-clamp-1'
                    title={course.author}
                  >
                    {course.author}
                  </div>
                  <div
                    className='font-semibold drop-shadow-md text-ellipsis line-clamp-2'
                    title={course.title}
                  >
                    {course.title}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(Banner)
