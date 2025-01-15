'use client'

import Divider from '@/components/Divider'
import FallbackImage from '@/components/FallbackImage'
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
import { SiStatuspage } from 'react-icons/si'
import { TbRosetteDiscountCheckFilled, TbStatusChange } from 'react-icons/tb'

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
    router.push(pathname + query, { scroll: false })
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
    <div className="w-full py-21">
      {/* Background */}
      <div className="fixed bottom-0 left-0 right-0 top-0 z-[-1] grid grid-cols-12">
        <div className="col-span-3 bg-dark-100" />
        <div className="col-span-9 bg-slate-300" />
      </div>

      <div className="flex min-h-screen">
        <div className="relative grid w-full grid-cols-12">
          {/* MARK: Filter & Search */}
          <div
            className={`${
              openSidebar ? '' : '-translate-x-full'
            } trans-300 absolute left-0 top-0 z-10 h-full w-full px-21/2 md:static md:col-span-3 md:translate-x-0 md:pl-21 md:pr-21/2`}
          >
            <div className="flex h-full w-full flex-col gap-6 rounded-lg bg-white p-3 shadow-lg">
              {/* Search */}
              <div className="flex items-center gap-4">
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

                <button
                  className={`trans-300 group rounded-lg py-1.5 md:hidden`}
                  onClick={() => setOpenSidebar(!openSidebar)}
                >
                  <BsLayoutSidebarInset
                    size={20}
                    className="wiggle"
                  />
                </button>
              </div>

              <div className="flex flex-col">
                <label htmlFor="total">
                  <span className="font-bold">Tổng: </span>
                  <span>{formatPrice(total[0])}</span> - <span>{formatPrice(total[1])}</span>
                </label>
                <div className="px-3">
                  <Slider
                    value={total}
                    min={minTotal}
                    max={maxTotal}
                    step={1}
                    className="-mb-1.5 w-full"
                    onChange={(_: any, newValue: number | number[]) => setTotal(newValue as number[])}
                    valueLabelDisplay="auto"
                    style={{ color: '#333' }}
                  />
                </div>
              </div>

              {/* From To */}
              <Input
                id="from"
                label="Từ ngày"
                disabled={false}
                register={register}
                errors={errors}
                type="datetime-local"
                icon={FaCalendar}
                className="w-full"
                onFocus={() => clearErrors('from')}
                onChange={(e: any) => {
                  setFrom(e.target.value)
                }}
              />

              <Input
                id="to"
                label="Đến ngày"
                disabled={false}
                register={register}
                errors={errors}
                type="datetime-local"
                icon={FaCalendar}
                className="w-full"
                onFocus={() => clearErrors('to')}
                onChange={(e: any) => setTo(e.target.value)}
              />

              {/* Sort */}
              <Input
                id="sort"
                label="Sắp xếp"
                disabled={false}
                register={register}
                errors={errors}
                icon={FaSort}
                type="select"
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

          {/* MARK: History List */}
          <div className="col-span-12 px-21/2 md:col-span-9 md:pl-21/2 md:pr-21">
            <div className="flex h-full w-full flex-col rounded-lg bg-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4 md:justify-end">
                <button
                  className={`trans-300 group flex-shrink-0 overflow-hidden rounded-lg p-3 md:hidden`}
                  onClick={() => setOpenSidebar(!openSidebar)}
                >
                  <BsLayoutSidebarInsetReverse
                    size={20}
                    className="wiggle"
                  />
                </button>
                <div className="p-3 text-right text-sm font-semibold text-dark">
                  {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} đơn hàng
                </div>
              </div>

              {orders.map(order => (
                <div
                  className="border-b border-dark p-4"
                  key={order._id}
                >
                  <div className="flex flex-wrap justify-between gap-x-3 text-sm">
                    <p className="flex items-center gap-1.5 leading-7 text-yellow-500">
                      <FaSlackHash
                        size={16}
                        className="-mr-1"
                      />
                      <span className="font-semibold">Mã đơn hàng: </span>
                      <span className="text-slate-700">{order.code}</span>
                    </p>
                    <p className="flex items-center gap-1.5 leading-7">
                      <TbStatusChange
                        size={16}
                        className="-mr-1"
                      />
                      <span className="font-semibold">Trạng thái: </span>
                      <span
                        className={`${
                          order.status === 'pending'
                            ? 'text-yellow-500'
                            : order.status === 'done'
                              ? 'text-green-500'
                              : 'text-slate-300'
                        }`}
                      >
                        {order.status === 'pending'
                          ? 'Đang xử lí'
                          : order.status === 'done'
                            ? 'Hoàn tất'
                            : 'Đã hủy'}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-3 text-sm">
                    <p className="flex items-center gap-1.5 leading-7 text-sky-500">
                      <FaDollarSign
                        size={16}
                        className="-mr-1"
                      />
                      <span className="font-semibold">Tổng: </span>
                      <span className="text-slate-700">{formatPrice(order.total)}</span>
                    </p>
                    <p className="flex items-center gap-1.5 leading-7 text-slate-500">
                      <MdDateRange size={16} />
                      <span className="font-semibold">Ngày mua hàng: </span>
                      <span>{moment(order.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                    </p>
                  </div>
                  {order.voucher && order.discount && (
                    <div className="mt-2 flex flex-wrap justify-between gap-x-3 text-sm">
                      <p className="flex items-center gap-1.5 leading-7 text-green-500">
                        <TbRosetteDiscountCheckFilled size={16} />
                        <span className="font-semibold">Giảm giá: </span>
                        <span className="text-slate-700">{formatPrice(order.discount)}</span>
                      </p>
                      <p className="flex items-center gap-1.5 leading-7 text-purple-500">
                        <BiSolidDiscount size={16} />
                        <span className="font-semibold">Voucher: </span>
                        <span>{(order.voucher as IVoucher)?.code}</span>
                      </p>
                    </div>
                  )}
                  {curUser && curUser.email !== order.email && (
                    <div className="mt-2 flex flex-wrap justify-between gap-x-3 text-sm">
                      <p className="flex items-center gap-1.5 leading-7 text-rose-400">
                        <FaGift size={16} />
                        <span className="font-semibold">Tặng: </span>
                        <span className="text-slate-700">{order.email}</span>
                      </p>
                    </div>
                  )}
                  {order.items.map((item: any, index: number) => (
                    <div
                      className="mt-3 flex items-start gap-3"
                      key={index}
                    >
                      {!order.isPackage && (
                        <Link
                          href={`/${item.slug}`}
                          className="aspect-video w-full max-w-[100px] overflow-hidden rounded-lg shadow-lg"
                        >
                          <FallbackImage
                            className="h-full w-full object-cover"
                            src={item.images[0]}
                            width={100}
                            height={80}
                            alt={item.title}
                            loading="lazy"
                          />
                        </Link>
                      )}
                      <div className="flex-1 gap-0.5">
                        <p className="-mt-1 font-body text-lg font-semibold leading-6 tracking-wider">
                          {order.isPackage ? (
                            <>
                              <span>Gói học viên</span>:{' '}
                              <Link
                                href="/subscription"
                                className="underline"
                              >
                                {item.title}
                              </Link>
                            </>
                          ) : (
                            item.title
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <Divider size={10} />

              <Pagination
                dark
                searchParams={searchParams}
                amount={amount}
                itemsPerPage={itemPerPage}
              />

              <Divider size={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
