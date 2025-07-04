'use client'

import Input from '@/components/Input'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import VoucherItem from '@/components/admin/VoucherItem'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IVoucher } from '@/models/VoucherModel'
import { activateVouchersApi, deleteVouchersApi, getAllVouchersApi } from '@/requests'
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

export type VoucherWithOwner = IVoucher & { owner: { firstName: string; lastName: string } }

function AllVouchersPage({ searchParams }: { searchParams?: { [key: string]: string | string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [vouchers, setVouchers] = useState<VoucherWithOwner[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])

  // loading and confirming
  const [loadingVouchers, setLoadingVouchers] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minMinTotal, setMinMinTotal] = useState<number>(0)
  const [maxMinTotal, setMaxMinTotal] = useState<number>(0)
  const [minTotal, setMinTotal] = useState<number[]>([0, 0])

  const [minMaxReduce, setMinMaxReduce] = useState<number>(0)
  const [maxMaxReduce, setMaxMaxReduce] = useState<number>(0)
  const [maxReduce, setMaxReduce] = useState<number[]>([0, 0])

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
      type: '',
      active: '',
      timesLeft: '',
      beginFrom: '',
      beginTo: '',
      expireFrom: '',
      expireTo: '',
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
  // get all vouchers
  useEffect(() => {
    // get all vouchers
    const getAllVouchers = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { vouchers, amount, chops } = await getAllVouchersApi(query) // cache: no-store

        console.log('chops', chops)

        // set vouchers to state
        setVouchers(vouchers)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('type', searchParams?.type || getValues('type'))
        setValue('active', searchParams?.active || getValues('active'))
        setValue('timesLeft', searchParams?.timesLeft || getValues('timesLeft'))
        setValue(
          'beginFrom',
          searchParams?.begin && (searchParams?.begin as string).split('|')[0]
            ? moment((searchParams.begin as string).split('|')[0]).format('YYYY-MM-DDTHH:mm')
            : getValues('beginFrom')
        )
        setValue(
          'beginTo',
          searchParams?.begin && (searchParams?.begin as string).split('|')[1]
            ? moment((searchParams.begin as string).split('|')[1]).format('YYYY-MM-DDTHH:mm')
            : getValues('beginTo')
        )
        setValue(
          'expireFrom',
          searchParams?.expire && (searchParams?.expire as string).split('|')[0]
            ? moment((searchParams.expire as string).split('|')[0]).format('YYYY-MM-DDTHH:mm')
            : getValues('expireFrom')
        )
        setValue(
          'expireTo',
          searchParams?.expire && (searchParams?.expire as string).split('|')[1]
            ? moment((searchParams.expire as string).split('|')[1]).format('YYYY-MM-DDTHH:mm')
            : getValues('expireTo')
        )

        // get min - max
        setMinMinTotal(chops.minMinTotal)
        setMaxMinTotal(chops.maxMinTotal)
        if (searchParams?.minTotal) {
          const [from, to] = Array.isArray(searchParams.minTotal)
            ? searchParams.minTotal[0].split('-')
            : (searchParams.minTotal as string).split('-')
          setMinTotal([+from, +to])
        } else {
          setMinTotal([chops?.minMinTotal || 0, chops?.maxMinTotal || 0])
        }

        setMinMaxReduce(chops.minMaxReduce)
        setMaxMaxReduce(chops.maxMaxReduce)
        if (searchParams?.maxReduce) {
          const [from, to] = Array.isArray(searchParams.maxReduce)
            ? searchParams.maxReduce[0].split('-')
            : (searchParams.maxReduce as string).split('-')
          setMaxReduce([+from, +to])
        } else {
          setMaxReduce([chops?.minMaxReduce || 0, chops?.maxMaxReduce || 0])
        }
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllVouchers()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // activate voucher
  const handleActivateVouchers = useCallback(async (ids: string[], value: boolean) => {
    try {
      // send request to server
      const { updatedVouchers, message } = await activateVouchersApi(ids, value)

      // update vouchers from state
      setVouchers(prev =>
        prev.map(voucher =>
          updatedVouchers.map((voucher: VoucherWithOwner) => voucher._id).includes(voucher._id)
            ? { ...voucher, active: value }
            : voucher
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete voucher
  const handleDeleteVouchers = useCallback(async (ids: string[]) => {
    setLoadingVouchers(ids)

    try {
      // send request to server
      const { deletedVouchers, message } = await deleteVouchersApi(ids)

      // remove deleted vouchers from state
      setVouchers(prev => prev.filter(vc => !deletedVouchers.map((vc: any) => vc._id).includes(vc._id)))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingVouchers([])
      setSelectedVouchers([])
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

      const { beginFrom, beginTo, expireFrom, expireTo, ...rest } = data
      if (beginFrom || beginTo) {
        rest.begin = (beginFrom ? toUTC(beginFrom) : '') + '|' + (beginTo ? toUTC(beginTo) : '')
      }

      if (expireFrom || expireTo) {
        rest.expire = (expireFrom ? toUTC(expireFrom) : '') + '|' + (expireTo ? toUTC(expireTo) : '')
      }

      return {
        ...rest,
        minTotal: minTotal[0] === minMinTotal && minTotal[1] === maxMinTotal ? '' : minTotal.join('-'),
        maxReduce:
          maxReduce[0] === minMaxReduce && maxReduce[1] === maxMaxReduce ? '' : maxReduce.join('-'),
      }
    },
    [
      searchParams,
      defaultValues,
      minTotal,
      minMinTotal,
      maxMinTotal,
      maxReduce,
      minMaxReduce,
      maxMaxReduce,
    ]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...params,
      })

      // push to router
      router.push(pathname + query)
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
    document.title = 'All Vouchers - Mona Edu'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedVouchers(prev =>
          prev.length === vouchers.length ? [] : vouchers.map(voucher => voucher._id)
        )
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
  }, [handleFilter, handleResetFilter, handleSubmit, vouchers])

  return (
    <div className="w-full">
      {/* MARK: Top & Pagination */}
      <AdminHeader
        title="All Vouchers"
        addLink="/admin/voucher/add"
      />
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
        <div className="col-span-12 flex flex-col">
          <Input
            className="md:max-w-[450px]"
            id="search"
            label="Search"
            disabled={false}
            register={register}
            errors={errors}
            type="text"
            icon={FaSearch}
            onFocus={() => clearErrors('search')}
          />
        </div>

        {/* Min Total */}
        <div className="col-span-12 flex flex-col md:col-span-6">
          <label htmlFor="minTotal">
            <span className="font-bold">Min Total: </span>
            <span>{formatPrice(minTotal[0])}</span> - <span>{formatPrice(minTotal[1])}</span>
          </label>
          <Slider
            value={minTotal}
            min={minMinTotal}
            max={maxMaxReduce}
            step={1}
            className="-mb-1.5 w-full"
            onChange={(_: any, newValue: number | number[]) => setMinTotal(newValue as number[])}
            valueLabelDisplay="auto"
            style={{ color: '#333' }}
          />
        </div>

        {/* Max Reduce */}
        <div className="col-span-12 flex flex-col md:col-span-6">
          <label htmlFor="maxReduce">
            <span className="font-bold">Max Reduce: </span>
            <span>{formatPrice(maxReduce[0])}</span> - <span>{formatPrice(maxReduce[1])}</span>
          </label>
          <Slider
            value={maxReduce}
            min={minMaxReduce}
            max={maxMaxReduce}
            step={1}
            className="-mb-1.5 w-full"
            onChange={(_: any, newValue: number | number[]) => setMaxReduce(newValue as number[])}
            valueLabelDisplay="auto"
            style={{ color: '#333' }}
          />
        </div>

        {/* Begin */}
        <div className="col-span-12 flex flex-wrap gap-2 sm:flex-nowrap lg:col-span-6">
          <Input
            id="beginFrom"
            label="Begin From"
            disabled={false}
            register={register}
            errors={errors}
            type="datetime-local"
            icon={FaCalendar}
            className="w-full"
            onFocus={() => clearErrors('beginFrom')}
          />

          <Input
            id="beginTo"
            label="Begin To"
            disabled={false}
            register={register}
            errors={errors}
            type="datetime-local"
            icon={FaCalendar}
            className="w-full"
            onFocus={() => clearErrors('beginTo')}
          />
        </div>

        {/* Expire */}
        <div className="col-span-12 flex flex-wrap gap-2 sm:flex-nowrap lg:col-span-6">
          <Input
            id="expireFrom"
            label="Expire From"
            disabled={false}
            register={register}
            errors={errors}
            type="datetime-local"
            icon={FaCalendar}
            className="w-full"
            onFocus={() => clearErrors('expireFrom')}
          />

          <Input
            id="expireTo"
            label="Expire To"
            disabled={false}
            register={register}
            errors={errors}
            type="datetime-local"
            icon={FaCalendar}
            className="w-full"
            onFocus={() => clearErrors('expireTo')}
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
            onFocus={() => clearErrors('sort')}
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

          {/* Times Left */}
          <Input
            id="timesLeft"
            label="Times Left"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('timesLeft')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'true',
                label: 'Still',
              },
              {
                value: 'false',
                label: 'Run Out',
              },
            ]}
          />

          {/* Type */}
          <Input
            id="type"
            label="Type"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('type')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'percentage',
                label: 'Percentage',
              },
              {
                value: 'fixed-reduce',
                label: 'Fixed Reduce',
              },
              {
                value: 'fixed',
                label: 'Fixed',
              },
            ]}
          />

          {/* Active */}
          <Input
            id="active"
            label="Active"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('active')}
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
            className="min-w-[108px]"
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-2">
          {/* Select All Button */}
          <button
            className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-light"
            onClick={() =>
              setSelectedVouchers(
                selectedVouchers.length > 0 ? [] : vouchers.map(voucher => voucher._id)
              )
            }
          >
            {selectedVouchers.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Activate Many Button */}
          {selectedVouchers.some(id => !vouchers.find(voucher => voucher._id === id)?.active) && (
            <button
              className="trans-200 rounded-lg border border-green-400 px-3 py-2 text-green-400 hover:bg-green-400 hover:text-light"
              onClick={() => handleActivateVouchers(selectedVouchers, true)}
            >
              Activate
            </button>
          )}

          {/* Deactivate Many Button */}
          {selectedVouchers.some(id => vouchers.find(voucher => voucher._id === id)?.active) && (
            <button
              className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-light"
              onClick={() => handleActivateVouchers(selectedVouchers, false)}
            >
              Deactivate
            </button>
          )}

          {/* Delete Many Button */}
          {!!selectedVouchers.length && (
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
        title="Delete Vouchers"
        content="Are you sure that you want to delete these vouchers?"
        onAccept={() => handleDeleteVouchers(selectedVouchers)}
        isLoading={loadingVouchers.length > 0}
      />

      {/* MARK: Amount */}
      <div className="p-3 text-right text-sm font-semibold text-light">
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} voucher
        {amount > 1 ? 's' : ''}
      </div>

      {/* MARK: MAIN LIST */}
      <div className="grid grid-cols-1 gap-21 md:grid-cols-2 lg:grid-cols-3">
        {vouchers.map(voucher => (
          <VoucherItem
            data={voucher}
            loadingVouchers={loadingVouchers}
            selectedVouchers={selectedVouchers}
            setSelectedVouchers={setSelectedVouchers}
            handleActivateVouchers={handleActivateVouchers}
            handleDeleteVouchers={handleDeleteVouchers}
            key={voucher._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllVouchersPage
