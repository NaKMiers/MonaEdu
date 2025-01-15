'use client'

import Input from '@/components/Input'
import ActivationCodeItem from '@/components/admin/ActivationCodeItem'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IActivationCode } from '@/models/ActivationCodeModel'
import {
  activateActivationCodesApi,
  deleteActivationCodesApi,
  getAllActivationCodesApi,
} from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { Slider } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendar, FaSearch, FaSort } from 'react-icons/fa'

function AllActivationCodesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [activationCodes, setActivationCodes] = useState<IActivationCode[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedActivationCodes, setSelectedActivationCodes] = useState<string[]>([])

  // loading and confirming
  const [loadingActivationCodes, setLoadingActivationCodes] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minTimesLeft, setMinTimesLeft] = useState<number>(0)
  const [maxTimesLeft, setMaxTimesLeft] = useState<number>(0)
  const [timesLeft, setTimesLeft] = useState<number[]>([0, 0])

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
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
  // get all activationCodes
  useEffect(() => {
    // get all activationCodes
    const getAllActivationCodes = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { activationCodes, amount, chops } = await getAllActivationCodesApi(query) // cache: no-store

        // set activationCodes to state
        setActivationCodes(activationCodes)
        setAmount(amount)
        console.log('chops', chops)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('active', searchParams?.active || getValues('active'))
        setValue('timesLeft', searchParams?.timesLeft || getValues('timesLeft'))
        setValue('beginFrom', searchParams?.beginFrom || getValues('beginFrom'))
        setValue('beginTo', searchParams?.beginTo || getValues('beginTo'))
        setValue('expireFrom', searchParams?.expireFrom || getValues('expireFrom'))
        setValue('expireTo', searchParams?.expireTo || getValues('expireTo'))

        // set min - max - times left
        setMinTimesLeft(chops?.minTimesLeft || 0)
        setMaxTimesLeft(chops?.maxTimesLeft || 0)
        if (searchParams?.timesLeft) {
          const [from, to] = Array.isArray(searchParams.timesLeft)
            ? searchParams.timesLeft[0].split('-')
            : (searchParams.timesLeft as string).split('-')
          setTimesLeft([+from, +to])
        } else {
          setTimesLeft([chops?.minTimesLeft || 0, chops?.maxTimesLeft || 0])
        }
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllActivationCodes()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // activate activationCode
  const handleActivateActivationCodes = useCallback(async (ids: string[], value: boolean) => {
    try {
      // send request to server
      const { updatedActivationCodes, message } = await activateActivationCodesApi(ids, value)

      // update activationCodes from state
      setActivationCodes(prev =>
        prev.map(activationCode =>
          updatedActivationCodes
            .map((activationCode: IActivationCode) => activationCode._id)
            .includes(activationCode._id)
            ? { ...activationCode, active: value }
            : activationCode
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete activationCode
  const handleDeleteActivationCodes = useCallback(async (ids: string[]) => {
    setLoadingActivationCodes(ids)

    try {
      // send request to server
      const { deletedActivationCodes, message } = await deleteActivationCodesApi(ids)

      console.log('deletedActivationCodes:', deletedActivationCodes)

      // remove deleted activationCodes from state
      setActivationCodes(prev =>
        prev.filter(code => !deletedActivationCodes.map((code: any) => code._id).includes(code._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingActivationCodes([])
      setSelectedActivationCodes([])
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
        rest.begin = (beginFrom || '') + '|' + (beginTo || '')
      }

      if (expireFrom || expireTo) {
        rest.expire = (expireFrom || '') + '|' + (expireTo || '')
      }

      return {
        ...rest,
        timesLeft:
          timesLeft[0] === minTimesLeft && timesLeft[1] === maxTimesLeft ? '' : timesLeft.join('-'),
      }
    },
    [searchParams, defaultValues, timesLeft, maxTimesLeft, minTimesLeft]
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
    document.title = 'All ActivationCodes - Mona Edu'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedActivationCodes(prev =>
          prev.length === activationCodes.length
            ? []
            : activationCodes.map(activationCode => activationCode._id)
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
  }, [handleFilter, handleResetFilter, handleSubmit, activationCodes])

  return (
    <div className="w-full">
      {/* MARK: Top & Pagination */}
      <AdminHeader
        title="All Activation Codes"
        addLink="/admin/activation-code/add"
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
        <div className="col-span-12 flex flex-col md:col-span-6">
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

        {/* Times Left */}
        <div className="col-span-12 flex flex-col md:col-span-6">
          <label htmlFor="timesLeft">
            <span className="font-bold">Times Left: </span>
            <span>{minTimesLeft}</span> - <span>{maxTimesLeft}</span>
          </label>
          <Slider
            value={timesLeft}
            min={minTimesLeft}
            max={maxTimesLeft}
            step={1}
            className="-mb-1.5 w-full"
            onChange={(_: any, newValue: number | number[]) => setTimesLeft(newValue as number[])}
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
            type="date"
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
            type="date"
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
            type="date"
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
            type="date"
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
              setSelectedActivationCodes(
                selectedActivationCodes.length > 0
                  ? []
                  : activationCodes.map(activationCode => activationCode._id)
              )
            }
          >
            {selectedActivationCodes.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Activate Many Button */}
          {selectedActivationCodes.some(
            id => !activationCodes.find(activationCode => activationCode._id === id)?.active
          ) && (
            <button
              className="trans-200 rounded-lg border border-green-400 px-3 py-2 text-green-400 hover:bg-green-400 hover:text-light"
              onClick={() => handleActivateActivationCodes(selectedActivationCodes, true)}
            >
              Activate
            </button>
          )}

          {/* Deactivate Many Button */}
          {selectedActivationCodes.some(
            id => activationCodes.find(activationCode => activationCode._id === id)?.active
          ) && (
            <button
              className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-light"
              onClick={() => handleActivateActivationCodes(selectedActivationCodes, false)}
            >
              Deactivate
            </button>
          )}

          {/* Delete Many Button */}
          {!!selectedActivationCodes.length && (
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
        title="Delete Activation Codes"
        content="Are you sure that you want to delete these activation codes?"
        onAccept={() => handleDeleteActivationCodes(selectedActivationCodes)}
        isLoading={loadingActivationCodes.length > 0}
      />

      {/* MARK: Amount */}
      <div className="p-3 text-right text-sm font-semibold text-light">
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} activation code
        {amount > 1 ? 's' : ''}
      </div>

      {/* MARK: MAIN LIST */}
      <div className="grid grid-cols-1 gap-21 md:grid-cols-2 lg:grid-cols-3">
        {activationCodes.map(activationCode => (
          <ActivationCodeItem
            data={activationCode}
            loadingActivationCodes={loadingActivationCodes}
            selectedActivationCodes={selectedActivationCodes}
            setSelectedActivationCodes={setSelectedActivationCodes}
            handleActivateActivationCodes={handleActivateActivationCodes}
            handleDeleteActivationCodes={handleDeleteActivationCodes}
            key={activationCode._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllActivationCodesPage
