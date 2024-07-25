'use client'

import Divider from '@/components/Divider'
import Chart from '@/components/admin/Chart'
import Stats from '@/components/admin/Stats'
import CourseRankTab from '@/components/admin/tabs/CourseRankTab'
import CategoryRankTab from '@/components/admin/tabs/CategoryRankTab'
import RecentlySaleTab from '@/components/admin/tabs/RecentlySaleTab'
import TagRankTab from '@/components/admin/tabs/TagRankTab'
import UserSpendingRankTab from '@/components/admin/tabs/UserSpendingRank'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

function AdminPage() {
  // states
  const [by, setBy] = useState<'day' | 'month' | 'year'>('day')
  const [selectedChart, setSelectedChart] = useState<
    'Revenue' | 'New Orders' | 'Sale Accounts' | 'New Users' | 'Used Vouchers'
  >('Revenue')
  const [tab, setTab] = useState<number>(1)
  const [chartChunk, setChartChunk] = useState<number>(0)

  // tabs
  const tabs = useMemo(
    () => [
      <RecentlySaleTab className='h-[500px] overflow-y-scroll ' key={1} />,
      <CourseRankTab className='h-[500px] overflow-y-scroll' key={2} />,
      <UserSpendingRankTab className='h-[500px]' key={5} />,
      <CategoryRankTab className='h-[500px] overflow-y-scroll' key={3} />,
      <TagRankTab className='h-[500px] overflow-y-scroll' key={4} />,
    ],
    []
  )

  const prevChunk = () => {
    const curMonth = moment().month() + 1

    if (by === 'day' && chartChunk < curMonth) {
      setChartChunk(chartChunk + 1)
    } else if (by === 'month') {
      setChartChunk(chartChunk + 1)
    }
  }

  const nextChunk = () => {
    if (by === 'day' && chartChunk > 0) {
      setChartChunk(chartChunk - 1)
    } else if (by === 'month' && chartChunk > 0) {
      setChartChunk(chartChunk - 1)
    }
  }

  return (
    <div className='bg-white text-dark rounded-medium shadow-medium p-21'>
      {/* Statistical */}
      <h1 className='text-2xl font-semibold'>Dashboard</h1>

      {/* Filter By Time */}
      <div className='flex justify-end'>
        <select
          className='appearance-none p-2.5 font-semibold text-sm bg-dark-100 text-white focus:outline-none focus:ring-0 peer rounded-lg cursor-pointer'
          value={by}
          onChange={e => {
            setBy(e.target.value as never)
            setChartChunk(0)
          }}
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
      </div>

      <Divider size={4} />

      <div className='grid grid-cols-12 gap-x-21 gap-y-16'>
        {/* Stats */}
        <Stats by={by} className='col-span-12 grid grid-cols-5 gap-x-21 gap-y-21/2' />

        {/* Chart & Rank */}
        <div className='col-span-12 grid grid-cols-12 gap-21'>
          {/* BarChart */}
          <div className='col-span-12 lg:col-span-7'>
            <div className='flex gap-2 px-2'>
              {['Revenue', 'Orders', 'Courses', 'Used VC'].map((label, index) => (
                <span
                  className={`px-2 py-1 text-nowrap rounded-t-lg border border-b-0 cursor-pointer common-transition max-w-[100px] text-ellipsis line-clamp-1 block ${
                    selectedChart === label ? 'bg-dark-100 text-white border-transparent' : ''
                  }`}
                  onClick={() => setSelectedChart(label as never)}
                  title={label}
                  key={index}
                >
                  {label}
                </span>
              ))}

              {by !== 'year' && (
                <div className='flex flex-1 justify-end'>
                  <span
                    className={`flex items-center rounded-tl-md justify-center px-2 py-1 border border-b-0 cursor-pointer`}
                    title='Previous'
                    onClick={prevChunk}
                  >
                    <FaAngleLeft size={16} />
                  </span>
                  <span
                    className={`flex items-center rounded-tr-md justify-center px-2 py-1 border border-b-0 cursor-pointer`}
                    title='Next'
                    onClick={nextChunk}
                  >
                    <FaAngleRight size={16} />
                  </span>
                </div>
              )}
            </div>
            <div className='border p-21 rounded-lg shadow-lg'>
              <Chart chart={selectedChart} by={by} chunk={chartChunk} />
            </div>
          </div>

          {/* Rank */}
          <div className='col-span-12 lg:col-span-5'>
            <div className='flex gap-2 px-2'>
              {['Sales', 'Course', 'Expended', 'Category', 'Tag'].map((label, index) => (
                <span
                  className={`px-2 py-1 text-nowrap rounded-t-lg border border-b-0 cursor-pointer common-transition max-w-[100px] text-ellipsis line-clamp-1 block ${
                    tab === index + 1 ? 'bg-dark-100 text-white border-transparent' : ''
                  }`}
                  onClick={() => setTab(index + 1)}
                  title={label}
                  key={index}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className='border p-21 rounded-lg shadow-lg'>{tabs[tab - 1]}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
