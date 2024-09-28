'use client'

import { IChapter } from '@/models/ChapterModel'
import { duration } from '@/utils/time'
import { Tooltip } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { memo, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAngleDown } from 'react-icons/fa'
import { TiLockClosed } from 'react-icons/ti'
import Divider from './Divider'

interface ChapterProps {
  courseId: string
  chapter: IChapter
  courseSlug: string
  lessonSlug?: string
  collapseAll: boolean
  className?: string
}

function Chapter({
  courseId,
  chapter,
  courseSlug,
  lessonSlug = '',
  collapseAll,
  className = '',
}: ChapterProps) {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user
  const router = useRouter()

  // check if user is enrolled in this course
  const joinedCourse = curUser?.courses.find((c: any) => c.course === courseId)
  let isRedirect: boolean =
    joinedCourse && (!joinedCourse.expire || new Date(joinedCourse.expire) > new Date())

  // states
  const [open, setOpen] = useState<boolean>(
    collapseAll ||
      ((chapter.lessons?.some(lesson => lesson.status === 'public') || false) && !joinedCourse)
  )

  // refs
  const chapterRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if ((chapter.lessons?.some(lesson => lesson.status === 'public') || false) && !joinedCourse) return
    setOpen(!!collapseAll)
  }, [collapseAll, chapter.lessons, joinedCourse])

  useEffect(() => {
    if (open) {
      if (!chapter.lessons || !chapterRef.current) return

      const origin = 54
      const length = chapter.lessons.length * 40
      const totalGap = (chapter.lessons.length - 1) * 4
      const totalHeight = origin + length + totalGap

      chapterRef.current.style.setProperty('max-height', `${totalHeight}px`)
    } else {
      chapterRef.current?.style.removeProperty('max-height')
    }
  }, [open, chapter.lessons])

  return (
    <ul
      className={`flex flex-col rounded-lg border-b-2 border-slate-300 bg-neutral-800 shadow-lg ${className}`}
    >
      <div
        className={`${
          chapter.lessons?.some(lesson => lesson.slug === lessonSlug) ? 'text-orange-500' : 'text-light'
        } flex cursor-pointer items-start justify-between gap-3 px-3 py-2 font-semibold`}
        onClick={() => setOpen(!open)}
      >
        <p className="text-sm sm:text-base">{chapter.title}</p>
        <div className="flex flex-wrap items-center justify-end gap-x-2 text-nowrap sm:flex-nowrap">
          <span className="text-xs">{chapter.lessons?.length} bài giảng</span>
          {' - '}
          <span className="text-xs">
            {duration(chapter.lessons?.reduce((total, lesson) => total + lesson.duration, 0) || 0)}
          </span>{' '}
          <FaAngleDown
            size={18}
            className={`${open ? 'rotate-180' : ''} trans-200`}
          />
        </div>
      </div>

      <ul
        className={`flex flex-col gap-[4px] px-2 ${open ? '' : 'max-h-0'} trans-300 overflow-hidden`}
        ref={chapterRef}
      >
        {chapter.lessons?.map(lesson =>
          lesson.status === 'public' || isRedirect ? (
            <Tooltip
              title={isRedirect ? 'Học ngay' : `Học thử ngay`}
              placement="top"
              arrow
              key={lesson._id}
            >
              <div
                className={`trans-200 flex cursor-pointer items-center gap-4 rounded-md bg-white px-3 py-2 hover:bg-primary ${
                  lesson.slug === lessonSlug ? 'font-semibold text-orange-500' : ''
                }`}
                onClick={e => {
                  e.preventDefault()
                  if (!curUser?._id) {
                    toast.error('Bạn cần phải đăng nhập để học thử')
                  } else {
                    router.push(`/learning/${courseSlug}/${lesson.slug}`)
                  }
                }}
              >
                {/* {!isRedirect && <TiLockOpen size={16} className='flex-shrink-0' />} */}
                <span className="line-clamp-1 text-ellipsis">{lesson.title}</span>
                <span className="ml-auto text-nowrap text-xs font-semibold text-slate-500">
                  {duration(lesson.duration)}
                </span>
              </div>
            </Tooltip>
          ) : (
            <div
              className={`flex items-start gap-4 rounded-md bg-white px-3 py-2 ${
                lesson.slug === lessonSlug ? 'font-semibold text-orange-500' : ''
              }`}
              title={lesson.title}
              key={lesson._id}
            >
              {!isRedirect && (
                <TiLockClosed
                  size={16}
                  className="flex-shrink-0"
                />
              )}
              <span className="line-clamp-1 text-ellipsis">{lesson.title}</span>
              <span className="ml-auto text-nowrap text-xs font-semibold text-slate-500">
                {duration(lesson.duration)}
              </span>
            </div>
          )
        )}
        <Divider size={2} />
      </ul>
    </ul>
  )
}

export default memo(Chapter)
