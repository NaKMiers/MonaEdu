'use client'

import { ICourse } from '@/models/CourseModel'
import { getAllCoursesApi } from '@/requests'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface RecentlySaleTab {
  className?: string
}

function RecentlySaleTab({ className = '' }: RecentlySaleTab) {
  // states
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  // get recently sale courses
  const getCourses = useCallback(async (page: number) => {
    console.log('Get Recently Sale Courses')

    // start loading
    setLoading(true)

    try {
      const query = `?limit=15&sort=begin|-1&active=true&usingUser=true&page=${page}`
      const { courses } = await getAllCoursesApi(query)

      return courses
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [])

  // get recently sale courses (on mount)
  useEffect(() => {
    // get courses on mount
    const initialGetCourses = async () => {
      const courses = await getCourses(1)
      setCourses(courses)
    }

    initialGetCourses()
  }, [getCourses])

  // handle load more
  const handleLoadMore = useCallback(async () => {
    const newCourses = await getCourses(page + 1)
    setPage(page + 1)
    setCourses(prev => [...prev, ...newCourses])
  }, [getCourses, setCourses, page])

  return (
    <div className={`${className}`}>
      {/* {courses.map(course => {
        const minutesAgo = moment().diff(moment(course.begin), 'minutes')

        let color
        if (minutesAgo <= 30) {
          color = 'green-500' // Màu xanh lá
        } else if (minutesAgo <= 60) {
          color = 'sky-500' // Màu xanh dương
        } else if (minutesAgo <= 120) {
          color = 'yellow-400' // Màu vàng
        } else {
          color = 'default' // Màu mặc định nếu hơn 30 phút
        }

        return (
          <div className='flex gap-3 mb-4' key={course._id}>
            <Link
              href={`/${(course.type as IProduct).slug}`}
              className='flex-shrink-0 flex max-w-[80px] items-start w-full no-scrollbar'>
              <Image
                className='aspect-video rounded-lg shadow-lg'
                src={(course.type as IProduct)?.images[0] || '/images/not-found.jpg'}
                height={80}
                width={80}
                alt='thumbnail'
              />
            </Link>
            <div className='font-body tracking-wider'>
              <p className='font-semibold text-ellipsis line-clamp-1 -mt-1.5'>
                {(course.type as IProduct).title}
              </p>
              <Link
                href={`/admin/course/all?search=${course.usingUser}`}
                className='text-ellipsis line-clamp-1 text-sm'>
                {course.usingUser}
              </Link>
              <p className={`text-ellipsis line-clamp-1 text-sm text-${color}`}>
                {moment(course.begin).format('DD/MM/YYYY HH:mm:ss')}
              </p>
            </div>
          </div>
        )
      })} */}

      {/* <div className='flex items-center justify-center'>
        <button
          className={`flex items-center justify-center font-semibold rounded-md px-3 h-8 text-sm text-white border-2 hover:bg-white hover:text-dark common-transition ${
            loading ? 'pointer-events-none bg-white border-slate-400' : 'bg-dark-100 border-dark'
          }`}
          onClick={handleLoadMore}>
          {loading ? (
            <FaCircleNotch size={18} className='animate-spin text-slate-400' />
          ) : (
            <span>({courses.length}) Load more...</span>
          )}
        </button>
      </div> */}
    </div>
  )
}

export default RecentlySaleTab
