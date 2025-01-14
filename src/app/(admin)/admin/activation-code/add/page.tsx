'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addActivationCodeApi, searchCoursesApi } from '@/requests'
import { generateRandomString } from '@/utils/generate'
import moment from 'moment-timezone'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowCircleLeft, FaSearch } from 'react-icons/fa'
import { FaPause, FaPlay, FaX } from 'react-icons/fa6'

import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddActivationCodePage() {
  // store
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // states
  const [searchedCourses, setSearchedCourses] = useState<ICourse[]>([])
  const [selectedCourses, setSelectedCourses] = useState<ICourse[]>([])
  const [keyword, setKeyword] = useState<string>('')
  const [searching, setSearching] = useState<boolean>(false)

  // refs
  const searchTimeout = useRef<NodeJS.Timeout>()

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      keyword: '',
      code: generateRandomString(12, '-', 4),
      begin: moment().format('YYYY-MM-DDTHH:mm'),
      expire: '',
      timesLeft: 1,
      active: true,
    },
  })

  // auto search courses
  useEffect(() => {
    const searchCourses = async () => {
      if (keyword.trim() === '') {
        return setSearchedCourses([])
      }

      if (searchTimeout.current) clearTimeout(searchTimeout.current)

      searchTimeout.current = setTimeout(async () => {
        console.log('searching courses')
        // start searching
        setSearching(true)

        try {
          const { courses } = await searchCoursesApi(keyword)
          setSearchedCourses(courses)
        } catch (err: any) {
          console.log(err)
        } finally {
          // stop searching
          setSearching(false)
        }
      }, 500)
    }

    searchCourses()
  }, [setValue, keyword])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // must select at least 1 course
      if (selectedCourses.length === 0) {
        toast.error('Must select at least 1 course')
        isValid = false
      }

      // code >= 5
      if (data.code.length !== 14) {
        setError('code', {
          type: 'manual',
          message: 'Code must have 14 characters',
        })
        isValid = false
      }

      // begin < expire when expire is not empty
      if (data.expire && data.begin > data.expire) {
        setError('expire', {
          type: 'manual',
          message: 'Expire must be greater than begin',
        })
        isValid = false
      }

      // timesLeft >= 0
      if (+data.timesLeft < 0) {
        setError('timesLeft', {
          type: 'manual',
          message: 'Times left must be >= 0',
        })
        isValid = false
      }

      return isValid
    },
    [setError, selectedCourses.length]
  )

  // MARK: Submit
  // handle send request to server to add activation code
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      dispatch(setLoading(true))

      try {
        // send request to server to add activation code
        const { message } = await addActivationCodeApi({
          courses: selectedCourses.map(course => course._id),
          ...data,
        })

        // show success message
        toast.success(message)
        // reset form
        reset()
        setValue('code', generateRandomString(12, '-', 4))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [handleValidate, reset, dispatch, setValue, selectedCourses]
  )

  // Enter key to submit
  useEffect(() => {
    // page title
    document.title = 'Add ActivationCode - Mona Edu'

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit(onSubmit)()
    }

    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [handleSubmit, onSubmit])

  return (
    <div className="mx-auto max-w-1200">
      {/* MARK: Admin Header */}
      <AdminHeader
        title="Add Activation Code"
        backLink="/admin/activation-code/all"
      />
      <div className="mt-5 rounded-lg bg-slate-200 p-3">
        {/* Code */}
        <Input
          id="code"
          label="Code"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="text"
          icon={RiCharacterRecognitionLine}
          onFocus={() => clearErrors('code')}
        />

        {/* Search Course */}
        <Input
          id="keyword"
          label="Search Courses"
          disabled={isLoading || searching}
          register={register}
          errors={errors}
          type="text"
          icon={FaSearch}
          onChange={(e: any) => setKeyword(e.target.value)}
          className="mt-5"
          onFocus={() => clearErrors('keyword')}
        />

        {/* Selected Courses */}
        <p className="mt-1 text-sm font-semibold text-dark">
          Selected: {selectedCourses.length} course{selectedCourses.length === 1 ? '' : 's'}
        </p>
        {selectedCourses.length > 0 && (
          <div className="mt-1 grid max-h-[240px] grid-cols-2 gap-1 overflow-y-auto rounded-lg text-dark sm:grid-cols-3 md:grid-cols-4">
            {selectedCourses.map(course => (
              <div
                className={`trans-200 group flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-800 p-2 py-2 ${selectedCourses.some(c => c._id === course._id) ? 'bg-green-200' : ''}`}
                onClick={() => setSelectedCourses(prev => prev.filter(c => c._id !== course._id))}
                key={course._id}
              >
                <p className="trans-200 line-clamp-1 w-full text-ellipsis font-body text-sm leading-5 tracking-wide">
                  {course.title}
                </p>

                <span className="wiggle rounded-full text-rose-500">
                  <FaX size={16} />
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Search Result of Courses */}
        <p className="mt-1 text-sm font-semibold text-dark">
          Search Results: {searchedCourses.length} course{searchedCourses.length === 1 ? '' : 's'}
        </p>

        {searchedCourses.length > 0 && (
          <div className="grid max-h-[240px] grid-cols-1 gap-1 overflow-y-auto rounded-lg text-dark md:grid-cols-2">
            {searchedCourses.map(course => (
              <div
                className={`trans-200 flex cursor-pointer items-start gap-4 rounded-lg border border-neutral-800 p-2 py-2 ${selectedCourses.some(c => c._id === course._id) ? 'bg-green-200' : ''}`}
                onClick={() =>
                  setSelectedCourses(prev =>
                    selectedCourses.some(c => c._id === course._id)
                      ? prev.filter(c => c._id !== course._id)
                      : [...prev, course]
                  )
                }
                key={course._id}
              >
                <div className="relative aspect-video flex-shrink-0">
                  <Image
                    className="rounded-md shadow-lg"
                    src={course.images[0]}
                    width={70}
                    height={70}
                    alt={course.title}
                  />
                </div>

                <p className="trans-200 -mt-0.5 line-clamp-2 w-full text-ellipsis font-body text-sm leading-5 tracking-wide">
                  {course.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* MARK: Begin - End */}
        <div className="mb-5 mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Begin */}
          <Input
            id="begin"
            label="Begin"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="datetime-local"
            min={moment().format('YYYY-MM-DDTHH:mm')}
            icon={FaPlay}
            onFocus={() => clearErrors('begin')}
          />

          {/* Expire */}
          <Input
            id="expire"
            label="Expire"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="datetime-local"
            icon={FaPause}
            onFocus={() => clearErrors('expire')}
          />
        </div>

        {/* Times Left */}
        <Input
          id="timesLeft"
          label="Times Left"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="number"
          icon={FaArrowCircleLeft}
          className="mb-5"
          onFocus={() => clearErrors('timesLeft')}
        />

        {/* Active */}
        <div className="flex">
          <div className="flex items-center rounded-lg bg-white px-3">
            <FaPlay
              size={16}
              className="text-secondary"
            />
          </div>
          <input
            className="peer"
            type="checkbox"
            id="active"
            hidden
            {...register('active', { required: false })}
          />
          <label
            className="trans-200 cursor-pointer select-none rounded-lg border border-green-500 bg-white px-4 py-2 text-green-500 peer-checked:bg-green-500 peer-checked:text-light"
            htmlFor="active"
          >
            Active
          </label>
        </div>

        {/* MARK: Add Button */}
        <LoadingButton
          className="trans-200 mt-4 rounded-lg bg-secondary px-4 py-2 font-semibold text-light hover:bg-primary"
          onClick={handleSubmit(onSubmit)}
          text="Add"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddActivationCodePage
