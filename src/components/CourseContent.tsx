'use client'

import { useAppDispatch } from '@/libs/hooks'
import { addRecentlyVisitCourses } from '@/libs/reducers/courseReducer'
import { IChapter } from '@/models/ChapterModel'
import { ICourse } from '@/models/CourseModel'
import { duration } from '@/utils/time'
import { memo, useState } from 'react'
import Chapter from './Chapter'
import Divider from './Divider'

interface CourseContentProps {
  course: ICourse
  chapters: IChapter[]
  className?: string
}

function CourseContent({ course, chapters, className = '' }: CourseContentProps) {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [collapseAll, setCollapseAll] = useState<boolean>(false)

  const lessonAmount = chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)
  const totalDuration = chapters.reduce(
    (total, chapter) =>
      total + (chapter.lessons?.reduce((total, lesson) => total + lesson.duration, 0) || 0),
    0
  )

  // add to recently visit courses
  dispatch(addRecentlyVisitCourses([course]))

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col justify-between gap-1 text-sm tracking-wider md:flex-row">
        <div className="text-center md:text-left">
          {chapters.length} Chương - {lessonAmount} Bài giảng - {duration(totalDuration, 'long')} tổng
          thời lượng
        </div>
        <button
          className="text-right font-semibold text-secondary underline underline-offset-1 drop-shadow-md"
          onClick={() => setCollapseAll(prev => !prev)}
        >
          {!collapseAll ? 'Mở tất cả' : 'Đóng tất cả'}
        </button>
      </div>

      <Divider size={3} />

      <ul className="flex flex-col gap-2">
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

export default memo(CourseContent)
