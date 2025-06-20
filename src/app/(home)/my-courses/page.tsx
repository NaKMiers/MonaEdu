'use client'

import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { getMyCoursesApi } from '@/requests'
import { Link } from '@react-email/components'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

function MyCoursesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session, update } = useSession()
  const curUser: any = session?.user

  // states
  const [courses, setCourses] = useState<ICourse[]>([])

  // refs
  const isUpdatedSession = useRef<boolean>(false)

  // get my courses
  useEffect(() => {
    const getMyCourses = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to get my courses
        const { courses } = await getMyCoursesApi()
        setCourses(courses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    // only get courses if user is logged in and session is updated
    if (curUser?._id && !isUpdatedSession.current) {
      getMyCourses()
    }

    const updateSession = async () => {
      console.log('Session my-courses...')
      isUpdatedSession.current = true
      await update()
    }

    if (!isUpdatedSession.current) {
      updateSession()
    }
  }, [dispatch, update, curUser?._id])

  // set page title
  useEffect(() => {
    document.title = 'Khóa học của tôi - Mona Edu'
  }, [])

  return (
    <div className="px-21">
      <Divider size={8} />

      {/* Heading */}
      <h1 className="px-21 text-center text-4xl font-semibold text-light md:mt-8">
        Khóa học của tôi {!!courses.length && <span>({courses.length})</span>}
      </h1>

      <Divider
        size={8}
        border
      />

      {/* MAIN List */}
      {!!courses.length ? (
        <div className="grid grid-cols-1 gap-21 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {courses.map(course => (
            <CourseCard
              course={course}
              key={course._id}
              hideBadge
            />
          ))}
        </div>
      ) : (
        <div className="text-center font-body tracking-wider">
          <p className="italic text-light">
            Bạn chưa đăng ký khóa học nào cả. <br />
          </p>
          <Link
            href="/"
            className="hover:tracking trans-200 text-sky-500 underline underline-offset-2 hover:text-sky-700"
          >
            Khám phá các khóa học bổ ích ngay hôm nay!
          </Link>
        </div>
      )}

      <Divider size={28} />
    </div>
  )
}

export default MyCoursesPage
