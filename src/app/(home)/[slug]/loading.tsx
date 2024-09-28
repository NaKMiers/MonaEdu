import Divider from '@/components/Divider'
import CourseCardX from '@/components/loading/CourseCardX'
import FloatingActionButtonsX from '@/components/loading/FloatingActionButtonsX'
import FloatingSummaryX from '@/components/loading/FloatingSummaryX'
import GroupCoursesX from '@/components/loading/GroupCoursesX'
import { Fragment } from 'react'
import { FaAngleRight } from 'react-icons/fa'

async function Loading() {
  return (
    <div className="-mb-28 bg-white pb-36 md:-mb-8 md:-mt-8 md:pt-8">
      {/* MARK: Banner */}
      <div className="relative -mt-8 bg-neutral-800 pt-8 text-light">
        {/* <BeamsBackground /> */}

        {/* Container */}
        <div className="relative mx-auto max-w-1200 py-10">
          <div className="w-full overflow-hidden px-21 lg:max-w-[calc(100%-300px-32px)]">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center">
              {Array.from({ length: 4 }).map((_, index) => (
                <Fragment key={index}>
                  <div className="my-0.5 h-5 w-[100px] max-w-full animate-pulse rounded-md bg-slate-300" />
                  {index < 3 && <FaAngleRight className="text-slate-300" />}
                </Fragment>
              ))}
            </div>

            {/* Thumbnails */}
            <div className="mt-8 aspect-video max-w-[500px] animate-pulse overflow-hidden rounded-lg bg-slate-300 shadow-lg lg:hidden" />

            <Divider size={8} />

            {/* Title */}
            <div className="my-0.5 h-8 w-[500px] max-w-full animate-pulse rounded-md bg-slate-300" />

            <Divider size={3} />

            {/* Hook */}
            <div className="mb-1 h-5 w-[700px] max-w-full animate-pulse rounded-md bg-slate-300" />
            <div className="h-5 w-[700px] max-w-full animate-pulse rounded-md bg-slate-300" />

            <Divider size={3} />

            {/* Author */}
            <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
              <div className="h-5 w-[105px] animate-pulse rounded-md bg-slate-300" />
              <div className="h-5 w-[105px] animate-pulse rounded-md bg-slate-300" />
            </div>

            {/* Last Update*/}
            <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
              <div className="h-5 w-[105px] animate-pulse rounded-md bg-slate-300" />
              <div className="h-5 w-[105px] animate-pulse rounded-md bg-slate-300" />
            </div>

            {/* Language */}
            <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
              <div className="h-5 w-[105px] animate-pulse rounded-md bg-slate-300" />
              <div className="h-5 w-[105px] animate-pulse rounded-md bg-slate-300" />
            </div>

            {/* Tags */}
            <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
              <div className="h-5 w-[75px] animate-pulse rounded-md bg-slate-300" />
              <div className="h-5 w-[75px] animate-pulse rounded-md bg-slate-300" />
              <div className="h-5 w-[75px] animate-pulse rounded-md bg-slate-300" />
              <div className="h-5 w-[75px] animate-pulse rounded-md bg-slate-300" />
            </div>

            {/* Price */}
            <div className="mt-3 h-9 w-full max-w-[500px] animate-pulse rounded-md bg-slate-300 shadow-lg" />

            <Divider size={4} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-1200 gap-8 px-21 py-8">
        {/* Main */}
        <div className="mb-8 flex-1">
          {/* MARK: Include */}
          <div className="mb-8 lg:hidden">
            <div className="my-0.5 h-8 w-full max-w-[500px] animate-pulse rounded-md bg-slate-700" />

            <Divider size={3} />

            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-500" />
              <div className="h-5 w-[80px] animate-pulse rounded-md bg-slate-500" />
              <div className="h-5 w-[80px] animate-pulse rounded-md bg-slate-500" />
            </div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-500" />
              <div className="h-5 w-[80px] animate-pulse rounded-md bg-slate-500" />
            </div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-500" />
              <div className="h-5 w-[200px] max-w-full animate-pulse rounded-md bg-slate-500" />
            </div>
          </div>

          {/* Content */}
          <div className="my-0.5 h-8 w-full max-w-[500px] animate-pulse rounded-md bg-slate-700" />

          <Divider size={4} />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="my-0.5 h-4 w-[80px] max-w-full animate-pulse rounded-md bg-slate-500" />
              <div className="my-0.5 h-4 w-[80px] max-w-full animate-pulse rounded-md bg-slate-500" />
              <div className="my-0.5 h-4 w-[160px] max-w-full animate-pulse rounded-md bg-slate-500" />
            </div>

            <div className="my-0.5 h-4 w-[100px] max-w-full animate-pulse rounded-md bg-slate-500" />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                className="flex h-10 w-full animate-pulse items-center justify-between rounded-md bg-slate-700 px-2 shadow-lg"
                key={index}
              >
                <div className="h-4 w-[100px] max-w-full animate-pulse rounded-md bg-slate-500" />
                <div className="h-4 w-4 max-w-full animate-pulse rounded-full bg-slate-500" />
              </div>
            ))}
          </div>

          <Divider
            size={10}
            border
          />

          {/* Description */}
          <div className="my-0.5 h-8 w-full max-w-[500px] animate-pulse rounded-md bg-slate-700" />

          <Divider size={2} />

          <div className="flex flex-col gap-2">
            <div className="h-5 w-[200px] max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 w-[200px] max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
            <div className="h-5 max-w-full animate-pulse rounded-md bg-slate-500" />
          </div>
        </div>

        {/* MARK: Floating Box */}
        <div className="hidden w-full max-w-[300px] flex-shrink-0 items-start justify-end lg:flex">
          <FloatingSummaryX className="sticky right-0 top-[90px] -mt-[100%] w-full flex-shrink-0 rounded-xl bg-white shadow-lg" />
        </div>
      </div>

      {/* MARK: Floating Action Buttons */}
      <FloatingActionButtonsX className="fixed bottom-[72px] left-0 right-0 z-20 flex w-full gap-2 rounded-t-xl bg-white px-3 py-1.5 md:bottom-0 lg:hidden" />

      <Divider size={8} />

      {/* MARK: Related Courses */}
      <div className={`mx-auto w-full max-w-1200 px-21`}>
        <div className="my-0.5 h-8 w-full max-w-[500px] animate-pulse rounded-md bg-slate-700" />

        <GroupCoursesX
          className="-mx-21/2"
          classChild="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <CourseCardX key={index} />
          ))}
        </GroupCoursesX>
      </div>
    </div>
  )
}

export default Loading
