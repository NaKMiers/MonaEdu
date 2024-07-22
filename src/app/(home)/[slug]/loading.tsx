import Divider from '@/components/Divider'
import CourseCardX from '@/components/loading/CourseCardX'
import FloatingActionButtonsX from '@/components/loading/FloatingActionButtonsX'
import FloatingSummaryX from '@/components/loading/FloatingSummaryX'
import GroupCoursesX from '@/components/loading/GroupCoursesX'
import { Fragment } from 'react'
import { FaAngleRight } from 'react-icons/fa'

async function Loading() {
  return (
    <div className='bg-white md:-mt-8 -mb-28 md:-mb-8 md:pt-8 pb-36'>
      {/* MARK: Banner */}
      <div className='relative bg-neutral-800 text-light -mt-8 pt-8'>
        {/* <BeamsBackground /> */}

        {/* Container */}
        <div className='relative max-w-1200 mx-auto py-10'>
          <div className='lg:max-w-[calc(100%-300px-32px)] w-full px-21 overflow-hidden'>
            {/* Breadcrumb */}
            <div className='flex flex-wrap items-center'>
              {Array.from({ length: 4 }).map((_, index) => (
                <Fragment key={index}>
                  <div className='max-w-full w-[100px] h-5 my-0.5 rounded-md bg-slate-300 animate-pulse' />
                  {index < 3 && <FaAngleRight className='text-slate-300' />}
                </Fragment>
              ))}
            </div>

            {/* Thumbnails */}
            <div className='lg:hidden max-w-[500px] aspect-video rounded-lg overflow-hidden shadow-lg mt-8 animate-pulse bg-slate-300' />

            <Divider size={8} />

            {/* Title */}
            <div className='max-w-full w-[500px] h-8 my-0.5 bg-slate-300 animate-pulse rounded-md' />

            <Divider size={3} />

            {/* Hook */}
            <div className='h-5 max-w-full w-[700px] mb-1 bg-slate-300 animate-pulse rounded-md' />
            <div className='h-5 max-w-full w-[700px] bg-slate-300 animate-pulse rounded-md' />

            <Divider size={3} />

            {/* Author */}
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 mb-1'>
              <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[105px] h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[105px] h-5 bg-slate-300 animate-pulse' />
            </div>

            {/* Last Update*/}
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 mb-1'>
              <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[105px] h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[105px] h-5 bg-slate-300 animate-pulse' />
            </div>

            {/* Language */}
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 mb-1'>
              <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[105px] h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[105px] h-5 bg-slate-300 animate-pulse' />
            </div>

            {/* Tags */}
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 mb-1'>
              <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[75px] h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[75px] h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[75px] h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-md w-[75px] h-5 bg-slate-300 animate-pulse' />
            </div>

            {/* Price */}
            <div className='w-full max-w-[500px] h-9 bg-slate-300 rounded-md shadow-lg animate-pulse mt-3' />

            <Divider size={4} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='flex max-w-1200 mx-auto py-8 gap-8 px-21'>
        {/* Main */}
        <div className='mb-8 flex-1'>
          {/* MARK: Include */}
          <div className='lg:hidden mb-8'>
            <div className='h-8 my-0.5 max-w-[500px] w-full rounded-md bg-slate-700 animate-pulse' />

            <Divider size={3} />

            <div className='flex items-center flex-wrap gap-2 mb-1'>
              <div className='rounded-full w-5 h-5 bg-slate-500 animate-pulse' />
              <div className='rounded-md w-[80px] h-5 bg-slate-500 animate-pulse' />
              <div className='rounded-md w-[80px] h-5 bg-slate-500 animate-pulse' />
            </div>
            <div className='flex items-center flex-wrap gap-2 mb-1'>
              <div className='rounded-full w-5 h-5 bg-slate-500 animate-pulse' />
              <div className='rounded-md w-[80px] h-5 bg-slate-500 animate-pulse' />
            </div>
            <div className='flex items-center flex-wrap gap-2 mb-1'>
              <div className='rounded-full w-5 h-5 bg-slate-500 animate-pulse' />
              <div className='rounded-md max-w-full w-[200px] h-5 bg-slate-500 animate-pulse' />
            </div>
          </div>

          {/* Content */}
          <div className='h-8 my-0.5 max-w-[500px] w-full rounded-md bg-slate-700 animate-pulse' />

          <Divider size={4} />

          <div className='flex items-center justify-between flex-wrap gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <div className='rounded-md max-w-full w-[80px] h-4 my-0.5 bg-slate-500 animate-pulse' />
              <div className='rounded-md max-w-full w-[80px] h-4 my-0.5 bg-slate-500 animate-pulse' />
              <div className='rounded-md max-w-full w-[160px] h-4 my-0.5 bg-slate-500 animate-pulse' />
            </div>

            <div className='rounded-md max-w-full w-[100px] h-4 my-0.5 bg-slate-500 animate-pulse' />
          </div>

          <div className='flex flex-col gap-2 mt-4'>
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                className='flex items-center justify-between px-2 h-10 w-full rounded-md shadow-lg bg-slate-700 animate-pulse'
                key={index}
              >
                <div className='rounded-md max-w-full w-[100px] h-4 bg-slate-500 animate-pulse' />
                <div className='rounded-full max-w-full w-4 h-4 bg-slate-500 animate-pulse' />
              </div>
            ))}
          </div>

          <Divider size={10} border />

          {/* Description */}
          <div className='h-8 my-0.5 max-w-[500px] w-full rounded-md bg-slate-700 animate-pulse' />

          <Divider size={2} />

          <div className='flex flex-col gap-2'>
            <div className='rounded-md max-w-full w-[200px] h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full w-[200px] h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
            <div className='rounded-md max-w-full h-5 bg-slate-500 animate-pulse' />
          </div>
        </div>

        {/* MARK: Floating Box */}
        <div className='hidden lg:flex flex-shrink-0 w-full max-w-[300px] justify-end items-start'>
          <FloatingSummaryX className='sticky top-[90px] -mt-[100%] right-0 flex-shrink-0 w-full bg-white rounded-xl shadow-lg' />
        </div>
      </div>

      {/* MARK: Floating Action Buttons */}
      <FloatingActionButtonsX className='lg:hidden fixed bottom-[72px] md:bottom-0 left-0 w-full right-0 flex px-3 py-1.5 rounded-t-xl gap-2 bg-white z-20' />

      <Divider size={8} />

      {/* MARK: Related Courses */}
      <div className={`max-w-1200 w-full mx-auto px-21`}>
        <div className='h-8 my-0.5 max-w-[500px] w-full rounded-md bg-slate-700 animate-pulse' />

        <GroupCoursesX className='-mx-21/2' classChild='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <CourseCardX key={index} />
          ))}
        </GroupCoursesX>
      </div>
    </div>
  )
}

export default Loading
