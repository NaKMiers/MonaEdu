'use client'

import Input from '@/components/Input'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import OrderItem from '@/components/admin/OrderItem'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IOrder } from '@/models/OrderModel'
import { cancelOrdersApi, deletedOrdersApi, getAllOrdersApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { toUTC } from '@/utils/time'
import { Slider } from '@mui/material'
import moment from 'moment-timezone'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendar, FaSearch, FaSort } from 'react-icons/fa'

function AllOrdersPage({ searchParams }: { searchParams?: { [key: string]: string | string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [orders, setOrders] = useState<IOrder[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // loading and confirming
  const [loadingOrders, setLoadingOrders] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minTotal, setMinTotal] = useState<number>(0)
  const [maxTotal, setMaxTotal] = useState<number>(0)
  const [total, setTotal] = useState<number[]>([0, 0])

  // Form
  const defaultValues: FieldValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
      userId: '',
      voucher: '',
      status: '',
      paymentMethod: '',
      from: '',
      to: '',
    }),
    []
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues,
  })

  // MARK: Get Data
  // get all orders
  useEffect(() => {
    const getAllOrders = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { orders, amount, chops } = await getAllOrdersApi(query) // cache: no-store

        // update orders from state
        setOrders(orders)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('userId', searchParams?.userId || getValues('userId'))
        setValue('voucher', searchParams?.voucher || getValues('voucher'))
        setValue('status', searchParams?.status || getValues('status'))
        setValue('paymentMethod', searchParams?.paymentMethod || getValues('paymentMethod'))
        setValue(
          'from',
          searchParams?.['from-to'] && (searchParams?.['from-to'] as string).split('|')[0]
            ? moment((searchParams['from-to'] as string).split('|')[0]).format('YYYY-MM-DDTHH:mm')
            : getValues('from')
        )
        setValue(
          'to',
          searchParams?.['from-to'] && (searchParams?.['from-to'] as string).split('|')[1]
            ? moment((searchParams['from-to'] as string).split('|')[1]).format('YYYY-MM-DDTHH:mm')
            : getValues('to')
        )

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
    getAllOrders()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // cancel orders
  const handleCancelOrders = useCallback(async (ids: string[]) => {
    try {
      // send request to server
      const { canceledOrders, message } = await cancelOrdersApi(ids)

      // update orders from state
      setOrders(prev =>
        prev.map(order =>
          canceledOrders.map((order: IOrder) => order._id).includes(order._id)
            ? { ...order, status: 'cancel' }
            : order
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete orders
  const handleDeleteOrders = useCallback(async (ids: string[]) => {
    setLoadingOrders(ids)

    try {
      // send request to server
      const { deletedOrders, message } = await deletedOrdersApi(ids)

      // remove deleted tags from state
      setOrders(prev =>
        prev.filter(order => !deletedOrders.map((order: IOrder) => order._id).includes(order._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingOrders([])
      setSelectedOrders([])
    }
  }, [])

  // handle optimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      // reset page
      if (searchParams?.page) {
        delete searchParams.page
      }

      // loop through data to prevent filter default
      for (let key in data) {
        if (data[key] === defaultValues[key]) {
          if (!searchParams?.[key]) {
            delete data[key]
          } else {
            data[key] = ''
          }
        }
      }

      // from | to
      const { from, to, ...rest } = data
      const fromTo = (from ? toUTC(from) : '') + '|' + (to ? toUTC(to) : '')
      console.log('fromTo', fromTo)
      if (fromTo !== '|') {
        rest['from-to'] = fromTo
      }

      return { ...rest, total: total[0] === minTotal && total[1] === maxTotal ? '' : total.join('-') }
    },
    [minTotal, maxTotal, total, searchParams, defaultValues]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...params,
      })

      // push to router
      router.push(pathname + query, { scroll: false })
    },
    [handleOptimizeFilter, router, searchParams, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname, { scroll: false })
  }, [reset, router, pathname])

  // keyboard event
  useEffect(() => {
    // page title
    document.title = 'All Orders - Mona Edu'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedOrders(prev => (prev.length === orders.length ? [] : orders.map(order => order._id)))
      }

      // Alt + Delete (Delete)
      if (e.altKey && e.key === 'Delete') {
        e.preventDefault()
        setIsOpenConfirmModal(true)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter, handleSubmit, orders])

  return (
    <div className="w-full">
      {/* MARK: Top & Pagination */}
      <AdminHeader title="All Orders" />
      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
      />

      {/* MARK: Filter */}
      <AdminMeta
        handleFilter={handleSubmit(handleFilter)}
        handleResetFilter={handleResetFilter}
      >
        {/* Search */}
        <div className="col-span-12 flex flex-col md:col-span-6">
          <Input
            id="search"
            className="md:max-w-[450px]"
            label="Search"
            disabled={false}
            register={register}
            errors={errors}
            type="text"
            icon={FaSearch}
            onFocus={() => clearErrors('search')}
          />
        </div>

        {/* Total */}
        <div className="col-span-12 flex flex-col md:col-span-6">
          <label htmlFor="total">
            <span className="font-bold">Total: </span>
            <span>{formatPrice(total[0])}</span> - <span>{formatPrice(total[1])}</span>
          </label>
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

        {/* From To */}
        <div className="col-span-12 flex flex-wrap gap-2 sm:flex-nowrap lg:col-span-6">
          <Input
            id="from"
            label="From"
            disabled={false}
            register={register}
            errors={errors}
            type="datetime-local"
            icon={FaCalendar}
            className="w-full"
            onFocus={() => clearErrors('from')}
          />

          <Input
            id="to"
            label="To"
            disabled={false}
            register={register}
            errors={errors}
            type="datetime-local"
            icon={FaCalendar}
            className="w-full"
            onFocus={() => clearErrors('to')}
          />
        </div>

        {/* MARK: Select Filter */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-3 md:col-span-8">
          {/* Sort */}
          <Input
            id="sort"
            label="Sort"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('')}
            options={[
              {
                value: 'createdAt|-1',
                label: 'Newest',
              },
              {
                value: 'createdAt|1',
                label: 'Oldest',
              },
              {
                value: 'updatedAt|-1',
                label: 'Latest',
                selected: true,
              },
              {
                value: 'updatedAt|1',
                label: 'Earliest',
              },
            ]}
          />

          {/* User ID */}
          <Input
            id="userId"
            label="User ID"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'true',
                label: 'Yes',
              },
              {
                value: 'false',
                label: 'No',
              },
            ]}
            className="min-w-[110px]"
          />

          {/* Voucher Applied */}
          <Input
            id="voucher"
            label="Voucher"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'true',
                label: 'On',
              },
              {
                value: 'false',
                label: 'Off',
              },
            ]}
            className="min-w-[112px]"
          />

          {/* Status */}
          <Input
            id="status"
            label="Status"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'done',
                label: 'Done',
              },
              {
                value: 'pending',
                label: 'Pending',
              },
              {
                value: 'cancel',
                label: 'Cancel',
              },
            ]}
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-2">
          {/* Select All Button */}
          <button
            className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-light"
            onClick={() =>
              setSelectedOrders(selectedOrders.length > 0 ? [] : orders.map(order => order._id))
            }
          >
            {selectedOrders.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Cancel Many Button */}
          {!!selectedOrders.length &&
            selectedOrders.every(id => orders.find(order => order._id === id)?.status === 'pending') && (
              <button
                className="trans-200 rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-300 hover:text-light"
                onClick={() => handleCancelOrders(selectedOrders)}
              >
                Cancel
              </button>
            )}

          {/* Delete Many Button */}
          {!!selectedOrders.length && (
            <button
              className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-light"
              onClick={() => setIsOpenConfirmModal(true)}
            >
              Delete
            </button>
          )}
        </div>
      </AdminMeta>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete Orders"
        content="Are you sure that you want to delete these orders?"
        onAccept={() => handleDeleteOrders(selectedOrders)}
        isLoading={loadingOrders.length > 0}
      />

      {/* MARK: Amount */}
      <div className="p-3 text-right text-sm font-semibold text-light">
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} order
        {amount > 1 ? 's' : ''}
      </div>

      {/* MARK: MAIN LIST */}
      <div className="grid grid-cols-1 gap-21 md:grid-cols-2 lg:grid-cols-3">
        {orders.map(order => (
          <OrderItem
            data={order}
            loadingOrders={loadingOrders}
            setOrders={setOrders}
            selectedOrders={selectedOrders}
            setSelectedOrders={setSelectedOrders}
            handleCancelOrders={handleCancelOrders}
            handleDeleteOrders={handleDeleteOrders}
            setValue={setValue}
            handleFilter={handleSubmit(handleFilter)}
            key={order._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllOrdersPage
