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
import { deleteBlogsApi, getAllBlogsApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
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

  // Form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
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
      }
    },
    [searchParams, defaultValues]
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
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap justify-end items-center col-span-12 gap-2'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white trans-200'
            onClick={() => setSelectedBlogs(selectedBlogs.length > 0 ? [] : blogs.map(blog => blog._id))}
          >
            {selectedBlogs.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedBlogs.length && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white trans-200'
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
      <div className='p-3 text-sm text-right text-white font-semibold'>
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
            handleDeleteBlogs={handleDeleteBlogs}
            key={blog._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllBlogsPage
