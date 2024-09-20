import { useAppSelector } from '@/libs/hooks'
import { ILesson } from '@/models/LessonModel'
import { duration } from '@/utils/time'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
    <a
      href={`/learning/${courseSlug}/${lesson.slug}`}
      className={`relative bg-white rounded-md py-2 px-3 gap-4 hover:bg-primary trans-200 flex items-center overflow-hidden ${
        lesson.slug === lessonSlug ? 'font-semibold text-orange-500' : ''
      } ${className}`}
      key={lesson._id}
    >
      <div
        className={`absolute top-0 left-0 bottom-0 bg-yellow-200 rounded-sm trans-500`}
        style={{
          width: `${lesson.progress?.progress || 0}%`,
        }}
      />

      <div className='w-full flex items-center relative z-10'>
        {!isEnrolled && <TiLockOpen size={16} className='flex-shrink-0 mr-1.5' />}
        {isEnrolled && lesson.progress?.status === 'completed' && (
          <TiTick size={18} className='text-green-400 flex-shrink-0' />
        )}
        <p
          className='text-ellipsis line-clamp-1 text-sm'
          title={`${lesson.title} - ${lesson?.progress?.progress || 0}%`}
        >
          {lesson.title}
        </p>
        <span className='text-xs font-semibold text-nowrap text-slate-500 ml-auto'>
          {duration(lesson.duration)}
        </span>
      </div>
    </a>
  )
}

export default LessonItemOfChapter
