'use client'

import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { memo, useCallback, useState } from 'react'
import ShortPagination from './layouts/ShortPagination'

interface QuickSortTabsProps {
  searchParams?: { [key: string]: string[] }
  amount: number
  className?: string
}

function QuickSortTabs({ searchParams, amount, className = '' }: QuickSortTabsProps) {
  // hook
  const pathname = usePathname()
  const router = useRouter()

  const [sort, setSort] = useState(searchParams?.sort || 'related')

  // handle quick sort
  const handleSort = useCallback(
    (value: string) => {
      setSort(value)

      if (searchParams) {
        delete searchParams.sort
        if (value !== 'related') {
          searchParams.sort = [value]
        }
      }

      // handle query
      const query = handleQuery({
        ...searchParams,
      })

      router.push(pathname + query, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  return (
    <div className={`flex w-full flex-wrap gap-2 ${className}`}>
      {[
        {
          label: 'Liên quan',
          value: 'related',
        },
        {
          label: 'Phổ biến',
          value: 'popular',
        },
        {
          label: 'Mới nhất',
          value: 'newest',
        },
        {
          label: 'Cũ nhất',
          value: 'oldest',
        },
        {
          label: 'Yêu thích nhất',
          value: 'most-favorite',
        },
      ].map((item, index) => (
        <button
          className={`trans-300 flex h-[42px] items-center justify-center text-nowrap rounded-3xl border-2 border-secondary px-2 py-1 font-body text-sm font-semibold tracking-wider text-secondary shadow-md hover:border-secondary hover:bg-primary hover:text-dark hover:shadow-lg hover:drop-shadow-lg md:px-3 md:text-lg ${
            sort === item.value ? 'bg-primary text-dark' : ''
          }`}
          onClick={() => handleSort(item.value)}
          key={index}
        >
          {item.label}
        </button>
      ))}

      {/* Mini Pagination */}
      <ShortPagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={16}
        className="hidden flex-1 justify-end md:flex"
      />
    </div>
  )
}

export default memo(QuickSortTabs)
