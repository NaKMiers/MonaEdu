'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import {
  setChapters,
  setNextLesson,
  setPrevLesson,
  setUserProgress,
} from '@/libs/reducers/learningReducer'
import { setOpenSidebar } from '@/libs/reducers/modalReducer'
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
  const router = useRouter()
  const params = useParams()
  const courseSlug = params.courseSlug as string
  const lessonSlug = params.lessonSlug as string
  const { data: session } = useSession()
  const curUser: any = session?.user

  // store
  const chapters = useAppSelector(state => state.learning.chapters)
  const openSidebar = useAppSelector(state => state.modal.openSidebar)
  const userProgress = useAppSelector(state => state.learning.userProgress)
  const nextLesson = useAppSelector(state => state.learning.nextLesson)
  const prevLesson = useAppSelector(state => state.learning.prevLesson)

  // states
  const [courseId, setCourseId] = useState<string>('')
  const [joinedCourse, setJoinedCourse] = useState<any>(null)
  const [isRedirect, setIsRedirect] = useState<boolean>(false)

  // get all chapters with lessons
  useEffect(() => {
    const getChaptersWithLessons = async () => {
      try {
        // send request to get all chapters with lessons
        const { chapters, courseId, userProgress } = await getLearningChaptersApi(courseSlug, '', {
          next: { revalidate: 60 },
        })

        // check if user is enrolled in this course
        const joinedCourse = curUser?.courses.find((c: any) => c.course === courseId)
        let isRedirect: boolean =
          joinedCourse && (!joinedCourse.expire || new Date(joinedCourse.expire) > new Date())

        // set states
        setJoinedCourse(joinedCourse)
        setIsRedirect(isRedirect)

        // set states
        dispatch(setChapters(chapters))
        setCourseId(courseId)

        // set states
        dispatch(setUserProgress(userProgress))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getChaptersWithLessons()

    // clear chapters after unmount
    return () => {
      dispatch(setChapters([]))
    }
  }, [dispatch, router, courseSlug, curUser?.courses])

  // auto redirect to learning lesson if lesson slug is "continue"
  useEffect(() => {
    if (!chapters.length) return

    if (lessonSlug === 'continue') {
      const lessons: ILesson[] = chapters.reduce(
        (acc: ILesson[], chapter: any) => [...acc, ...chapter.lessons],
        []
      )
      // first lesson
      let lesson = lessons[0]

      // find next lesson
      const nextLesson = lessons.find(
        lesson => !lesson.progress || lesson.progress.status !== 'completed'
      )
      if (nextLesson) {
        lesson = nextLesson
      }

      // push to next lesson
      router.push(`/learning/${courseSlug}/${lesson.slug}`)
    }
  }, [chapters, courseSlug, lessonSlug, router])

  // find next and prev lesson
  useEffect(() => {
    let lessons: ILesson[] = chapters.map(chapter => chapter.lessons).flat() as ILesson[]
    if (!isRedirect) {
      lessons = lessons.filter(lesson => lesson.status === 'public') // public lesson || subscription expired
    }

    const curLessonIndex = lessons.findIndex(lesson => lesson.slug === lessonSlug)

    // user is enrolled in this course
    if (isRedirect) {
      dispatch(setPrevLesson(curLessonIndex > 0 ? lessons[curLessonIndex - 1].slug : ''))
      dispatch(
        setNextLesson(curLessonIndex < lessons.length - 1 ? lessons[curLessonIndex + 1].slug : '')
      )
    } else {
      // user is not enrolled this course || enrolled but subscription expired
      dispatch(setPrevLesson(curLessonIndex > 0 ? lessons[curLessonIndex - 1].slug : ''))
      dispatch(
        setNextLesson(curLessonIndex < lessons.length - 1 ? lessons[curLessonIndex + 1].slug : '')
      )
    }
  }, [chapters, lessonSlug, isRedirect])

  return (
    <>
      {/* Pusher */}
      <div className={`${openSidebar ? 'sm:max-w-[300px]' : 'sm:max-w-0'} trans-300 sm:w-full`} />

      {/* Sidebar */}
      <div
        className={`trans-300 fixed bottom-0 left-0 top-0 z-40 w-full overflow-hidden border-r-2 border-dark bg-neutral-800 px-3 sm:max-w-[300px] ${
          openSidebar ? 'translate-x-0' : '-translate-x-full'
        } border-r-2 border-primary pt-[18px] shadow-md shadow-primary sm:rounded-r-lg`}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center gap-4">
            <Link
              href="/my-courses"
              className="trans-200 shrink-0"
            >
              <Image
                className="aspect-square rounded-md"
                src="/images/logo.png"
                width={32}
                height={32}
                alt="Mona-Edu"
              />
            </Link>

            {joinedCourse ? (
              <div className="relative h-6 w-full overflow-hidden rounded-md shadow-sm shadow-primary">
                <div
                  className="trans-500 flex h-full items-center bg-primary"
                  style={{
                    width: `${userProgress}%`,
                  }}
                />
                <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4 font-body text-sm font-semibold tracking-wider text-orange-500 drop-shadow-sm">
                  <span>{userProgress}%</span>
                </div>
              </div>
            ) : (
              <Link
                href="/"
                className="-ml-1.5 text-2xl font-bold text-orange-500 drop-shadow-md"
              >
                MonaEdu
              </Link>
            )}
          </div>

          <Divider size={3} />

          <div className="relative z-10 flex h-[40px] items-center justify-between gap-21 rounded-lg text-2xl font-semibold text-light">
            <span>Các bài giảng</span>

            <button
              className={`trans-300 group rounded-lg py-1.5`}
              onClick={() => dispatch(setOpenSidebar(!openSidebar))}
            >
              <BsLayoutSidebarInset
                size={20}
                className="wiggle"
              />
            </button>
          </div>

          <Divider size={2} />

          <ul className="no-scrollbar flex flex-col gap-2 overflow-y-auto">
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
            <div className="flex flex-1 items-end pb-2">
              <div className="flex w-full items-center justify-between gap-21 rounded-lg border-b-2 border-slate-300 bg-slate-700 px-3 py-2">
                {prevLesson && (
                  <a
                    href={`/learning/${courseSlug}/${prevLesson}`}
                    className={`trans-200 group flex items-center gap-2 rounded-lg border-2 border-dark bg-slate-200 px-2 py-1 hover:bg-white ${
                      !nextLesson ? 'flex-1 justify-center' : ''
                    }`}
                  >
                    <FaChevronCircleLeft
                      size={20}
                      className="wiggle text-dark"
                    />
                    <span className="font-semibold text-dark">Trước</span>
                  </a>
                )}
                {nextLesson && (
                  <a
                    href={`/learning/${courseSlug}/${nextLesson}`}
                    className={`trans-200 group flex items-center gap-2 rounded-lg border-2 border-dark bg-slate-200 px-2 py-1 hover:bg-white ${
                      !prevLesson ? 'flex-1 justify-center' : ''
                    }`}
                  >
                    <span className="font-semibold text-dark">Sau</span>
                    <FaChevronCircleRight
                      size={20}
                      className="wiggle text-dark"
                    />
                  </a>
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
