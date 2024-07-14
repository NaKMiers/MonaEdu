'use client'

import { handleQuery } from '@/utils/handleQuery'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { memo, useCallback, useEffect, useState } from 'react'

interface PaginationProps {
  searchParams: { [key: string]: string[] | string } | undefined
  amount: number
  itemsPerPage: number
  dark?: boolean
  className?: string
}

function Pagination({
  searchParams = {},
  amount = 0,
  itemsPerPage = 9, // default item/page
  className = '',
  dark,
}: PaginationProps) {
  // hooks
  const pathname = usePathname()
  const router = useRouter()
  const queryParams = useSearchParams()
  const page = queryParams.get('page')
  const [pageList, setPageList] = useState<(number | null)[]>([])

  // values
  const pageAmount = Math.ceil(amount / itemsPerPage) // calculate page amount
  const currentPage = page ? +page : 1

  // set page link
  const getPageLink = useCallback(
    (value: number) => {
      // get page from searchParams
      const params = { ...searchParams }
      if (params.page) {
        delete params.page
      }
      params.page = [value.toString()]

      return pathname + handleQuery(params)
    },
    [searchParams, pathname]
  )

  // calc page list
  useEffect(() => {
    if (pageAmount <= 5) {
      setPageList(Array.from({ length: pageAmount }, (_, index) => index + 1))
      return
    }

    if (currentPage <= 3) {
      setPageList([1, 2, 3, 4, null, pageAmount])
      return
    }

    if (currentPage >= pageAmount - 2) {
      setPageList([1, null, pageAmount - 3, pageAmount - 2, pageAmount - 1, pageAmount])
      return
    }

    setPageList([1, null, currentPage - 1, currentPage, currentPage + 1, null, pageAmount])
  }, [pageAmount, currentPage])

  // keyboard event
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // left arrow
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        router.push(getPageLink(currentPage - 1))
      }

      // right arrow
      if (e.key === 'ArrowRight' && currentPage < pageAmount) {
        router.push(getPageLink(currentPage + 1))
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [currentPage, pageAmount, router, getPageLink])

  return (
    pageAmount > 1 && (
      <div className={`flex font-semibold gap-2 justify-center w-full mx-auto ${className}`}>
        {/* MARK: Prev */}
        {currentPage != 1 && (
          <Link
            href={getPageLink(currentPage <= 1 ? 1 : currentPage - 1)}
            className='rounded-lg border-2 border-transparent py-[6px] px-2 bg-white hover:bg-secondary hover:border-white text-dark hover:text-white trans-200 border-slate-200'
            title={`👈 Trang ${currentPage <= 1 ? 1 : currentPage - 1}`}
          >
            Trước
          </Link>
        )}

        {/* MARK: 1 ... n */}
        <div className='flex gap-2'>
          {pageList.map((page) => (
            <Link
              href={getPageLink(page || 0)}
              onClick={(e) => page || e.preventDefault()}
              className={`rounded-lg border-2 py-[6px] px-4 hover:bg-secondary hover:text-white hover:border-white ${
                dark ? 'text-dark' : 'text-white'
              } ${!page ? 'pointer-events-none' : ''} trans-200 ${
                currentPage === page ? 'bg-primary border-white' : 'border-transparent'
              }`}
              key={page}
            >
              {page || '...'}
            </Link>
          ))}
        </div>

        {/* MARK: Next */}
        {currentPage != pageAmount && (
          <Link
            href={getPageLink(currentPage >= pageAmount ? pageAmount : currentPage + 1)}
            className='rounded-lg border-2 border-transparent py-[6px] px-2 bg-white hover:bg-secondary hover:border-white text-dark hover:text-white trans-200 border-slate-200'
            title={`👉 Trang ${currentPage >= pageAmount ? pageAmount : currentPage + 1}`}
          >
            Sau
          </Link>
        )}
      </div>
    )
  )
}

export default memo(Pagination)
