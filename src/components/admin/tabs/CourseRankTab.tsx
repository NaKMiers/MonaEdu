import Divider from '@/components/Divider'
import { getAllOrdersApi, getForceAllCategoriesApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { rankCourseRevenue } from '@/utils/stat'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface CourseRankTabProps {
  className?: string
}

function CourseRankTab({ className = '' }: CourseRankTabProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [courses, setCourses] = useState<any[]>([])
  const [by, setBy] = useState<'day' | 'month' | 'year'>('day')

  useEffect(() => {
    const getOrders = async () => {
      // start loading
      setLoading(true)

      try {
        let from: string = ''
        const currentTime = moment()
        if (by === 'day') {
          from = currentTime.startOf('day').format('YYYY-MM-DD HH:mm:ss')
        } else if (by === 'month') {
          from = currentTime.startOf('month').format('YYYY-MM-DD HH:mm:ss')
        } else if (by === 'year') {
          from = currentTime.startOf('year').format('YYYY-MM-DD HH:mm:ss')
        }

        // get orders and categories
        const [{ orders }, { categories }] = await Promise.all([
          getAllOrdersApi(`?limit=no-limit&status=done&sort=createdAt|-1&from-to=${from}|`),
          getForceAllCategoriesApi('?pure=true'),
        ])

        const courses = rankCourseRevenue(orders, categories)
        setCourses(courses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    }

    getOrders()
  }, [by])

  return (
    <div className={`${className}`}>
      {!loading ? (
        <>
          <select
            className='appearance-none p-2.5 font-semibold text-xs bg-dark-100 text-white focus:outline-none focus:ring-0 peer rounded-lg cursor-pointer'
            value={by}
            onChange={e => setBy(e.target.value as never)}
          >
            <option
              className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
              value='day'
            >
              By Day
            </option>
            <option
              className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
              value='month'
            >
              By Month
            </option>
            <option
              className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
              value='year'
            >
              By Year
            </option>
          </select>

          <Divider size={4} />

          <div className='flex flex-col gap-2'>
            {courses.map((course, index) => (
              <div
                className='flex items-start gap-2.5 bg-slate-700 rounded-lg shadow-lg p-2 text-light'
                key={index}
              >
                <Link
                  href={`/${course.slug}`}
                  className='aspect-video rounded-sm overflow-hidden flex-shrink-0 w-full max-w-[60px]'
                >
                  <Image
                    className='w-full h-full object-cover'
                    src={course.images[0]}
                    width={60}
                    height={40}
                    alt={course.title}
                    loading='lazy'
                  />
                </Link>
                <div className='flex flex-col'>
                  <p className='font-body tracking-wider font-semibold -mt-1'>{course.title}</p>
                  <p>
                    <span className='text-xs'>Revenue</span>:{' '}
                    <span className='font-semibold'>{formatPrice(course.revenue)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center'>
          <FaCircleNotch size={18} className='animate-spin text-slate-400' />
        </div>
      )}
    </div>
  )
}

export default CourseRankTab
