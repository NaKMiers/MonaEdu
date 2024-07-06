'use client'

import { IChapter } from '@/models/ChapterModel'
import { ICourse } from '@/models/CourseModel'
import { useState } from 'react'
import Chapter from './Chapter'
import Divider from './Divider'

interface CourseContentProps {
  course: ICourse
  chapters: IChapter[]
  className?: string
}

function CourseContent({ course, chapters, className = '' }: CourseContentProps) {
  // states
  const [collapseAll, setCollapseAll] = useState<boolean>(false)

  const lessonAmount = chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)
  const totalDuration = chapters.reduce(
    (total, chapter) =>
      total + (chapter.lessons?.reduce((total, lesson) => total + lesson.duration, 0) || 0),
    0
  )
  const hours = Math.floor(totalDuration / 3600)
  const minutes = (totalDuration % 3600) % 60
  const duration = `${hours > 0 ? `${hours} giờ` : ''}${hours > 0 && minutes > 0 ? ':' : ''}${
    minutes > 0 ? `${minutes} phút` : ''
  }`

  return (
    <div className={`w-full ${className}`}>
      <div className='flex flex-col gap-1 md:flex-row justify-between tracking-wider text-sm'>
        <div className='text-center md:text-left'>
          {chapters.length} Chương - {lessonAmount} Bài giảng - {duration} tổng thời lượng
        </div>
        <button
          className='font-semibold text-secondary text-right drop-shadow-md underline underline-offset-1'
          onClick={() => setCollapseAll(prev => !prev)}
        >
          {!collapseAll ? 'Mở tất cả' : 'Đóng tất cả'}
        </button>
      </div>

      <Divider size={3} />

      <ul className='flex flex-col gap-2'>
        {chapters.map(chapter => (
          <Chapter
            courseId={course._id}
            collapseAll={collapseAll}
            chapter={chapter}
            courseSlug={course.slug}
            key={chapter._id}
          />
        ))}
      </ul>
    </div>
  )
}

export default CourseContent
