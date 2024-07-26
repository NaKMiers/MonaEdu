'use client'

import BottomGradient from '@/components/gradients/BottomGradient'
import Input from '@/components/Input'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IOrder } from '@/models/OrderModel'
import { IVoucher } from '@/models/VoucherModel'
import { getOrderHistoryApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { Slider } from '@mui/material'
import moment from 'moment-timezone'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiSolidDiscount } from 'react-icons/bi'
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from 'react-icons/bs'
import { FaCalendar, FaDollarSign, FaGift, FaSlackHash, FaSort } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'
import { MdDateRange } from 'react-icons/md'
import { TbRosetteDiscountCheckFilled } from 'react-icons/tb'

function HistoryPage({ searchParams }: { searchParams?: { [key: string]: string[] | string } }) {
  // hook
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [orders, setOrders] = useState<IOrder[]>([])
  const [amount, setAmount] = useState<number>(0)

  // values
  const itemPerPage = 9
  const [minTotal, setMinTotal] = useState<number>(0)
  const [maxTotal, setMaxTotal] = useState<number>(0)
  const [total, setTotal] = useState<number[]>([0, 0])
  const [search, setSearch] = useState<string>('')
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [sort, setSort] = useState<string>('createdAt|-1')

  // search & filter & sort
  const preventFilter = useRef<boolean>(true)
  const [openSidebar, setOpenSidebar] = useState<boolean>(false)

  // refs
  const timeout = useRef<any>(null)

  const defaultValues: FieldValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'createdAt|-1',
      from: '',
      to: '',
    }),
    []
  )
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues,
  })

  // get order history
  useEffect(() => {
    // get user's order history
    const getOrderHistory = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { orders, amount, chops } = await getOrderHistoryApi(query)
        setOrders(orders)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))

        // sync search params to states
        // set min - max - total
        setMinTotal(chops?.minTotal || 0)
        setMaxTotal(chops?.maxTotal || 0)
        if (searchParams?.total) {
          const [from, to] = Array.isArray(searchParams.total)
            ? searchParams.total[0].split('-')
            : searchParams.total.split('-')
          setTotal([+from, +to])
        } else {
          setTotal([chops?.minTotal || 0, chops?.maxTotal || 0])
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    if (curUser) {
      getOrderHistory()
    }
  }, [dispatch, curUser, getValues, searchParams, setValue])

  // handle submit filter
  const handleFilter = useCallback(() => {
    const params: any = {
      search: search.trim(),
      total: `${total[0]}-${total[1]}`,
      sort,
    }

    const fromTo = (from || '') + '|' + (to || '')
    if (fromTo !== '|') {
      params['from-to'] = fromTo
    }

    // handle query
    const query = handleQuery({
      ...searchParams,
      ...params,
    })

    // push to router
    router.push(pathname + query)
  }, [pathname, router, searchParams, search, total, sort, from, to])

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

    clearTimeout(timeout.current)

    timeout.current = setTimeout(() => {
      handleFilter()
    }, 500)
  }, [handleFilter])

  return (
    <div className='w-full py-21'>
      {/* Background */}
      <div className='fixed z-[-1] top-0 bottom-0 left-0 right-0 grid grid-cols-12'>
        <div className='col-span-3 bg-dark-100' />
        <div className='col-span-9 bg-slate-300' />
      </div>

      <div className='min-h-screen flex'>
        <div className='relative grid grid-cols-12 w-full'>
          {/* Filter & Search */}
          <div
            className={`${
              openSidebar ? '' : '-translate-x-full'
            } md:translate-x-0 trans-300 absolute top-0 left-0 w-full h-full md:static md:col-span-3 px-21/2 md:pl-21 md:pr-21/2`}
          >
            <div className='bg-white rounded-lg shadow-lg w-full h-full p-3 flex flex-col gap-6'>
              {/* Search */}
              <div className='flex items-center gap-4'>
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

                <button
                  className={`md:hidden group rounded-lg py-1.5 trans-300`}
                  onClick={() => setOpenSidebar(!openSidebar)}
                >
                  <BsLayoutSidebarInset size={20} className='wiggle' />
                </button>
              </div>

              <div className='flex flex-col'>
                <label htmlFor='total'>
                  <span className='font-bold'>Tổng: </span>
                  <span>{formatPrice(total[0])}</span> - <span>{formatPrice(total[1])}</span>
                </label>
                <div className='px-3'>
                  <Slider
                    value={total}
                    min={minTotal}
                    max={maxTotal}
                    step={1}
                    className='w-full -mb-1.5'
                    onChange={(_, newValue: number | number[]) => setTotal(newValue as number[])}
                    valueLabelDisplay='auto'
                    style={{ color: '#333' }}
                  />
                </div>
              </div>

              {/* From To */}
              <Input
                id='from'
                label='Từ ngày'
                disabled={false}
                register={register}
                errors={errors}
                type='date'
                icon={FaCalendar}
                className='w-full'
                onFocus={() => clearErrors('from')}
                onChange={(e: any) => {
                  setFrom(e.target.value)
                }}
              />

              <Input
                id='to'
                label='Đến ngày'
                disabled={false}
                register={register}
                errors={errors}
                type='date'
                icon={FaCalendar}
                className='w-full'
                onFocus={() => clearErrors('to')}
                onChange={(e: any) => setTo(e.target.value)}
              />

              {/* Sort */}
              <Input
                id='sort'
                label='Sắp xếp'
                disabled={false}
                register={register}
                errors={errors}
                icon={FaSort}
                type='select'
                onFocus={() => clearErrors('')}
                options={[
                  {
                    value: 'createdAt|-1',
                    label: 'Mới nhất',
                    selected: true,
                  },
                  {
                    value: 'createdAt|1',
                    label: 'Cũ nhất',
                  },
                ]}
                onChange={(e: any) => setSort(e.target.value)}
              />
            </div>
          </div>

          {/* History List */}
          <div className='col-span-12 md:col-span-9 px-21/2 md:pr-21 md:pl-21/2'>
            <div className='flex flex-col bg-white rounded-lg shadow-lg w-full h-full'>
              <div className='flex items-center justify-between md:justify-end flex-wrap gap-4'>
                <button
                  className={`md:hidden flex-shrink-0 overflow-hidden group rounded-lg trans-300 p-3`}
                  onClick={() => setOpenSidebar(!openSidebar)}
                >
                  <BsLayoutSidebarInsetReverse size={20} className='wiggle' />
                </button>
                <div className='p-3 text-sm text-right text-dark font-semibold'>
                  {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} đơn hàng
                </div>
              </div>

              {orders.map(order => (
                <div className='p-4 border-b border-dark' key={order._id}>
                  <div className='flex justify-between flex-wrap gap-3 text-sm'>
                    <p className='flex items-center gap-1.5 text-yellow-500'>
                      <FaSlackHash size={16} className='-mr-1' />
                      <span className='font-semibold'>Mã đơn hàng: </span>
                      <span className='text-slate-700'>{order.code}</span>
                    </p>
                  </div>
                  <div className='flex justify-between flex-wrap gap-3 text-sm'>
                    <p className='flex items-center gap-1.5 text-sky-500'>
                      <FaDollarSign size={16} className='-mr-1' />
                      <span className='font-semibold'>Tổng: </span>
                      <span className='text-slate-700'>{formatPrice(order.total)}</span>
                    </p>
                    <p className='flex items-center gap-1.5 text-slate-500'>
                      <MdDateRange size={16} />
                      <span className='font-semibold'>Ngày mua hàng: </span>
                      <span>{moment(order.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                    </p>
                  </div>
                  {order.voucher && order.discount && (
                    <div className='flex justify-between flex-wrap gap-3 text-sm mt-2'>
                      <p className='flex items-center gap-1.5 text-green-500'>
                        <TbRosetteDiscountCheckFilled size={16} />
                        <span className='font-semibold'>Giảm giá: </span>
                        <span className='text-slate-700'>{formatPrice(order.discount)}</span>
                      </p>
                      <p className='flex items-center gap-1.5 text-purple-500'>
                        <BiSolidDiscount size={16} />
                        <span className='font-semibold'>Voucher: </span>
                        <span>{(order.voucher as IVoucher)?.code}</span>
                      </p>
                    </div>
                  )}
                  {curUser && curUser.email !== order.email && (
                    <div className='flex justify-between flex-wrap gap-3 text-sm mt-2'>
                      <p className='flex items-center gap-1.5 text-rose-400'>
                        <FaGift size={16} />
                        <span className='font-semibold'>Tặng: </span>
                        <span className='text-slate-700'>{order.email}</span>
                      </p>
                    </div>
                  )}
                  {order.items.map((item: any, index: number) => (
                    <div className='flex gap-3 items-start mt-3' key={index}>
                      <Link
                        href={`/${item.slug}`}
                        className='aspect-video w-full max-w-[100px] rounded-lg shadow-lg overflow-hidden'
                      >
                        <Image
                          className='w-full h-full object-cover'
                          src={item.images[0]}
                          width={100}
                          height={80}
                          alt='thumbnail'
                          loading='lazy'
                        />
                      </Link>
                      <div className='flex-1 gap-0.5'>
                        <p className='font-body tracking-wider font-semibold text-lg -mt-1 leading-6'>
                          {item.title}
                        </p>
                      </div>
                      <Link
                        href={`/user/history/${order.code}`}
                        className='text-sm rounded-md shadow-lg bg-dark-100 text-light px-3 py-1.5 border border-dark hover:bg-primary hover:text-dark trans-200'
                      >
                        Chi tiết
                      </Link>
                    </div>
                  ))}
                </div>
              ))}

              <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
