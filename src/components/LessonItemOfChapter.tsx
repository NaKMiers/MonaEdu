import { useAppSelector } from '@/libs/hooks'
import { ILesson } from '@/models/LessonModel'
import { duration } from '@/utils/time'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import { TiLockOpen, TiTick } from 'react-icons/ti'

interface LessonItemOfChapterProps {
  lesson: ILesson
  lessonSlug: string
  courseSlug: string
  isEnrolled: boolean
  className?: string
}

function LessonItemOfChapter({
  lesson: data,
  lessonSlug,
  courseSlug,
  isEnrolled,
  className = '',
}: LessonItemOfChapterProps) {
  // hooks
  const learningLesson = useAppSelector(state => state.learning.learningLesson)

  // // states
  const [lesson, setLesson] = useState<ILesson>(data)

  useEffect(() => {
    if (learningLesson && learningLesson._id === lesson._id) {
      setLesson(learningLesson)
    }
  }, [learningLesson, lesson._id])

  return (
    <Link
      href={`/learning/${courseSlug}/${lesson.slug}`}
      className={`trans-200 relative flex items-center gap-4 overflow-hidden rounded-md bg-white px-3 py-2 hover:bg-primary ${
        lesson.slug === lessonSlug ? 'font-semibold text-orange-500' : ''
      } ${className}`}
      key={lesson._id}
    >
      <div
        className={`trans-500 absolute bottom-0 left-0 top-0 rounded-sm bg-yellow-200`}
        style={{
          width: `${lesson.progress?.progress || 0}%`,
        }}
      />

      <div className="relative z-10 flex w-full items-center">
        {!isEnrolled && (
          <TiLockOpen
            size={16}
            className="mr-1.5 flex-shrink-0"
          />
        )}
        {isEnrolled && lesson.progress?.status === 'completed' && (
          <TiTick
            size={18}
            className="flex-shrink-0 text-green-400"
          />
        )}
        <p
          className="line-clamp-1 text-ellipsis text-sm"
          title={`${lesson.title} - ${lesson?.progress?.progress || 0}%`}
        >
          {lesson.title}
        </p>
        <span className="ml-auto text-nowrap text-xs font-semibold text-slate-500">
          {duration(lesson.duration)}
        </span>
      </div>
    </Link>
  )
}

export default memo(LessonItemOfChapter)
