import Divider from '@/components/Divider'
import { getAllOrdersApi, getForceAllCategoriesApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { rankCourseRevenue } from '@/utils/stat'
import moment from 'moment'
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

        const query = `?limit=no-limit&status=done&sort=createdAt|-1&from-to=${from}|`
        const { orders } = await getAllOrdersApi(query)

        const { categories } = await getForceAllCategoriesApi()
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

          {courses.map((account, index) => (
            <div className='flex flex-col items-start gap-1 mb-3' key={index}>
              <p className='text-white text-sm bg-slate-700 px-2 py-[2px] rounded-lg'>{account.email}</p>
              <div className='flex gap-2'>
                <span className='text-green-500 text-sm font-semibold'>
                  {formatPrice(account.revenue)}
                </span>
                <span
                  className={`shadow-md text-xs px-1 py-[3px] select-none rounded-md font-body`}
                  style={{
                    background: account.category.color,
                  }}
                >
                  <span className='bg-white tex-dark rounded-md px-1 text-[11px]'>
                    {account.category.title}
                  </span>
                </span>
              </div>
            </div>
          ))}
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
