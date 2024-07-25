import { getAllOrdersApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import {
  newCoursesSoldStatCalc,
  newOrderStatCalc,
  newUsedVoucherStatCalc,
  newUserStatCalc,
  revenueStatCalc,
} from '@/utils/stat'
import moment from 'moment'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch, FaDollarSign } from 'react-icons/fa'
import { MdNumbers } from 'react-icons/md'

interface statsProps {
  by: 'day' | 'month' | 'year'
  className?: string
}

function Stats({ by, className = '' }: statsProps) {
  const [loading, setLoading] = useState<boolean>(false)

  // states
  const [revenueStat, setRevenueStat] = useState<any>(null)
  const [newOrderStat, setNewOrderStat] = useState<any>(null)
  const [newCourseSoldStat, setNewCourseSoldStat] = useState<any>(null)
  const [newUserStat, setNewUserStat] = useState<any>(null)
  const [newUsedVoucherStat, setNewUsedVoucherStat] = useState<any>(null)

  useEffect(() => {
    const getOrders = async () => {
      // start loading
      setLoading(true)

      try {
        let from: string = ''
        const currentTime = moment()
        if (by === 'day') {
          from = currentTime.subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
        } else if (by === 'month') {
          from = currentTime.subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss')
        } else if (by === 'year') {
          from = currentTime.subtract(1, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss')
        }

        const query = `?limit=no-limit&status=done&sort=createdAt|-1&from-to=${from}|`
        const { orders } = await getAllOrdersApi(query)

        setRevenueStat(revenueStatCalc(orders))
        setNewOrderStat(newOrderStatCalc(orders))
        setNewCourseSoldStat(newCoursesSoldStatCalc(orders))
        setNewUserStat(newUserStatCalc(orders))
        setNewUsedVoucherStat(newUsedVoucherStatCalc(orders))
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
      {/* Revenue Stat */}
      <div className='col-span-full lg:col-span-1 p-21 rounded-lg shadow-lg bg-white'>
        <div className='flex justify-between items-center mb-3'>
          <span className='font-body tracking-wider text-lg'>Revenue</span>
          {loading ? (
            <FaCircleNotch size={18} className='animate-spin text-slate-400' />
          ) : (
            <FaDollarSign size={20} />
          )}
        </div>

        <p
          className='font-semibold text-3xl mb-3 text-ellipsis line-clamp-1 block'
          title={formatPrice(revenueStat?.[by][0] || 0)}
        >
          {formatPrice(revenueStat?.[by][0] || 0)}
        </p>
        <p
          className='text-slate-500 text-sm'
          title={`${revenueStat?.[by][2] > 0 ? '+' : ''}${revenueStat?.[by][2]}% from ${
            by === 'day' ? 'yesterday' : `last ${by}`
          }`}
        >
          {revenueStat?.[by][2] > 0 ? '+' : ''}
          {revenueStat?.[by][2] || 0}% from {by === 'day' ? 'yesterday' : `last ${by}`}
        </p>
      </div>

      {/* New Order Stat */}
      <div className='col-span-full lg:col-span-1 p-21 rounded-lg shadow-lg bg-white'>
        <div className='flex justify-between items-center mb-3'>
          <span className='font-body tracking-wider text-lg'>New Orders</span>
          {loading ? (
            <FaCircleNotch size={18} className='animate-spin text-slate-400' />
          ) : (
            <MdNumbers size={20} />
          )}
        </div>

        <p className='font-semibold text-3xl mb-3' title={newOrderStat?.[by][0] || 0}>
          {newOrderStat?.[by][0]}
        </p>
        <p
          className='text-slate-500 text-sm'
          title={`${newOrderStat?.[by][2] > 0 ? '+' : ''}${newOrderStat?.[by][2] || 0}% from ${
            by === 'day' ? 'yesterday' : `last ${by}`
          }`}
        >
          {newOrderStat?.[by][2] > 0 ? '+' : ''}
          {newOrderStat?.[by][2] || 0}% from {by === 'day' ? 'yesterday' : `last ${by}`}
        </p>
      </div>

      {/* Sale Account Stat */}
      <div className='col-span-full lg:col-span-1 p-21 rounded-lg shadow-lg bg-white'>
        <div className='flex justify-between items-center mb-3'>
          <span className='font-body tracking-wider text-lg'>Sale Accounts</span>
          {loading ? (
            <FaCircleNotch size={18} className='animate-spin text-slate-400' />
          ) : (
            <MdNumbers size={20} />
          )}
        </div>

        <p className='font-semibold text-3xl mb-3' title={newCourseSoldStat?.[by][0] || 0}>
          {newCourseSoldStat?.[by][0] || 0}
        </p>
        <p
          className='text-slate-500 text-sm'
          title={`${newCourseSoldStat?.[by][2] > 0 ? '+' : ''}${newCourseSoldStat?.[by][2] || 0}% from ${
            by === 'day' ? 'yesterday' : `last ${by}`
          }`}
        >
          {newCourseSoldStat?.[by][2] > 0 ? '+' : ''}
          {newCourseSoldStat?.[by][2] || 0}% from {by === 'day' ? 'yesterday' : `last ${by}`}
        </p>
      </div>

      {/* New User Stat */}
      <div className='col-span-full lg:col-span-1 p-21 rounded-lg shadow-lg bg-white'>
        <div className='flex justify-between items-center mb-3'>
          <span className='font-body tracking-wider text-lg'>New User</span>
          {loading ? (
            <FaCircleNotch size={18} className='animate-spin text-slate-400' />
          ) : (
            <MdNumbers size={20} />
          )}
        </div>

        <p className='font-semibold text-3xl mb-3' title={newUserStat?.[by][0] || 0}>
          {newUserStat?.[by][0] || 0}
        </p>
        <p
          className='text-slate-500 text-sm'
          title={`${newUserStat?.[by][2] > 0 ? '+' : ''}${newUserStat?.[by][2] || 0}% from ${
            by === 'day' ? 'yesterday' : `last ${by}`
          }`}
        >
          {newUserStat?.[by][2] > 0 ? '+' : ''}
          {newUserStat?.[by][2] || 0}% from {by === 'day' ? 'yesterday' : `last ${by}`}
        </p>
      </div>

      {/* Used Voucher Stat */}
      <div className='col-span-full lg:col-span-1 p-21 rounded-lg shadow-lg bg-white'>
        <div className='flex justify-between items-center mb-3'>
          <span className='font-body tracking-wider text-lg'>New Used VC</span>
          {loading ? (
            <FaCircleNotch size={18} className='animate-spin text-slate-400' />
          ) : (
            <MdNumbers size={20} />
          )}
        </div>

        <p className='font-semibold text-3xl mb-3' title={newUsedVoucherStat?.[by][0] || 0}>
          {newUsedVoucherStat?.[by][0] || 0}
        </p>
        <p
          className='text-slate-500 text-sm'
          title={`${newUsedVoucherStat?.[by][2] > 0 ? '+' : ''}${
            newUsedVoucherStat?.[by][2] || 0
          }% from ${by === 'day' ? 'yesterday' : `last ${by}`}`}
        >
          {newUsedVoucherStat?.[by][2] > 0 ? '+' : ''}
          {newUsedVoucherStat?.[by][2] || 0}% from {by === 'day' ? 'yesterday' : `last ${by}`}
        </p>
      </div>
    </div>
  )
}

export default Stats
