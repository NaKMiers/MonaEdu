'use client'

import { ICourse } from '@/models/CourseModel'
import { IOrder } from '@/models/OrderModel'
import { getAllCoursesApi, getAllOrdersApi } from '@/requests'
import { formatPrice } from '@/utils/number'
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
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  // get recently sale courses | packages
  const getCourses = useCallback(async (page: number) => {
    // start loading
    setLoading(true)

    try {
      const query = `?limit=15&sort=createdAt|-1&page=${page}`
      const { orders } = await getAllOrdersApi(query)

      const items = orders
        .map((order: IOrder) =>
          order.items.map((item: ICourse) => ({ ...item, saleTime: order.createdAt }))
        )
        .flat()

      return items
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [])

  // get recently sale courses | packages (on mount)
  useEffect(() => {
    // get (courses & packages) on mount
    const initialGetCourses = async () => {
      const items = await getCourses(1)
      setItems(items)
    }

    initialGetCourses()
  }, [getCourses])

  // handle load more
  const handleLoadMore = useCallback(async () => {
    const newCourses = await getCourses(page + 1)
    setPage(page + 1)
    setItems(prev => [...prev, ...newCourses])
  }, [getCourses, setItems, page])

  return (
    <div className={`${className}`}>
      <div className='flex flex-col gap-2 mb-2'>
        {items.map((item, index) => {
          const minutesAgo = moment().diff(moment(item.saleTime), 'minutes')

          let color
          if (minutesAgo <= 30) {
            color = 'green-500'
          } else if (minutesAgo <= 60) {
            color = 'sky-500'
          } else if (minutesAgo <= 120) {
            color = 'yellow-400'
          } else {
            color = 'default'
          }

          return (
            <div
              className='flex flex-col bg-slate-100 border border-dark rounded-lg shadow-lg p-2 text-dark'
              key={index}
            >
              <div className='flex items-start gap-2.5'>
                {item?.images?.[0] && (
                  <Link
                    href={`/${item.slug}`}
                    className='aspect-video rounded-md shadow-lg overflow-hidden flex-shrink-0 w-full max-w-[60px]'
                  >
                    <Image
                      className='w-full h-full object-cover'
                      src={item.images[0]}
                      width={60}
                      height={40}
                      alt={item.title}
                      loading='lazy'
                    />
                  </Link>
                )}
                <div className='flex flex-col'>
                  <p className='font-body tracking-wider font-semibold -mt-1'>{item.title}</p>
                  <p>
                    <span className='text-xs'>Revenue</span>:{' '}
                    <span className='font-semibold'>{formatPrice(item.revenue)}</span>
                  </p>
                </div>
              </div>
              <p className={`text-ellipsis line-clamp-1 text-sm text-${color}`}>
                {moment(item.begin).format('DD/MM/YYYY HH:mm:ss')}
              </p>
            </div>
          )
        })}
      </div>

      <div className='flex items-center justify-center'>
        <button
          className={`flex items-center justify-center font-semibold rounded-md px-3 h-8 text-sm text-light border-2 hover:bg-white hover:text-dark common-transition ${
            loading ? 'pointer-events-none bg-white border-slate-400' : 'bg-dark-100 border-dark'
          }`}
          onClick={handleLoadMore}
        >
          {loading ? (
            <FaCircleNotch size={18} className='animate-spin text-slate-400' />
          ) : (
            <span>({items.length}) Load more...</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default RecentlySaleTab
