'use client'

import { useAppDispatch } from '@/libs/hooks'
import { ICourse } from '@/models/CourseModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import BannerItem from './BannerItem'

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
  const [isChanging, setIsChanging] = useState<boolean>(false)

  // refs
  const slideTrackRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // MARK: Slide Functions
  const changeSlide = useCallback((value: number) => {
    const slideTrack = slideTrackRef.current
    const indicator = indicatorRef.current

    if (slideTrack && indicator) {
      setIsChanging(true)
      const slideWidth = slideTrack.children[0].clientWidth

      slideTrack.scrollTo({
        left: slideWidth * (value - 1),
        behavior: 'smooth',
      })

      if (indicator) {
        indicator.scrollTo({
          left: indicator.children[0].clientWidth * (value - 1),
          behavior: 'smooth',
        })
      }

      setSlide(value)

      setTimeout(() => {
        setIsChanging(false)
      }, 500)
    }
  }, [])

  // to previous slide
  const prevSlide = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft - slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // to next slide
  const nextSlide = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft + slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // catch event scroll slider to set current slide
  useEffect(() => {
    const slideTrack = slideTrackRef.current
    const indicator = indicatorRef.current

    if (!slideTrack || !indicator) return

    const handleSetSlide = () => {
      if (isChanging) return

      const slideWidth = slideTrack.children[0].clientWidth
      const slideIndex = Math.round(slideTrack.scrollLeft / slideWidth) + 1

      setSlide(slideIndex)

      // set scroll left for indicatorRef
      if (indicator) {
        indicator.scrollTo({
          left: indicator.children[0].clientWidth * (slideIndex - 1),
          behavior: 'smooth',
        })
      }
    }

    slideTrackRef.current.addEventListener('scroll', handleSetSlide)

    return () => {
      slideTrack.removeEventListener('scroll', handleSetSlide)
    }
  }, [isChanging])

  // next slide by time
  useEffect(() => {
    if (time) {
      const interval = setInterval(() => {
        nextSlide()
      }, time)

      return () => clearInterval(interval)
    }
  }, [time, nextSlide])

  return (
    <div className={`relative w-full h-screen overflow-hidden group mt-[-72px] ${className}`}>
      {/* MARK: Slide Track */}
      <div
        className={`flex w-full h-full no-scrollbar ease-linear overflow-x-auto snap-x snap-mandatory`}
        ref={slideTrackRef}
      >
        {courses.map(course => (
          <BannerItem course={course} key={course._id} />
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
                onClick={() => changeSlide(index + 1)}
                key={course._id}
              >
                <Image
                  className='w-full h-full object-cover'
                  src={course.images[0]}
                  width={200}
                  height={200}
                  alt={course.title}
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
