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
  chops?: any
  className?: string
}

function FilterAndSearch({ searchParams, subs, chops, className = '' }: FilterAndSearchProps) {
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

  const [price, setPrice] = useState<number[]>([chops?.minPrice || 0, chops?.maxPrice || 1000000])
  const [duration, setDuration] = useState<number[]>([0, 40])

  const [showSortPrice, setShowSortPrice] = useState(false)
  const [sortPrice, setSortPrice] = useState<'asc' | 'desc' | 'none'>('none')

  const [showSortDuration, setShowSortDuration] = useState(false)
  const [sortDuration, setSortDuration] = useState<'asc' | 'desc' | 'none'>('none')

  // refs
  const timeoutCtg = useRef<any>(null)

  // handle submit filter
  const handleFilter = useCallback(async () => {
    let params: any = {
      search: search.trim(),
      price: price.join('-'),
      duration: duration.join('-'),
    }

    if (sortPrice !== 'none') {
      params.sortPrice = sortPrice
    } else {
      if (searchParams) {
        delete searchParams.sortPrice
      }
      delete params.sortDuration
    }
    if (sortDuration !== 'none') {
      params.sortDuration = sortDuration
    } else {
      if (searchParams) {
        delete searchParams.sortDuration
      }
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
      <div className={`hidden w-full flex-col gap-3 md:flex ${className}`}>
        {/* Search */}
        <div className="group/btn relative h-[42px] w-full overflow-hidden rounded-3xl bg-neutral-800 shadow-lg">
          <input
            id="search"
            className="h-full w-full bg-transparent py-2 pl-4 pr-[42px] text-sm text-slate-300 outline-none"
            disabled={false}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Bạn muốn học gì..."
          />
          <BottomGradient />
          <button
            className="group absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400"
            onClick={() => setSearch('')}
          >
            <FaDeleteLeft
              size={18}
              className="wiggle"
            />
          </button>
        </div>

        {/* Sub Categories */}
        {!!subs.length && (
          <div className="mt-2">
            <h3 className="trans-200 px-2 font-body text-lg font-semibold tracking-wide hover:tracking-widest">
              Danh Mục Con
            </h3>

            <Divider size={4} />

            <div className="flex flex-col gap-2.5">
              {subs.map(category => (
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-md trans-300 rounded-lg border-b-2 border-neutral-700 px-3 py-1 font-body text-sm tracking-wider shadow-md drop-shadow-lg hover:rounded-3xl"
                  key={category.title}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!!subs.length && (
          <Divider
            size={1}
            border
          />
        )}

        {/* Filter */}
        <div>
          <h3 className="trans-200 px-2 font-body text-lg font-semibold tracking-wide hover:tracking-widest">
            Bộ lọc
          </h3>

          <Divider size={4} />

          {/* Price Range */}
          <div className="rounded-medium border-2 border-dark px-5 py-2 shadow-lg">
            <p className="-mx-2 flex justify-between gap-3 font-body tracking-wider text-slate-700 drop-shadow-md">
              Giá:{' '}
              <span>
                {formatPrice(price[0])} - {formatPrice(price[1])}
              </span>
            </p>

            <Slider
              value={price}
              min={chops?.minPrice || 0}
              max={chops?.maxPrice || 1000000}
              step={10000}
              className="-mb-1.5 w-full"
              onChange={(_: any, newValue: number | number[]) => setPrice(newValue as number[])}
              valueLabelDisplay="auto"
              style={{ color: '#333' }}
            />
          </div>

          <Divider size={4} />

          {/* Time Range */}
          <div className="rounded-medium border-2 border-dark px-5 py-2 shadow-lg">
            <p className="-mx-2 flex justify-between gap-3 font-body tracking-wider text-slate-700 drop-shadow-md">
              Thời lượng:{' '}
              <span>
                {duration[0]} - {duration[1]} giờ
              </span>
            </p>

            <Slider
              value={duration}
              min={0}
              max={40}
              className="-mb-1.5 w-full"
              onChange={(_: any, newValue: number | number[]) => setDuration(newValue as number[])}
              valueLabelDisplay="auto"
              style={{ color: '#333' }}
            />
          </div>
        </div>

        <Divider
          size={1}
          border
        />

        {/* Sort */}
        <div>
          <h3 className="trans-200 px-2 font-body text-lg font-semibold tracking-wide hover:tracking-widest">
            Sắp xếp
          </h3>

          <Divider size={4} />

          {/* Sort Price */}
          <div className="relative z-10 flex items-center gap-3 font-body tracking-wider text-slate-700 drop-shadow-md">
            Giá:{' '}
            <div
              className="relative cursor-pointer rounded-lg border-2 border-dark px-2 py-1 text-sm"
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
                    className="absolute -left-0.5 -top-0.5 z-20 flex min-w-max select-none flex-col overflow-hidden rounded-lg border-2 border-dark bg-slate-100 shadow-lg"
                  >
                    <li
                      className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
                        sortPrice === 'none' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortPrice('none')}
                    >
                      Không
                    </li>
                    <li
                      className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
                        sortPrice === 'asc' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortPrice('asc')}
                    >
                      Tăng dần
                    </li>
                    <li
                      className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
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
          <div className="relative flex items-center gap-3 font-body tracking-wider text-slate-700 drop-shadow-md">
            Thời lượng:{' '}
            <div
              className="relative cursor-pointer rounded-lg border-2 border-dark px-2 py-1 text-sm"
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
                    className="absolute -left-0.5 -top-0.5 z-20 flex min-w-max select-none flex-col overflow-hidden rounded-lg border-2 border-dark bg-slate-100 shadow-lg"
                  >
                    <li
                      className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
                        sortDuration === 'none' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortDuration('none')}
                    >
                      Không
                    </li>
                    <li
                      className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
                        sortDuration === 'asc' ? 'bg-slate-200' : ''
                      }`}
                      onClick={() => setSortDuration('asc')}
                    >
                      Tăng dần
                    </li>
                    <li
                      className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
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
      <div className="flex w-full items-center justify-between gap-3 border-b border-dark pb-5 pt-3 md:hidden">
        {!!subs.length ? (
          <button
            className="text-md trans-300 group flex items-center justify-center gap-2 text-nowrap rounded-lg border-b-2 border-neutral-700 px-3 py-1 font-body tracking-wider shadow-md drop-shadow-lg hover:bg-primary"
            onClick={() => setOpenSubs(prev => !prev)}
          >
            <HiOutlineMenuAlt3
              size={16}
              className="wiggle"
            />
            <span>Danh mục con</span>
          </button>
        ) : (
          <div />
        )}

        <button
          className="text-md trans-300 group flex items-center justify-center gap-2 text-nowrap rounded-lg border-b-2 border-neutral-700 px-3 py-1 font-body tracking-wider shadow-md drop-shadow-lg hover:bg-primary"
          onClick={() => setOpenFilter(prev => !prev)}
        >
          <FiFilter
            size={16}
            className="wiggle"
          />
          <span>Bộ lọc</span>
        </button>

        {/* Sub Categories Sidebar */}
        <div
          className="trans-200 fixed left-0 top-0 z-50 hidden h-screen w-screen bg-black bg-opacity-10 opacity-0"
          onClick={() => setOpenSubs(false)}
          ref={subSidebarRef}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="trans-200 h-[calc(100%-72px)] w-[90%] max-w-[300px] -translate-x-full overflow-y-auto rounded-r-lg border-r-2 border-dark bg-white p-21 shadow-lg"
            ref={subSidebarMainRef}
          >
            <h3 className="text-xl font-semibold">Danh Mục Con</h3>

            <Divider size={4} />

            <div className="flex flex-col gap-2.5">
              {subs.map(category => (
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-md trans-300 rounded-lg border-b-2 border-neutral-700 px-3 py-1 font-body text-sm tracking-wider shadow-md drop-shadow-lg hover:rounded-3xl"
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
          className="trans-200 fixed left-0 top-0 z-50 hidden h-screen w-screen bg-black bg-opacity-10 opacity-0"
          onClick={() => setOpenFilter(false)}
          ref={filterSidebarRef}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="trans-200 ml-auto h-[calc(100%-72px)] w-[90%] max-w-[300px] translate-x-full overflow-auto rounded-l-lg border-l-2 border-dark bg-white p-21 shadow-lg"
            ref={filterSidebarMainRef}
          >
            <h3 className="text-xl font-semibold">Bộ lọc</h3>

            <Divider size={4} />

            {/* Price Range */}
            <div className="rounded-medium border-2 border-dark px-3 py-2 shadow-lg">
              <p className="flex justify-between gap-3 font-body tracking-wider text-slate-700 drop-shadow-md">
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
                className="-mb-1.5 w-full"
                onChange={(_: any, newValue: number | number[]) => setPrice(newValue as number[])}
                valueLabelDisplay="auto"
                style={{ color: '#333' }}
              />
            </div>

            <Divider size={4} />

            {/* Time Range */}
            <div className="rounded-medium border-2 border-dark px-3 py-2 shadow-lg">
              <p className="flex justify-between gap-3 font-body tracking-wider text-slate-700 drop-shadow-md">
                Thời lượng:{' '}
                <span>
                  {duration[0]} - {duration[1]} giờ
                </span>
              </p>

              <Slider
                value={duration}
                min={0}
                max={40}
                className="-mb-1.5 w-full"
                onChange={(_: any, newValue: number | number[]) => setDuration(newValue as number[])}
                valueLabelDisplay="auto"
                style={{ color: '#333' }}
              />
            </div>

            <Divider
              size={6}
              border
            />

            {/* Sort */}
            <h3 className="text-xl font-semibold">Sắp xếp</h3>

            <Divider size={4} />

            {/* Sort Price */}
            <div className="relative z-10 flex items-center gap-3 font-body tracking-wider text-slate-700 drop-shadow-md">
              Giá:{' '}
              <div
                className="relative cursor-pointer rounded-lg border-2 border-dark px-2 py-1 text-sm"
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
                      className="absolute -left-0.5 -top-0.5 z-20 flex min-w-max select-none flex-col overflow-hidden rounded-lg border-2 border-dark bg-slate-100 shadow-lg"
                    >
                      <li
                        className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
                          sortPrice === 'none' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortPrice('none')}
                      >
                        Không
                      </li>
                      <li
                        className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
                          sortPrice === 'asc' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortPrice('asc')}
                      >
                        Tăng dần
                      </li>
                      <li
                        className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
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
            <div className="relative flex items-center gap-3 font-body tracking-wider text-slate-700 drop-shadow-md">
              Thời lượng:{' '}
              <div
                className="relative cursor-pointer rounded-lg border-2 border-dark px-2 py-1 text-sm"
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
                      className="absolute -left-0.5 -top-0.5 z-20 flex min-w-max select-none flex-col overflow-hidden rounded-lg border-2 border-dark bg-slate-100 shadow-lg"
                    >
                      <li
                        className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
                          sortDuration === 'none' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortDuration('none')}
                      >
                        Không
                      </li>
                      <li
                        className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
                          sortDuration === 'asc' ? 'bg-slate-200' : ''
                        }`}
                        onClick={() => setSortDuration('asc')}
                      >
                        Tăng dần
                      </li>
                      <li
                        className={`trans-200 cursor-pointer px-1 py-1 hover:bg-slate-200 ${
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
