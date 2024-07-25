'use client'

import { IChapter } from '@/models/ChapterModel'
import { duration } from '@/utils/time'
import { Tooltip } from '@mui/material'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAngleDown } from 'react-icons/fa'
import { TiLockClosed, TiLockOpen } from 'react-icons/ti'
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
  const isEnrolled = curUser?.courses?.map((course: any) => course.course).includes(courseId)

  // states
  const [open, setOpen] = useState<boolean>(
    collapseAll ||
      ((chapter.lessons?.some(lesson => lesson.status === 'public') || false) && !isEnrolled)
  )

  // refs
  const chapterRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if ((chapter.lessons?.some(lesson => lesson.status === 'public') || false) && !isEnrolled) return
    setOpen(!!collapseAll)
  }, [collapseAll, chapter.lessons, isEnrolled])

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
      className={`flex flex-col border-b-2 bg-neutral-800 rounded-lg shadow-lg border-slate-300 ${className}`}
    >
      <p
        className={`${
          chapter.lessons?.some(lesson => lesson.slug === lessonSlug) ? 'text-orange-500' : 'text-white'
        } font-semibold flex justify-between items-center gap-2 py-2 px-3 cursor-pointer`}
        onClick={() => setOpen(!open)}
      >
        {chapter.title}
        <div className='flex items-center gap-2'>
          <span className='text-xs'>
            {duration(chapter.lessons?.reduce((total, lesson) => total + lesson.duration, 0) || 0)}
          </span>{' '}
          <FaAngleDown size={18} className={`${open ? 'rotate-180' : ''} trans-200`} />
        </div>
      </p>

      <ul
        className={`flex flex-col px-2 gap-[4px] ${open ? '' : 'max-h-0'} trans-300 overflow-hidden`}
        ref={chapterRef}
      >
        {chapter.lessons?.map(lesson =>
          lesson.status === 'public' || isEnrolled ? (
            <Tooltip title={`Học thử ngay`} placement='top' arrow key={lesson._id}>
              <Link
                href={`/learning/${courseSlug}/${lesson.slug}`}
                className={`bg-white rounded-md py-2 px-3 gap-4 hover:bg-primary trans-200 flex items-center ${
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
                {!isEnrolled && <TiLockOpen size={16} className='flex-shrink-0' />}
                <span className='text-ellipsis line-clamp-1'>{lesson.title}</span>
                <span className='text-xs font-semibold text-nowrap text-slate-500 ml-auto'>
                  {duration(lesson.duration)}
                </span>
              </Link>
            </Tooltip>
          ) : (
            <div
              className={`bg-white rounded-md py-2 px-3 gap-4 flex items-center ${
                lesson.slug === lessonSlug ? 'font-semibold text-orange-500' : ''
              }`}
              title={lesson.title}
              key={lesson._id}
            >
              {!isEnrolled && <TiLockClosed size={16} className='flex-shrink-0' />}
              <span className='text-ellipsis line-clamp-1'>{lesson.title}</span>
              <span className='text-xs font-semibold text-nowrap text-slate-500 ml-auto'>
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
