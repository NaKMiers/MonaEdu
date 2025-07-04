'use client'

import Input from '@/components/Input'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import TagItem from '@/components/admin/TagItem'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ITag } from '@/models/TagModel'
import { bootTagsApi, deleteTagsApi, getAllTagsApi, updateTagsApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { Slider } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSort } from 'react-icons/fa'

export type EditingValues = {
  _id: string
  title: string
}

function AllTagsPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [tags, setTags] = useState<ITag[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [editingValues, setEditingValues] = useState<EditingValues[]>([])

  // loading and confirming
  const [loadingTags, setLoadingTags] = useState<string[]>([])
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 10
  const [minCQ, setMinPQ] = useState<number>(0)
  const [maxCQ, setMaxPQ] = useState<number>(0)
  const [courseQuantity, setCourseQuantity] = useState<number[]>([0, 0])

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      sort: 'updatedAt|-1',
      booted: '',
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
  // get all tags
  useEffect(() => {
    // get all tags
    const getAllTags = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { tags, amount, chops } = await getAllTagsApi(query) // cache: no-store

        // set to states
        setTags(tags)
        setAmount(amount)

        // sync search params with states
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('booted', searchParams?.booted || getValues('booted'))

        // set min - max - courseQuantity
        setMinPQ(chops?.minCourseQuantity || 0)
        setMaxPQ(chops?.maxCourseQuantity || 0)
        if (searchParams?.courseQuantity) {
          const [from, to] = Array.isArray(searchParams.courseQuantity)
            ? searchParams.courseQuantity[0].split('-')
            : (searchParams.courseQuantity as string).split('-')
          setCourseQuantity([+from, +to])
        } else {
          setCourseQuantity([chops?.minCourseQuantity || 0, chops?.maxCourseQuantity || 0])
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllTags()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // delete tag
  const handleDeleteTags = useCallback(async (ids: string[]) => {
    setLoadingTags(ids)

    try {
      // send request to server
      const { deletedTags, message } = await deleteTagsApi(ids)

      // remove deleted tags from state
      setTags(prev => prev.filter(tag => !deletedTags.map((tag: ITag) => tag._id).includes(tag._id)))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingTags([])
      setSelectedTags([])
    }
  }, [])

  // feature tag
  const handleBootTags = useCallback(async (ids: string[], value: boolean) => {
    try {
      // send request to server
      const { updatedTags, message } = await bootTagsApi(ids, value)

      // update tags from state
      setTags(prev =>
        prev.map(tag =>
          updatedTags.map((tag: ITag) => tag._id).includes(tag._id) ? { ...tag, booted: value } : tag
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // handle submit edit tag
  const handleSaveEditingTags = useCallback(async (editingValues: any[]) => {
    setLoadingTags(editingValues.map(t => t._id))

    try {
      // send request to server
      const { editedTags, message } = await updateTagsApi(editingValues)

      // update tags from state
      setTags(prev =>
        prev.map(t =>
          editedTags.map((t: ITag) => t._id).includes(t._id)
            ? editedTags.find((cat: ITag) => cat._id === t._id)
            : t
        )
      )
      setEditingTags(prev => prev.filter(id => !editedTags.map((t: any) => t._id).includes(id)))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingTags([])
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
        courseQuantity:
          courseQuantity[0] === minCQ && courseQuantity[1] === maxCQ ? '' : courseQuantity.join('-'),
      }
    },
    [courseQuantity, minCQ, maxCQ, searchParams, defaultValues]
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
    [handleOptimizeFilter, searchParams, router, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname, { scroll: false })
  }, [reset, router, pathname])

  // keyboard event
  useEffect(() => {
    // page title
    document.title = 'All Tags - Mona Edu'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedTags(prev => (prev.length === tags.length ? [] : tags.map(category => category._id)))
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
  }, [tags, selectedTags, handleDeleteTags, handleFilter, handleSubmit, handleResetFilter])

  return (
    <div className="w-full">
      {/* MARK: Top & Pagination */}
      <AdminHeader
        title="All Tags"
        addLink="/admin/tag/add"
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
        {/* Course Quantity */}
        <div className="col-span-12 flex flex-col md:col-span-4">
          <label htmlFor="courseQuantity">
            <span className="font-bold">Course Quantity: </span>
            <span>{courseQuantity[0]}</span> - <span>{courseQuantity[1]}</span>
          </label>
          <Slider
            value={courseQuantity}
            min={minCQ}
            max={maxCQ}
            step={1}
            className="-mb-1.5 w-full"
            onChange={(_: any, newValue: number | number[]) => setCourseQuantity(newValue as number[])}
            valueLabelDisplay="auto"
            style={{ color: '#333' }}
          />
        </div>

        {/* MARK: Select Filter */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-3 md:col-span-4">
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

          {/* Booter */}
          <Input
            id="booted"
            label="Booter"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('booted')}
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
            className="min-w-[120px]"
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-2">
          {/* Select All Button */}
          <button
            className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-light"
            onClick={() => setSelectedTags(selectedTags.length > 0 ? [] : tags.map(tag => tag._id))}
          >
            {selectedTags.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {!!editingTags.filter(id => selectedTags.includes(id)).length && (
            <>
              {/* Save Many Button */}
              <button
                className="trans-200 rounded-lg border border-green-500 px-3 py-2 text-green-500 hover:bg-green-500 hover:text-light"
                onClick={() =>
                  handleSaveEditingTags(editingValues.filter(value => selectedTags.includes(value._id)))
                }
              >
                Save All
              </button>
              {/* Cancel Many Button */}
              <button
                className="trans-200 rounded-lg border border-slate-400 px-3 py-2 text-slate-400 hover:bg-slate-400 hover:text-light"
                onClick={() => {
                  // cancel editing values are selected
                  setEditingTags(editingTags.filter(id => !selectedTags.includes(id)))
                  setEditingValues(editingValues.filter(value => !selectedTags.includes(value._id)))
                }}
              >
                Cancel
              </button>
            </>
          )}

          {/* Mark Many Button */}
          {!!selectedTags.length &&
            selectedTags.some(id => !tags.find(tag => tag._id === id)?.booted) && (
              <button
                className="trans-200 rounded-lg border border-green-400 px-3 py-2 text-green-400 hover:bg-green-400 hover:text-light"
                onClick={() => handleBootTags(selectedTags, true)}
              >
                Mark
              </button>
            )}

          {/* Unmark Many Button */}
          {!!selectedTags.length &&
            selectedTags.some(id => tags.find(tag => tag._id === id)?.booted) && (
              <button
                className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-light"
                onClick={() => handleBootTags(selectedTags, false)}
              >
                Unmark
              </button>
            )}

          {/* Delete Many Button */}
          {!!selectedTags.length && (
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
        title="Delete Tags"
        content="Are you sure that you want to delete these tags?"
        onAccept={() => handleDeleteTags(selectedTags)}
        isLoading={loadingTags.length > 0}
      />

      {/* MARK: Amount */}
      <div className="p-3 text-right text-sm font-semibold text-light">
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} tag{amount > 1 ? 's' : ''}
      </div>

      {/* MARK: MAIN LIST */}
      <div className="grid grid-cols-1 gap-21 md:grid-cols-3 lg:grid-cols-5">
        {tags.map(tag => (
          <TagItem
            data={tag}
            loadingTags={loadingTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            editingTags={editingTags}
            setEditingTags={setEditingTags}
            editingValues={editingValues}
            setEditingValues={setEditingValues}
            handleSaveEditingTags={handleSaveEditingTags}
            handleDeleteTags={handleDeleteTags}
            handleBootTags={handleBootTags}
            key={tag._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllTagsPage
