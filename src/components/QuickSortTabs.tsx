'use client'

import { useCallback, useState } from 'react'
import ShortPagination from './layouts/ShortPagination'
import { usePathname, useRouter } from 'next/navigation'
import { handleQuery } from '@/utils/handleQuery'

interface QuickSortTabsProps {
  searchParams?: { [key: string]: string[] }
  amount: number
  className?: string
}

function QuickSortTabs({ searchParams, amount, className = '' }: QuickSortTabsProps) {
  // hook
  const pathname = usePathname()
  const router = useRouter()

  const [sort, setSort] = useState('related')

  console.log('searchParams:', searchParams)

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

      router.push(pathname + query)
    },
    [searchParams, router, pathname]
  )

  return (
    <div className={`flex flex-wrap gap-2 w-full ${className}`}>
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
          className={`rounded-3xl text-nowrap shadow-md px-2 md:px-3 py-1 flex items-center justify-center h-[42px] text-sm md:text-lg font-semibold font-body tracking-wider border-2 border-secondary hover:border-secondary hover:bg-primary text-secondary hover:drop-shadow-lg hover:text-dark hover:shadow-lg trans-300 ${
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
        className='justify-end hidden md:flex flex-1'
      />
    </div>
  )
}

export default QuickSortTabs
