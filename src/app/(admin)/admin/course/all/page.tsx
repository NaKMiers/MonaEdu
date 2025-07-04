'use client'

import Input from '@/components/Input'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import CourseItem from '@/components/admin/CourseItem'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import {
  activateCoursesApi,
  bootCoursesApi,
  deleteCoursesApi,
  getAllCoursesApi,
  removeApplyingFlashSalesApi,
} from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { Slider } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSearch, FaSort } from 'react-icons/fa'

function AllCoursesPage({ searchParams }: { searchParams?: { [key: string]: string[] | string } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [courses, setCourses] = useState<ICourse[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])

  // loading and confirming
  const [loadingCourses, setLoadingCourses] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [price, setPrice] = useState<number[]>([0, 0])

  const [minJoined, setMinJoined] = useState<number>(0)
  const [maxJoined, setMaxJoined] = useState<number>(0)
  const [joined, setJoined] = useState<number[]>([0, 0])

  // Form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
      active: 'true',
      flashSale: '',
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

  // get all courses
  useEffect(() => {
    // get all courses
    const getAllCourses = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      console.log('22222222')

      try {
        // send request to server to get all courses
        const { courses, amount, chops } = await getAllCoursesApi(query)

        // set courses to state
        setCourses(courses)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('active', searchParams?.active || getValues('active'))
        setValue('flashSale', searchParams?.flashSale || getValues('flashSale'))

        // get min - max
        setMinPrice(chops?.minPrice || 0)
        setMaxPrice(chops?.maxPrice || 0)
        if (searchParams?.price) {
          const [from, to] = Array.isArray(searchParams.price)
            ? searchParams.price[0].split('-')
            : searchParams.price.split('-')
          setPrice([+from, +to])
        } else {
          setPrice([chops?.minPrice || 0, chops?.maxPrice || 0])
        }

        setMinJoined(chops?.minJoined || 0)
        setMaxJoined(chops?.maxJoined || 0)
        if (searchParams?.joined) {
          const [from, to] = Array.isArray(searchParams.joined)
            ? searchParams.joined[0].split('-')
            : searchParams.joined.split('-')
          setJoined([+from, +to])
        } else {
          setJoined([chops?.minJoined || 0, chops?.maxJoined || 0])
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllCourses()
  }, [dispatch, searchParams, setValue, getValues])

  // boot course
  const handleBootCourses = useCallback(async (ids: string[], value: boolean) => {
    try {
      // send request to server
      const { updatedCourses, message } = await bootCoursesApi(ids, value)

      // update courses from state
      setCourses(prev =>
        prev.map(course =>
          updatedCourses.map((course: ICourse) => course._id).includes(course._id)
            ? { ...course, booted: value }
            : course
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // activate course
  const handleActivateCourses = useCallback(async (ids: string[], value: boolean) => {
    try {
      // send request to server
      const { updatedCourses, message } = await activateCoursesApi(ids, value)

      // update courses from state
      setCourses(prev =>
        prev.map(course =>
          updatedCourses.map((course: ICourse) => course._id).includes(course._id)
            ? { ...course, active: value }
            : course
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // remove applying flashSales
  const handleRemoveApplyingFlashSales = useCallback(async (ids: string[]) => {
    try {
      // send request to server
      const { updatedCourses, message } = await removeApplyingFlashSalesApi(ids)

      // update courses from state
      setCourses(prev =>
        prev.map(course =>
          updatedCourses.map((course: ICourse) => course._id).includes(course._id)
            ? { ...course, flashSale: undefined }
            : course
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete course
  const handleDeleteCourses = useCallback(async (ids: string[]) => {
    setLoadingCourses(ids)

    try {
      // send request to server
      const { deletedCourses, message } = await deleteCoursesApi(ids)

      // remove deleted courses from state
      setCourses(prev =>
        prev.filter(course => !deletedCourses.map((course: ICourse) => course._id).includes(course._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingCourses([])
      setSelectedCourses([])
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

      return {
        ...data,
        price: price[0] === minPrice && price[1] === maxPrice ? '' : price.join('-'),
        joined: joined[0] === minJoined && joined[1] === maxJoined ? '' : joined.join('-'),
      }
    },
    [searchParams, defaultValues, minPrice, maxPrice, minJoined, maxJoined, price, joined]
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
    document.title = 'All Courses - Mona Edu'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedCourses(prev =>
          prev.length === courses.length ? [] : courses.map(course => course._id)
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
  }, [handleFilter, handleResetFilter, courses, handleSubmit])

  return (
    <div className="w-full">
      {/* Top & Pagination */}
      <AdminHeader
        title="All Courses"
        addLink="/admin/course/add"
      />
      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
      />

      {/* Filter */}
      <AdminMeta
        handleFilter={handleSubmit(handleFilter)}
        handleResetFilter={handleResetFilter}
      >
        {/* Search */}
        <div className="col-span-12 flex flex-col md:col-span-4">
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

        {/* Price */}
        <div className="col-span-12 flex flex-col md:col-span-4">
          <label htmlFor="price">
            <span className="font-bold">Price: </span>
            <span>{formatPrice(price[0])}</span> - <span>{formatPrice(price[1])}</span>
          </label>
          <Slider
            value={price}
            min={minPrice}
            max={maxPrice}
            step={1}
            className="-mb-1.5 w-full"
            onChange={(_: any, newValue: number | number[]) => setPrice(newValue as number[])}
            valueLabelDisplay="auto"
            style={{ color: '#333' }}
          />
        </div>

        {/* Joined */}
        <div className="col-span-12 flex flex-col md:col-span-4">
          <label htmlFor="joined">
            <span className="font-bold">Joined: </span>
            <span>{joined[0]}</span> - <span>{joined[1]}</span>
          </label>
          <Slider
            value={joined}
            min={minJoined}
            max={maxJoined}
            step={1}
            className="-mb-1.5 w-full"
            onChange={(_: any, newValue: number | number[]) => setJoined(newValue as number[])}
            valueLabelDisplay="auto"
            style={{ color: '#333' }}
          />
        </div>

        {/* Select Filter */}
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
                value: 'all',
                label: 'All',
              },
              {
                value: 'true',
                label: 'On',
                selected: true,
              },
              {
                value: 'false',
                label: 'Off',
              },
            ]}
            className="min-w-[104px]"
          />

          {/* Flash Sale */}
          <Input
            id="flashSale"
            label="Flash Sale"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('flashSale')}
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
            className="min-w-[124px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-2">
          {/* Select All Button */}
          <button
            className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-light"
            onClick={() =>
              setSelectedCourses(selectedCourses.length > 0 ? [] : courses.map(course => course._id))
            }
          >
            {selectedCourses.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Activate Many Button */}
          {/* Only show activate button if at least 1 course is selected and at least 1 selected course is deactive */}
          {!!selectedCourses.length &&
            selectedCourses.some(id => !courses.find(course => course._id === id)?.active) && (
              <button
                className="trans-200 rounded-lg border border-green-400 px-3 py-2 text-green-400 hover:bg-green-400 hover:text-light"
                onClick={() => handleActivateCourses(selectedCourses, true)}
              >
                Activate
              </button>
            )}

          {/* Deactivate Many Button */}
          {/* Only show deactivate button if at least 1 course is selected and at least 1 selected course is acitve */}
          {!!selectedCourses.length &&
            selectedCourses.some(id => courses.find(course => course._id === id)?.active) && (
              <button
                className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-light"
                onClick={() => handleActivateCourses(selectedCourses, false)}
              >
                Deactivate
              </button>
            )}

          {/* Remove Flash Sale Many Button */}
          {!!selectedCourses.length &&
            selectedCourses.some(id => courses.find(course => course._id === id)?.flashSale) && (
              <button
                className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-light"
                onClick={() => {
                  handleRemoveApplyingFlashSales(selectedCourses)
                }}
              >
                Remove Flash Sale
              </button>
            )}

          {/* Delete Many Button */}
          {!!selectedCourses.length && (
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
        title="Delete Courses"
        content="Are you sure that you want to delete these courses?"
        onAccept={() => handleDeleteCourses(selectedCourses)}
        isLoading={loadingCourses.length > 0}
      />

      {/* Amount */}
      <div className="p-3 text-right text-sm font-semibold text-light">
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} course
        {amount > 1 ? 's' : ''}
      </div>

      {/* MAIN LIST */}
      <div className="grid grid-cols-1 gap-21 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <CourseItem
            data={course}
            loadingCourses={loadingCourses}
            // selected
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            // functions
            handleActivateCourses={handleActivateCourses}
            handleBootCourses={handleBootCourses}
            handleRemoveApplyingFlashSales={handleRemoveApplyingFlashSales}
            handleDeleteCourses={handleDeleteCourses}
            key={course._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllCoursesPage
