'use client'

import { IChapter } from '@/models/ChapterModel'
import { duration } from '@/utils/time'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { memo, useEffect, useRef, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { TiLockClosed, TiLockOpen } from 'react-icons/ti'
import Divider from './Divider'

interface LearningChapterProps {
  courseId: string
  chapter: IChapter
  courseSlug: string
  lessonSlug?: string
  className?: string
}

function LearningChapter({
  courseId,
  chapter,
  courseSlug,
  lessonSlug = '',
  className = '',
}: LearningChapterProps) {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user

  // check if user is enrolled in this course
  const isEnrolled = curUser?.courses?.map((course: any) => course.course).includes(courseId)

  // states
  const [open, setOpen] = useState<boolean>(
    chapter.lessons?.map((lesson) => lesson.slug).includes(lessonSlug) || false
  )

  // refs
  const chapterRef = useRef<HTMLUListElement>(null)

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
          chapter.lessons?.some((lesson) => lesson.slug === lessonSlug)
            ? 'text-orange-500'
            : 'text-white'
        } font-semibold flex justify-between items-center py-2 px-3 cursor-pointer`}
        onClick={() => setOpen(!open)}
      >
        {chapter.title} <FaAngleDown size={18} className={`${open ? 'rotate-180' : ''} trans-200`} />
      </p>

      <ul
        className={`flex flex-col px-2 gap-[4px] ${open ? '' : 'max-h-0'} trans-300 overflow-hidden`}
        ref={chapterRef}
      >
        {chapter.lessons?.map((lesson) =>
          lesson.status === 'public' ? (
            <Link
              href={`/learning/${courseSlug}/${lesson.slug}`}
              className={`bg-white rounded-md py-2 px-3 gap-4 hover:bg-primary trans-200 flex items-center ${
                lesson.slug === lessonSlug ? 'font-semibold text-orange-500' : ''
              }`}
              key={lesson._id}
            >
              {!isEnrolled && <TiLockOpen size={16} className='flex-shrink-0' />}
              <span className='text-ellipsis line-clamp-1'>{lesson.title}</span>
              <span className='text-xs font-semibold text-nowrap text-slate-500 ml-auto'>
                {duration(lesson.duration)}
              </span>
            </Link>
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

export default memo(LearningChapter)
