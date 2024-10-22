'use client'

import FallbackImage from '@/components/FallbackImage'
import { ICourse } from '@/models/CourseModel'
import { IOrder } from '@/models/OrderModel'
import { getAllOrdersApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useState } from 'react'
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
      <div className="mb-2 flex flex-col gap-2">
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
              className="flex flex-col rounded-lg border border-dark bg-slate-100 p-2 text-dark shadow-lg"
              key={index}
            >
              <div className="flex items-start gap-2.5">
                {item?.images?.[0] && (
                  <Link
                    href={`/${item.slug}`}
                    className="aspect-video w-full max-w-[60px] flex-shrink-0 overflow-hidden rounded-md shadow-lg"
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
              <p className={`line-clamp-1 text-ellipsis text-sm text-${color}`}>
                {moment(item.begin).format('DD/MM/YYYY HH:mm:ss')}
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center">
        <button
          className={`common-transition flex h-8 items-center justify-center rounded-md border-2 px-3 text-sm font-semibold text-light hover:bg-white hover:text-dark ${
            loading ? 'pointer-events-none border-slate-400 bg-white' : 'border-dark bg-dark-100'
          }`}
          onClick={handleLoadMore}
        >
          {loading ? (
            <FaCircleNotch
              size={18}
              className="animate-spin text-slate-400"
            />
          ) : (
            <span>({items.length}) Load more...</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default memo(RecentlySaleTab)
