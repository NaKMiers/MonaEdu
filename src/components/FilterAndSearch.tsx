'use client'

import { categories } from '@/constants/categories'
import { ICategory } from '@/models/CategoryModel'
import Slider from '@mui/material/Slider'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import Divider from './Divider'
import SearchBar from './SearchBar'
import { usePathname } from 'next/navigation'

interface FilterAndSearchProps {
  subs: ICategory[]
  className?: string
}

function FilterAndSearch({ subs, className = '' }: FilterAndSearchProps) {
  // hook
  const pathname = usePathname()

  // states
  const [price, setPrice] = useState<number[]>([50, 400])
  const [time, setTime] = useState<number[]>([10, 30])

  const [showSortPrice, setShowSortPrice] = useState(false)
  const [sortPrice, setSortPrice] = useState<'asc' | 'desc' | 'none'>('none')

  const [showSortTime, setShowSortTime] = useState(false)
  const [sortTime, setSortTime] = useState<'asc' | 'desc' | 'none'>('none')

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Search */}
      <SearchBar />

      <Divider size={2} />

      {/* Sub Categories */}
      <div>
        <h3 className='px-2 font-semibold font-body tracking-wide hover:tracking-widest trans-200 text-lg'>
          Danh Mục Con
        </h3>

        <Divider size={4} />

        <div className='flex flex-col gap-2.5'>
          {subs.map(category => (
            <Link
              href={`/${pathname}/${category.slug}`}
              className='rounded-lg hover:rounded-3xl border-b-2 border-neutral-700 drop-shadow-lg shadow-md py-2 px-3 trans-300'
              key={category.title}
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>

      <Divider size={1} border />

      {/* Filter */}
      <div>
        <h3 className='px-2 font-semibold font-body tracking-wide hover:tracking-widest trans-200 text-lg'>
          Bộ lọc
        </h3>

        <Divider size={4} />

        {/* Price Range */}
        <div className='rounded-medium shadow-lg border-2 border-dark px-3 py-2'>
          <p className='flex justify-between gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
            Giá:{' '}
            <span>
              {time[0]} - {price[1]} đ
            </span>
          </p>

          <Slider
            getAriaLabel={() => 'Temperature range'}
            value={price}
            min={100}
            max={500}
            className='w-full text-slate-700 -mb-1.5'
            onChange={(_, newValue: number | number[]) => setPrice(newValue as number[])}
            valueLabelDisplay='auto'
          />
        </div>

        <Divider size={4} />

        {/* Time Range */}
        <div className='rounded-medium shadow-lg border-2 border-dark px-3 py-2'>
          <p className='flex justify-between gap-3 font-body tracking-wider text-slate-700 drop-shadow-md'>
            Thời lượng:{' '}
            <span>
              {time[0]} - {time[1]} giờ
            </span>
          </p>

          <Slider
            getAriaLabel={() => 'Temperature range'}
            value={time}
            min={0}
            max={40}
            className='w-full text-slate-700 -mb-1.5'
            onChange={(_, newValue: number | number[]) => setTime(newValue as number[])}
            valueLabelDisplay='auto'
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
                  className='bg-slate-100 absolute z-20 -top-0.5 -left-0.5 min-w-max overflow-hidden flex flex-col rounded-lg shadow-lg border-2 border-dark'
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
            onClick={() => setShowSortTime(prev => !prev)}
          >
            {sortTime === 'asc' ? 'Tăng dần' : sortTime === 'desc' ? 'Giảm dần' : 'Không'}

            <AnimatePresence>
              {showSortTime && (
                <motion.ul
                  initial={{ translateY: 10, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  exit={{ translateY: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='bg-slate-100 absolute z-20 -top-0.5 -left-0.5 min-w-max overflow-hidden flex flex-col rounded-lg shadow-lg border-2 border-dark'
                >
                  <li
                    className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                      sortTime === 'none' ? 'bg-slate-200' : ''
                    }`}
                    onClick={() => setSortTime('none')}
                  >
                    Không
                  </li>
                  <li
                    className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                      sortTime === 'asc' ? 'bg-slate-200' : ''
                    }`}
                    onClick={() => setSortTime('asc')}
                  >
                    Tăng dần
                  </li>
                  <li
                    className={`hover:bg-slate-200 px-1 py-1 trans-200 cursor-pointer ${
                      sortTime === 'desc' ? 'bg-slate-200' : ''
                    }`}
                    onClick={() => setSortTime('desc')}
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
  )
}

export default FilterAndSearch
