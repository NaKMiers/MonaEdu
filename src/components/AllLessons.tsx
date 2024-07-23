'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenSidebar } from '@/libs/reducers/modalReducer'
import { IChapter } from '@/models/ChapterModel'
import { ILesson } from '@/models/LessonModel'
import { getLearningChaptersApi } from '@/requests/chapterRequest'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsLayoutSidebarInset } from 'react-icons/bs'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import Divider from './Divider'
import LearningChapter from './LearningChapter'

function AllLessons() {
  // hooks
  const dispatch = useAppDispatch()
  const openSidebar = useAppSelector(state => state.modal.openSidebar)
  const router = useRouter()
  const params = useParams()
  const courseSlug = params.courseSlug as string
  const lessonSlug = params.lessonSlug as string
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [courseId, setCourseId] = useState<string>('')
  const [chapters, setChapters] = useState<IChapter[]>([])
  const [nextLesson, setNextLesson] = useState<string>('')
  const [prevLesson, setPrevLesson] = useState<string>('')
  // const [isEnrolled, setIsEnrolled] = useState<boolean>(false)

  // get all chapters with lessons
  useEffect(() => {
    const getChaptersWithLessons = async () => {
      try {
        // send request to get all chapters with lessons
        const { chapters, courseId } = await getLearningChaptersApi(courseSlug)

        // check if user is enrolled in this course
        // const isEnrolled = curUser?.courses?.map((course: any) => course.course).includes(courseId)
        // setIsEnrolled(isEnrolled)

        // set states
        setChapters(chapters)
        setCourseId(courseId)

        if (lessonSlug === 'continue') {
          const lessons: ILesson[] = chapters.reduce(
            (acc: ILesson[], chapter: any) => [...acc, ...chapter.lessons],
            []
          )
          let lesson = lessons[0]

          const inProgressLessons = lessons.filter(
            (lesson: any) => lesson?.progress?.status === 'in-progress'
          )

          if (inProgressLessons.length > 0) {
            lesson = inProgressLessons[0]
          }

          router.push(`/learning/${courseSlug}/${lesson.slug}`)
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getChaptersWithLessons()
  }, [router, dispatch, courseSlug, lessonSlug])

  // find next and prev lesson
  useEffect(() => {
    let lessons: ILesson[] = chapters.map(chapter => chapter.lessons).flat() as ILesson[]
    // if (!isEnrolled) {
    //   lessons = lessons.filter((lesson) => lesson.status === 'public') // public lesson
    // }

    const curLessonIndex = lessons.findIndex(lesson => lesson.slug === lessonSlug)

    setPrevLesson(curLessonIndex > 0 ? lessons[curLessonIndex - 1].slug : '')
    setNextLesson(curLessonIndex < lessons.length - 1 ? lessons[curLessonIndex + 1].slug : '')

    // // user is enrolled in this course
    // if (isEnrolled) {
    //   setPrevLesson(curLessonIndex > 0 ? lessons[curLessonIndex - 1].slug : '')
    //   setNextLesson(curLessonIndex < lessons.length - 1 ? lessons[curLessonIndex + 1].slug : '')
    // } else {
    //   // user is not enrolled in this course
    //   setPrevLesson(curLessonIndex > 0 ? lessons[curLessonIndex - 1].slug : '')
    //   setNextLesson(curLessonIndex < lessons.length - 1 ? lessons[curLessonIndex + 1].slug : '')
    // }
  }, [chapters, lessonSlug])

  return (
    <>
      {/* Pusher */}
      <div className={`${openSidebar ? 'sm:max-w-[300px]' : 'sm:max-w-0'} sm:w-full trans-300`} />

      {/* Sidebar */}
      <div
        className={`fixed overflow-hidden z-40 top-0 bottom-0 left-0 w-full sm:max-w-[300px] px-3 trans-300 border-r-2 border-dark bg-neutral-800 ${
          openSidebar ? 'translate-x-0' : '-translate-x-full'
        } pt-[18px] border-r-2 border-primary sm:rounded-r-lg shadow-md shadow-primary`}
      >
        {/* <BeamsBackground /> */}

        <div className='flex flex-col h-full relative z-10'>
          <div className='flex items-center gap-4'>
            <Link href='/' prefetch={false} className='shrink-0 trans-200'>
              <Image
                className='aspect-square rounded-md'
                src='/images/logo.png'
                width={32}
                height={32}
                alt='logo'
              />
            </Link>

            <div className='relative overflow-hidden rounded-md w-full h-6 shadow-sm shadow-primary'>
              <div
                className='h-full bg-primary flex items-center'
                style={{
                  width: `${
                    curUser?.courses.find((course: any) => course.course === courseId)?.progress || 0
                  }%`,
                }}
              />
              <div className='absolute flex items-center justify-between top-1/2 px-4 left-0 right-0 -translate-y-1/2 text-orange-400 text-sm font-body tracking-wider font-semibold drop-shadow-sm'>
                <span>
                  {curUser?.courses.find((course: any) => course.course === courseId)?.progress || 0}%
                </span>
              </div>
            </div>
          </div>

          <Divider size={2} />

          <div className='relative z-10 flex items-center justify-between gap-21 rounded-lg text-2xl font-semibold h-[40px] text-white'>
            <span>Các bài giảng</span>

            <button
              className={`group rounded-lg py-1.5 trans-300`}
              onClick={() => dispatch(setOpenSidebar(!openSidebar))}
            >
              <BsLayoutSidebarInset size={20} className='wiggle' />
            </button>
          </div>

          <Divider size={2} />

          <ul className='flex flex-col gap-2 overflow-y-auto no-scrollbar'>
            {chapters.map(chapter => (
              <LearningChapter
                courseId={courseId}
                chapter={chapter}
                lessonSlug={lessonSlug}
                courseSlug={courseSlug}
                key={chapter._id}
              />
            ))}
          </ul>

          <Divider size={2} />

          {/* Navigator */}
          {(prevLesson || nextLesson) && (
            <div className='flex flex-1 items-end pb-2'>
              <div className='py-2 w-full bg-slate-700 flex items-center justify-between px-3 gap-21 rounded-lg border-b-2 border-slate-300'>
                {prevLesson && (
                  <Link
                    href={`/learning/${courseSlug}/${prevLesson}`}
                    className={`group flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white trans-200  ${
                      !nextLesson ? 'flex-1 justify-center' : ''
                    }`}
                  >
                    <FaChevronCircleLeft size={20} className='wiggle text-dark' />
                    <span className='font-semibold text-dark'>Trước</span>
                  </Link>
                )}
                {nextLesson && (
                  <Link
                    href={`/learning/${courseSlug}/${nextLesson}`}
                    className={`group flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white trans-200 ${
                      !prevLesson ? 'flex-1 justify-center' : ''
                    }`}
                  >
                    <span className='font-semibold text-dark'>Sau</span>
                    <FaChevronCircleRight size={20} className='wiggle text-dark' />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(AllLessons)
