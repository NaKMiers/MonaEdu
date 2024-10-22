import Divider from '@/components/Divider'
import FallbackImage from '@/components/FallbackImage'
import { getAllOrdersApi, getForceAllCategoriesApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { rankCourseRevenue } from '@/utils/stat'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface CourseRankTabProps {
  className?: string
}

function CourseRankTab({ className = '' }: CourseRankTabProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<any[]>([])
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

        const items = rankCourseRevenue(orders, categories)
        setItems(items)
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
            className="peer cursor-pointer appearance-none rounded-lg bg-dark-100 p-2.5 text-xs font-semibold text-light focus:outline-none focus:ring-0"
            value={by}
            onChange={e => setBy(e.target.value as never)}
          >
            <option
              className="bg-dark-100 p-5 font-body font-semibold tracking-wider text-light"
              value="day"
            >
              By Day
            </option>
            <option
              className="bg-dark-100 p-5 font-body font-semibold tracking-wider text-light"
              value="month"
            >
              By Month
            </option>
            <option
              className="bg-dark-100 p-5 font-body font-semibold tracking-wider text-light"
              value="year"
            >
              By Year
            </option>
          </select>

          <Divider size={4} />

          <div className="flex flex-col gap-2">
            {items.map((item, index) => (
              <div
                className="flex items-start gap-2.5 rounded-lg bg-slate-900 p-2 text-light shadow-lg"
                key={index}
              >
                {item?.images?.[0] && (
                  <Link
                    href={`/${item.slug}`}
                    className="aspect-video w-full max-w-[60px] flex-shrink-0 overflow-hidden rounded-sm"
                  >
                    <FallbackImage
                      className="h-full w-full object-cover"
                      src={item.images[0]}
                      width={60}
                      height={40}
                      alt={item.title}
                      loading="lazy"
                    />
                  </Link>
                )}
                <div className="flex flex-col">
                  <p className="-mt-1 font-body font-semibold tracking-wider">{item.title}</p>
                  <p>
                    <span className="text-xs">Revenue</span>:{' '}
                    <span className="font-semibold">{formatPrice(item.revenue)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <FaCircleNotch
            size={18}
            className="animate-spin text-slate-400"
          />
        </div>
      )}
    </div>
  )
}

export default memo(CourseRankTab)
