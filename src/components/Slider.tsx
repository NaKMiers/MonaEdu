'use client'

import Image from 'next/image'
import React, { Children, memo, useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface SliderProps {
  time?: number
  children: React.ReactNode
  className?: string
  hideControls?: boolean
  thumbs?: string[]
  mobile?: boolean
}

function Slider({ time, hideControls, children, thumbs = [], mobile, className = '' }: SliderProps) {
  // states
  const [slide, setSlide] = useState<number>(1)
  const [isSliding, setIsSliding] = useState<boolean>(false)
  const [touchStartX, setTouchStartX] = useState<number>(0)
  const [touchEndX, setTouchEndX] = useState<number>(0)

  // refs
  const slideTrackRef = useRef<HTMLDivElement>(null)

  // values
  const childrenAmount = Children.count(children)

  // MARK: Slide Functions
  // change slide main function
  useEffect(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.style.marginLeft = `calc(-100% * ${slide})`
    }
  }, [slide])

  // to next slide
  const nextSlide = useCallback(() => {
    // not sliding
    if (!isSliding) {
      // start sliding
      setIsSliding(true)

      if (slide === childrenAmount) {
        setSlide(childrenAmount + 1)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'none'
            setSlide(1)
          }
        }, 310)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'all 0.3s linear'
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
  }, [childrenAmount, isSliding, slide])

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
            setSlide(childrenAmount)
          }
        }, 310)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'all 0.3s linear'
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
  }, [childrenAmount, isSliding, slide])

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

  return (
    <div
      className={`group relative h-full w-full overflow-hidden rounded-lg ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* MARK: Slide Track */}
      <div
        className={`no-scrollbar trans-300 flex h-full w-full cursor-pointer ease-linear`}
        style={{ marginLeft: '-100%' }}
        ref={slideTrackRef}
      >
        {[
          Children.toArray(children)[childrenAmount - 1],
          ...Children.toArray(children),
          Children.toArray(children)[0],
        ].map((child, index) => (
          <div
            key={index}
            className="h-full w-full shrink-0"
          >
            {child}
          </div>
        ))}
      </div>

      {/* MARK: Next - Previous */}
      {!hideControls && childrenAmount >= 2 && (
        <>
          <button
            className="trans-200 group absolute left-0 top-0 flex h-full w-12 items-center justify-center hover:bg-slate-100 hover:bg-opacity-10 group-hover:translate-x-0 md:-translate-x-full"
            onClick={prevSlide}
          >
            <FaChevronLeft
              size={16}
              className="wiggle text-light"
            />
          </button>
          <button
            className="trans-200 group absolute right-0 top-0 flex h-full w-12 items-center justify-center hover:bg-slate-100 hover:bg-opacity-10 group-hover:translate-x-0 md:translate-x-full"
            onClick={nextSlide}
          >
            <FaChevronRight
              size={16}
              className="wiggle text-light"
            />
          </button>
        </>
      )}

      {/* MARK: Indicators */}
      {thumbs.length >= 2 && (
        <div
          className={`absolute z-10 w-full px-21 ${
            mobile ? 'gap-6' : 'gap-5'
          } trans-200 bottom-[6%] left-1/2 flex -translate-x-1/2 items-center justify-center group-hover:bottom-[6%] group-hover:translate-y-0 md:bottom-0 md:translate-y-full`}
        >
          {thumbs.map((src, index) => {
            return (
              <button
                className={`${
                  mobile ? 'aspect-[9/16]' : 'aspect-video'
                } trans-200 overflow-hidden rounded-lg border-2 border-light shadow-md hover:-translate-y-1 hover:scale-105 hover:opacity-100 ${
                  slide === index + 1 ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => setSlide(index + 1)}
                key={src}
              >
                <Image
                  className="h-full w-full object-cover"
                  src={src}
                  width={mobile ? 40 : 70}
                  height={mobile ? 70 : 40}
                  alt="slide-thumb"
                />
              </button>
            )
          })}
        </div>
      )}
      {childrenAmount >= 2 && thumbs.length <= 0 && (
        <div className="trans-200 absolute bottom-[10%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-5 group-hover:bottom-[10%] group-hover:translate-y-0 md:bottom-0 md:translate-y-full">
          {Array.from({ length: childrenAmount }).map((_, index) => {
            return (
              <button
                key={index}
                className={`trans-200 h-[14px] w-[14px] rounded-full bg-white shadow-md hover:bg-opacity-100 ${
                  slide === index + 1 ? 'bg-opacity-100' : 'bg-opacity-50'
                }`}
                onClick={() => setSlide(index + 1)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default memo(Slider)
