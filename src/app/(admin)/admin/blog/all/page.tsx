'use client'

import Input from '@/components/Input'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import BlogItem from '@/components/admin/BlogItem'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IBlog } from '@/models/BlogModel'
import { bootBlogsApi, changeBlogsStatusApi, deleteBlogsApi, getAllBlogsApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { Slider } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSearch, FaSort } from 'react-icons/fa'

function AllBlogsPage({ searchParams }: { searchParams?: { [key: string]: string[] | string } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([])

  // loading and confirming
  const [loadingBlogs, setLoadingBlogs] = useState<string[]>([])
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
      active: '',
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

  // get all blogs
  useEffect(() => {
    // get all blogs
    const getAllBlogs = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all blogs
        const { blogs, amount, chops } = await getAllBlogsApi(query)

        // set blogs to state
        setBlogs(blogs)
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
    getAllBlogs()
  }, [dispatch, searchParams, setValue, getValues])

  // boot blog
  const handleBootBlogs = useCallback(async (ids: string[], value: boolean) => {
    try {
      // send request to server
      const { updatedBlogs, message } = await bootBlogsApi(ids, value)

      // update blogs from state
      setBlogs(prev =>
        prev.map(blog =>
          updatedBlogs.map((blog: IBlog) => blog._id).includes(blog._id)
            ? { ...blog, booted: value }
            : blog
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // change blogs status
  const handleChangeBlogsStatus = useCallback(
    async (ids: string[], value: 'draft' | 'published' | 'archived') => {
      try {
        // send request to server
        const { updatedBlogs, message } = await changeBlogsStatusApi(ids, value)

        // update blogs from state
        setBlogs(prev =>
          prev.map(blog =>
            updatedBlogs.map((blog: IBlog) => blog._id).includes(blog._id)
              ? { ...blog, status: value }
              : blog
          )
        )

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    []
  )

  // delete blog
  const handleDeleteBlogs = useCallback(async (ids: string[]) => {
    setLoadingBlogs(ids)

    try {
      // send request to server
      const { deletedBlogs, message } = await deleteBlogsApi(ids)

      // remove deleted blogs from state
      setBlogs(prev =>
        prev.filter(blog => !deletedBlogs.map((blog: IBlog) => blog._id).includes(blog._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingBlogs([])
      setSelectedBlogs([])
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
    document.title = 'All Blogs - Mona Edu'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedBlogs(prev => (prev.length === blogs.length ? [] : blogs.map(blog => blog._id)))
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
  }, [handleFilter, handleResetFilter, blogs, handleSubmit])

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Blogs' addLink='/admin/blog/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* Search */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <Input
            id='search'
            className='md:max-w-[450px]'
            label='Search'
            disabled={false}
            register={register}
            errors={errors}
            type='text'
            icon={FaSearch}
            onFocus={() => clearErrors('search')}
          />
        </div>

        {/* Price */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <label htmlFor='price'>
            <span className='font-bold'>Price: </span>
            <span>{formatPrice(price[0])}</span> - <span>{formatPrice(price[1])}</span>
          </label>
          <Slider
            value={price}
            min={minPrice}
            max={maxPrice}
            step={1}
            className='w-full -mb-1.5'
            onChange={(_: any, newValue: number | number[]) => setPrice(newValue as number[])}
            valueLabelDisplay='auto'
            style={{ color: '#333' }}
          />
        </div>

        {/* Joined */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <label htmlFor='joined'>
            <span className='font-bold'>Joined: </span>
            <span>{joined[0]}</span> - <span>{joined[1]}</span>
          </label>
          <Slider
            value={joined}
            min={minJoined}
            max={maxJoined}
            step={1}
            className='w-full -mb-1.5'
            onChange={(_: any, newValue: number | number[]) => setJoined(newValue as number[])}
            valueLabelDisplay='auto'
            style={{ color: '#333' }}
          />
        </div>

        {/* Select Filter */}
        <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-8'>
          {/* Sort */}
          <Input
            id='sort'
            label='Sort'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
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
            id='active'
            label='Active'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
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
            className='min-w-[104px]'
          />

          {/* Flash Sale */}
          <Input
            id='flashSale'
            label='Flash Sale'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
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
            className='min-w-[124px]'
          />
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap justify-end items-center col-span-12 gap-2'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-light trans-200'
            onClick={() => setSelectedBlogs(selectedBlogs.length > 0 ? [] : blogs.map(blog => blog._id))}
          >
            {selectedBlogs.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Publish All Button */}
          {!!selectedBlogs.length &&
            selectedBlogs.some(id => blogs.find(blog => blog._id === id)?.status !== 'published') && (
              <button
                className='border border-violet-500 text-violet-500 rounded-lg px-3 py-2 hover:bg-violet-500 hover:text-light trans-200'
                onClick={() => handleChangeBlogsStatus(selectedBlogs, 'published')}
              >
                Publish All
              </button>
            )}

          {/* Draft All Button */}
          {!!selectedBlogs.length &&
            selectedBlogs.some(id => blogs.find(blog => blog._id === id)?.status !== 'draft') && (
              <button
                className='border border-slate-500 text-slate-500 rounded-lg px-3 py-2 hover:bg-slate-500 hover:text-light trans-200'
                onClick={() => handleChangeBlogsStatus(selectedBlogs, 'draft')}
              >
                Draft All
              </button>
            )}

          {/* Archive All Button */}
          {!!selectedBlogs.length &&
            selectedBlogs.some(id => blogs.find(blog => blog._id === id)?.status !== 'archived') && (
              <button
                className='border border-blue-500 text-blue-500 rounded-lg px-3 py-2 hover:bg-blue-500 hover:text-light trans-200'
                onClick={() => handleChangeBlogsStatus(selectedBlogs, 'archived')}
              >
                Archive All
              </button>
            )}

          {/* Delete Many Button */}
          {!!selectedBlogs.length && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light trans-200'
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
        title='Delete Blogs'
        content='Are you sure that you want to delete these blogs?'
        onAccept={() => handleDeleteBlogs(selectedBlogs)}
        isLoading={loadingBlogs.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-light font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} blog
        {amount > 1 ? 's' : ''}
      </div>

      {/* MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-21 lg:grid-cols-3'>
        {blogs.map(blog => (
          <BlogItem
            data={blog}
            loadingBlogs={loadingBlogs}
            // selected
            selectedBlogs={selectedBlogs}
            setSelectedBlogs={setSelectedBlogs}
            // functions
            handleBootBlogs={handleBootBlogs}
            handleChangeBlogsStatus={handleChangeBlogsStatus}
            handleDeleteBlogs={handleDeleteBlogs}
            key={blog._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllBlogsPage
