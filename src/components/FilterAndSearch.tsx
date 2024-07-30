'use client'

import { ICategory } from '@/models/CategoryModel'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import Slider from '@mui/material/Slider'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { FaDeleteLeft } from 'react-icons/fa6'
import { FiFilter } from 'react-icons/fi'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import Divider from './Divider'
import BottomGradient from './gradients/BottomGradient'

interface FilterAndSearchProps {
  searchParams: { [key: string]: string[] | string } | undefined
  subs: ICategory[]
  className?: string
}

function FilterAndSearch({ searchParams, subs, className = '' }: FilterAndSearchProps) {
  // hook
  const pathname = usePathname()
  const router = useRouter()

  // states
  // sidebars on mobile
  const [openSubs, setOpenSubs] = useState<boolean>(false)
  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const subSidebarRef = useRef<HTMLDivElement>(null)
  const subSidebarMainRef = useRef<HTMLDivElement>(null)
  const filterSidebarRef = useRef<HTMLDivElement>(null)
  const filterSidebarMainRef = useRef<HTMLDivElement>(null)

  // search & filter & sort
  const preventFilter = useRef<boolean>(true)
  const [search, setSearch] = useState<string>('')

  const [price, setPrice] = useState<number[]>([0, 1000000])
  const [duration, setDuration] = useState<number[]>([0, 100])

  const [showSortPrice, setShowSortPrice] = useState(false)
  const [sortPrice, setSortPrice] = useState<'asc' | 'desc' | 'none'>('none')

  const [showSortDuration, setShowSortDuration] = useState(false)
  const [sortDuration, setSortDuration] = useState<'asc' | 'desc' | 'none'>('none')

  // refs
  const timeoutCtg = useRef<any>(null)

  // handle submit filter
  const handleFilter = useCallback(async () => {
    const params: any = {
      search: search.trim(),
      price: price.join('-'),
      duration: duration.join('-'),
    }

    if (sortPrice !== 'none') {
      params.sortPrice = sortPrice
    } else {
      delete params.sortPrice
    }
    if (sortDuration !== 'none') {
      params.sortDuration = sortDuration
    } else {
      delete params.sortDuration
    }

    // handle query
    const query = handleQuery({
      ...searchParams,
      ...params,
    })

    // push to router
    router.push(pathname + query, { scroll: false })
  }, [pathname, router, searchParams, search, price, sortPrice, sortDuration, duration])

  // sync search params with states
  useEffect(() => {
    // sync search params with states
    if (searchParams) {
      if (searchParams.search) {
        setSearch(searchParams.search as string)
      }

      if (searchParams.price) {
        const [from, to] = (searchParams.price as string).split('-')
        setPrice([+from, +to])
      }

      if (searchParams.duration) {
        const [from, to] = (searchParams.duration as string).split('-')
        setDuration([+from, +to])
      }

      if (searchParams.sortPrice) {
        setSortPrice(searchParams.sortPrice as 'asc' | 'desc')
      }

      if (searchParams.sortDuration) {
        setSortDuration(searchParams.sortDuration as 'asc' | 'desc')
      }
    }
  }, [searchParams])

  // auto filter after timeout (part-1): prevent filter when pathname change
  useEffect(() => {
    preventFilter.current = true
  }, [pathname])

  // auto filter after timeout (part-2): filter after timeout
  useEffect(() => {
    if (preventFilter.current) {
      preventFilter.current = false
      return
    }

    clearTimeout(timeoutCtg.current)

    timeoutCtg.current = setTimeout(() => {
      handleFilter()
    }, 500)
  }, [handleFilter, search, price, duration, sortPrice, sortDuration])

  // handle open sub categories
  useEffect(() => {
    if (openSubs) {
      if (!subSidebarRef.current) return

      subSidebarRef.current.classList.remove('hidden')
      setTimeout(() => {
        if (!subSidebarRef.current) return
        subSidebarRef.current.classList.remove('opacity-0')
      }, 0)

      setTimeout(() => {
        if (!subSidebarMainRef.current) return
        subSidebarMainRef.current.classList.remove('-translate-x-full')
      }, 200)
    } else {
      if (!subSidebarMainRef.current) return
      subSidebarMainRef.current.classList.add('-translate-x-full')

      setTimeout(() => {
        if (!subSidebarRef.current) return
        subSidebarRef.current.classList.add('opacity-0')

        setTimeout(() => {
          if (!subSidebarRef.current) return
          subSidebarRef.current.classList.add('hidden')
        }, 200)
      }, 200)
    }
  }, [openSubs])

  // handle open filter
  useEffect(() => {
    if (openFilter) {
      if (!filterSidebarRef.current) return

      filterSidebarRef.current.classList.remove('hidden')
      setTimeout(() => {
        if (!filterSidebarRef.current) return
        filterSidebarRef.current.classList.remove('opacity-0')
      }, 0)

      setTimeout(() => {
        if (!filterSidebarMainRef.current) return
        filterSidebarMainRef.current.classList.remove('translate-x-full')
      }, 200)
    } else {
      if (!filterSidebarMainRef.current) return
      filterSidebarMainRef.current.classList.add('translate-x-full')

      setTimeout(() => {
        if (!filterSidebarRef.current) return
        filterSidebarRef.current.classList.add('opacity-0')

        setTimeout(() => {
          if (!filterSidebarRef.current) return
          filterSidebarRef.current.classList.add('hidden')
        }, 200)
      }, 200)
    }
  }, [openFilter])

  return (
    <>
      {/* Desktop */}
      <div className={`hidden w-full md:flex flex-col gap-3 ${className}`}>
        {/* Search */}
        <div className='relative group/btn w-full h-[42px] rounded-3xl bg-neutral-800 shadow-lg overflow-hidden'>
          <input
            id='search'
            className='h-full w-full text-sm bg-transparent text-slate-300 outline-none pl-4 pr-[42px] py-2'
            disabled={false}
            type='text'
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Bạn muốn học gì...'
          />
          <BottomGradient />
          <button
            className='absolute top-1/2 right-2 -translate-y-1/2 group text-slate-400 p-1.5'
            onClick={() => setSearch('')}
          >
            <FaDeleteLeft size={18} className='wiggle' />
          </button>
        </div>

        <Divider size={2} />

        {/* Sub Categories */}
        {!!subs.length && (
          <div>
            <h3 className='px-2 font-semibold font-body tracking-wide hover:tracking-widest trans-200 text-lg'>
              Danh Mục Con
            </h3>

            <Divider size={4} />

            <div className='flex flex-col gap-2.5'>
              {subs.map(category => (
                <Link
                  href={`/categories/${category.slug}`}
                  className='rounded-lg hover:rounded-3xl border-b-2 border-neutral-700 drop-shadow-lg shadow-md text-md font-body tracking-wider text-sm py-1 px-3 trans-300'
                  key={category.title}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!!subs.length && <Divider size={1} border />}

        {/* Filter */}
        <div>
          <h3 className='px-2 font-semibold font-body tracking-wide hover:tracking-widest trans-200 text-lg'>
            Bộ lọc
          </h3>

          <Divider size={4} />

          {/* Price Range */}
          <div className='rounded-medium shadow-lg border-2 border-dark px-5 py-2'>
            <p className='flex justify-between -mx-2 gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
              Giá:{' '}
              <span>
                {formatPrice(price[0])} - {formatPrice(price[1])}
              </span>
            </p>

            <Slider
              value={price}
              min={0}
              max={1000000}
              step={10000}
              className='w-full -mb-1.5'
              onChange={(_, newValue: number | number[]) => setPrice(newValue as number[])}
              valueLabelDisplay='auto'
              style={{ color: '#333' }}
            />
          </div>

          <Divider size={4} />

          {/* Time Range */}
          <div className='rounded-medium shadow-lg border-2 border-dark px-5 py-2'>
            <p className='flex justify-between -mx-2 gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
              Thời lượng:{' '}
              <span>
                {duration[0]} - {duration[1]} giờ
              </span>
            </p>

            <Slider
              value={duration}
              min={0}
              max={100}
              className='w-full -mb-1.5'
              onChange={(_, newValue: number | number[]) => setDuration(newValue as number[])}
              valueLabelDisplay='auto'
              style={{ color: '#333' }}
            />
          </div>
        </div>

        <Divider size={1} border />

        {/* Sort */}
        <div>
          <h3 className='px-2 font-semibold font-body tracking-wide hover:tracking-widest trans-200 text-lg'>
            Sắp xếp
          </h3>

          <Divider size={4} />

          {/* Sort Price */}
          <div className='relative z-10 flex items-center gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
            Giá:{' '}
            <div
              className='relative rounded-lg border-2 border-dark px-2 py-1 text-sm cursor-pointer'
              onClick={() => setShowSortPrice(prev => !prev)}
            >
              {sortPrice === 'asc' ? 'Tăng dần' : sortPrice === 'desc' ? 'Giảm dần' : 'Không'}

              <AnimatePresence>
                {showSortPrice && (
                  <motion.ul
                    initial={{ translateY: 10, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    exit={{ translateY: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='bg-slate-100 select-none absolute z-20 -top-0.5 -left-0.5 min-w-max overflow-hidden flex flex-col rounded-lg shadow-lg border-2 border-dark'
                  >
                    <li
                      className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                        sortPrice === 'none' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortPrice('none')}
                    >
                      Không
                    </li>
                    <li
                      className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                        sortPrice === 'asc' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortPrice('asc')}
                    >
                      Tăng dần
                    </li>
                    <li
                      className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                        sortPrice === 'desc' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortPrice('desc')}
                    >
                      Giảm dần
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Divider size={4} />

          {/* Sort Time */}
          <div className='relative flex items-center gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
            Thời lượng:{' '}
            <div
              className='relative rounded-lg border-2 border-dark px-2 py-1 text-sm cursor-pointer'
              onClick={() => setShowSortDuration(prev => !prev)}
            >
              {sortDuration === 'asc' ? 'Tăng dần' : sortDuration === 'desc' ? 'Giảm dần' : 'Không'}

              <AnimatePresence>
                {showSortDuration && (
                  <motion.ul
                    initial={{ translateY: 10, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    exit={{ translateY: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='bg-slate-100 select-none absolute z-20 -top-0.5 -left-0.5 min-w-max overflow-hidden flex flex-col rounded-lg shadow-lg border-2 border-dark'
                  >
                    <li
                      className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                        sortDuration === 'none' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortDuration('none')}
                    >
                      Không
                    </li>
                    <li
                      className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                        sortDuration === 'asc' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortDuration('asc')}
                    >
                      Tăng dần
                    </li>
                    <li
                      className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                        sortDuration === 'desc' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortDuration('desc')}
                    >
                      Giảm dần
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Divider size={8} />
      </div>

      {/* Mobile */}
      <div className='md:hidden flex justify-between w-full items-center gap-3 border-b border-dark pt-3 pb-5'>
        <button
          className='group flex items-center justify-center text-nowrap gap-2 rounded-lg border-b-2 hover:bg-primary border-neutral-700 drop-shadow-lg shadow-md text-md font-body tracking-wider py-1 px-3 trans-300'
          onClick={() => setOpenSubs(prev => !prev)}
        >
          <HiOutlineMenuAlt3 size={16} className='wiggle' />
          <span>Danh mục con</span>
        </button>

        <button
          className='group flex items-center justify-center text-nowrap gap-2 rounded-lg border-b-2 hover:bg-primary border-neutral-700 drop-shadow-lg shadow-md text-md font-body tracking-wider py-1 px-3 trans-300'
          onClick={() => setOpenFilter(prev => !prev)}
        >
          <FiFilter size={16} className='wiggle' />
          <span>Bộ lọc</span>
        </button>

        {/* Sub Categories Sidebar */}
        <div
          className='hidden opacity-0 trans-200 fixed z-50 top-0 left-0 h-screen w-screen bg-black bg-opacity-10'
          onClick={() => setOpenSubs(false)}
          ref={subSidebarRef}
        >
          <div
            onClick={e => e.stopPropagation()}
            className='-translate-x-full trans-200 bg-white w-[90%] max-w-[300px] h-[calc(100%-72px)] shadow-lg rounded-r-lg border-r-2 border-dark p-21 overflow-y-auto'
            ref={subSidebarMainRef}
          >
            <h3 className='text-xl font-semibold'>Danh Mục Con</h3>

            <Divider size={4} />

            <div className='flex flex-col gap-2.5'>
              {subs.map(category => (
                <Link
                  href={`/categories/${category.slug}`}
                  className='rounded-lg hover:rounded-3xl border-b-2 border-neutral-700 drop-shadow-lg shadow-md text-md font-body tracking-wider text-sm py-1 px-3 trans-300'
                  key={category.title}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Sidebar */}
        <div
          className='hidden opacity-0 trans-200 fixed z-50 top-0 left-0 h-screen w-screen bg-black bg-opacity-10'
          onClick={() => setOpenFilter(false)}
          ref={filterSidebarRef}
        >
          <div
            onClick={e => e.stopPropagation()}
            className='translate-x-full ml-auto trans-200 bg-white w-[90%] max-w-[300px] h-[calc(100%-72px)] shadow-lg rounded-l-lg border-l-2 border-dark p-21 overflow-auto'
            ref={filterSidebarMainRef}
          >
            <h3 className='text-xl font-semibold'>Bộ lọc</h3>

            <Divider size={4} />

            {/* Price Range */}
            <div className='rounded-medium shadow-lg border-2 border-dark px-3 py-2'>
              <p className='flex justify-between gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
                Giá:{' '}
                <span>
                  {duration[0]} - {price[1]} đ
                </span>
              </p>

              <Slider
                value={price}
                min={100}
                max={500}
                className='w-full -mb-1.5'
                onChange={(_, newValue: number | number[]) => setPrice(newValue as number[])}
                valueLabelDisplay='auto'
                style={{ color: '#333' }}
              />
            </div>

            <Divider size={4} />

            {/* Time Range */}
            <div className='rounded-medium shadow-lg border-2 border-dark px-3 py-2'>
              <p className='flex justify-between gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
                Thời lượng:{' '}
                <span>
                  {duration[0]} - {duration[1]} giờ
                </span>
              </p>

              <Slider
                value={duration}
                min={0}
                max={40}
                className='w-full -mb-1.5'
                onChange={(_, newValue: number | number[]) => setDuration(newValue as number[])}
                valueLabelDisplay='auto'
                style={{ color: '#333' }}
              />
            </div>

            <Divider size={6} border />

            {/* Sort */}
            <h3 className='text-xl font-semibold'>Sắp xếp</h3>

            <Divider size={4} />

            {/* Sort Price */}
            <div className='relative z-10 flex items-center gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
              Giá:{' '}
              <div
                className='relative rounded-lg border-2 border-dark px-2 py-1 text-sm cursor-pointer'
                onClick={() => setShowSortPrice(prev => !prev)}
              >
                {sortPrice === 'asc' ? 'Tăng dần' : sortPrice === 'desc' ? 'Giảm dần' : 'Không'}

                <AnimatePresence>
                  {showSortPrice && (
                    <motion.ul
                      initial={{ translateY: 10, opacity: 0 }}
                      animate={{ translateY: 0, opacity: 1 }}
                      exit={{ translateY: 10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className='bg-slate-100 select-none absolute z-20 -top-0.5 -left-0.5 min-w-max overflow-hidden flex flex-col rounded-lg shadow-lg border-2 border-dark'
                    >
                      <li
                        className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                          sortPrice === 'none' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortPrice('none')}
                      >
                        Không
                      </li>
                      <li
                        className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                          sortPrice === 'asc' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortPrice('asc')}
                      >
                        Tăng dần
                      </li>
                      <li
                        className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                          sortPrice === 'desc' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortPrice('desc')}
                      >
                        Giảm dần
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Divider size={4} />

            {/* Sort Time */}
            <div className='relative flex items-center gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
              Thời lượng:{' '}
              <div
                className='relative rounded-lg border-2 border-dark px-2 py-1 text-sm cursor-pointer'
                onClick={() => setShowSortDuration(prev => !prev)}
              >
                {sortDuration === 'asc' ? 'Tăng dần' : sortDuration === 'desc' ? 'Giảm dần' : 'Không'}

                <AnimatePresence>
                  {showSortDuration && (
                    <motion.ul
                      initial={{ translateY: 10, opacity: 0 }}
                      animate={{ translateY: 0, opacity: 1 }}
                      exit={{ translateY: 10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className='bg-slate-100 select-none absolute z-20 -top-0.5 -left-0.5 min-w-max overflow-hidden flex flex-col rounded-lg shadow-lg border-2 border-dark'
                    >
                      <li
                        className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                          sortDuration === 'none' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortDuration('none')}
                      >
                        Không
                      </li>
                      <li
                        className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                          sortDuration === 'asc' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortDuration('asc')}
                      >
                        Tăng dần
                      </li>
                      <li
                        className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                          sortDuration === 'desc' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortDuration('desc')}
                      >
                        Giảm dần
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(FilterAndSearch)
