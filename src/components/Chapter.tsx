'use client'

import { IChapter } from '@/models/ChapterModel'
import Link from 'next/link'
import { memo, useEffect, useRef, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import Divider from './Divider'
import { duration } from '@/utils/time'

interface ChapterProps {
  chapter: IChapter
  courseSlug: string
  lessonSlug?: string
  collapseAll?: boolean
  className?: string
}

function Chapter({ chapter, courseSlug, lessonSlug = '', collapseAll, className = '' }: ChapterProps) {
  // states
  const [open, setOpen] = useState<boolean>(
    collapseAll || chapter.lessons?.map(lesson => lesson.slug).includes(lessonSlug) || false
  )

  console.log('collapseAll', collapseAll)

  // refs
  const chapterRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (open || collapseAll) {
      if (!chapter.lessons || !chapterRef.current) return

      const origin = 54
      const length = chapter.lessons.length * 40
      const totalGap = (chapter.lessons.length - 1) * 4
      const totalHeight = origin + length + totalGap

      chapterRef.current.style.setProperty('max-height', `${totalHeight}px`)
    } else {
      chapterRef.current?.style.removeProperty('max-height')
    }
  }, [open, chapter.lessons, collapseAll])

  return (
    <ul
      className={`flex flex-col border-b-2 bg-neutral-800 rounded-lg shadow-lg border-slate-300 ${className}`}
    >
      <p
        className={`${
          chapter.lessons?.some(lesson => lesson.slug === lessonSlug) ? 'text-orange-500' : 'text-white'
        } font-semibold flex justify-between items-center py-2 px-3 cursor-pointer`}
        onClick={() => setOpen(!open)}
      >
        {chapter.title} <FaAngleDown size={18} className={`${open ? 'rotate-180' : ''} trans-200`} />
      </p>

      <ul
        className={`flex flex-col px-2 gap-[4px] ${open ? '' : 'max-h-0'} trans-300 overflow-hidden`}
        ref={chapterRef}
      >
        {chapter.lessons?.map(lesson => (
          <Link
            href={`/learning/${courseSlug}/${lesson.slug}`}
            className={`bg-white rounded-md py-2 px-3 gap-4 hover:bg-sky-200 trans-200 flex items-center justify-between ${
              lesson.slug === lessonSlug ? 'font-semibold text-orange-500' : ''
            }`}
            title={lesson.title}
            key={lesson._id}
          >
            <span className='text-ellipsis line-clamp-1'>{lesson.title}</span>
            <span className='text-xs font-semibold text-nowrap text-slate-500'>
              {duration(lesson.duration)}
            </span>
          </Link>
        ))}
        <Divider size={2} />
      </ul>
    </ul>
  )
}

export default memo(Chapter)
