'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { getFlashSaleApi, getForceAllCoursesApi, updateFlashSaleApi } from '@/requests'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaPause, FaPlay } from 'react-icons/fa6'
import { IoReload } from 'react-icons/io5'
import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function EditFlashSalePage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // states
  const [courses, setCourses] = useState<ICourse[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [timeType, setTimeType] = useState<'loop' | 'once'>('loop')

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      type: 'percentage',
      value: '',
      begin: new Date().toISOString().split('T')[0],
      expire: '',
      timeType: 'loop',
      duration: 120,
    },
  })

  // MARK: Get Data
  // get flash sale by id
  useEffect(() => {
    const getCourse = async () => {
      try {
        // send request to server to get flash sale
        const { flashSale } = await getFlashSaleApi(id) // cache: no-store

        // // set value to form
        setValue('type', flashSale.type)
        setValue('value', flashSale.value)
        setValue('begin', new Date(flashSale.begin).toISOString().split('T')[0])
        setValue(
          'expire',
          flashSale.expire ? new Date(flashSale.expire).toISOString().split('T')[0] : ''
        )
        setValue('duration', flashSale.duration || 120)
        setValue('timeType', flashSale.timeType)
        setTimeType(flashSale.timeType)

        setSelectedCourses(flashSale.courses.map((course: ICourse) => course._id))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getCourse()
  }, [id, setValue])

  // get all courses to apply
  useEffect(() => {
    const getAllCourses = async () => {
      try {
        // send request to server
        const { courses } = await getForceAllCoursesApi()

        // set courses to state
        setCourses(courses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getAllCourses()
  }, [])

  // set page title
  useEffect(() => {
    document.title = 'Edit Flash Sale - Mona Edu'
  }, [])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      if (data.type === 'percentage' && !data.value.endsWith('%')) {
        setError('value', { type: 'manual', message: 'Value must have %' })
        isValid = false
      }

      // if type if percentage, value have '%' at the end and must be number
      if (data.type === 'percentage' && isNaN(Number(data.value.replace('%', '')))) {
        setError('value', { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if type if fixed-reduce, value must be number
      if (data.type !== 'percentage' && isNaN(Number(data.value))) {
        setError('value', { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if time type is loop, duration must be > 0
      if (data.timeType === 'loop' && data.duration <= 0) {
        setError('duration', { type: 'manual', message: 'Duration must be > 0' })
        isValid = false
      }

      // if expire is less than begin
      if (data.expire && new Date(data.expire) <= new Date(data.begin)) {
        setError('expire', { type: 'manual', message: 'Expire must be > begin' })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Submit
  // handle send request to server to edit flash sale
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    // validate form
    if (!handleValidate(data)) return

    // set loading
    dispatch(setLoading(true))

    try {
      // send request to server
      const { message } = await updateFlashSaleApi(id, data, selectedCourses)

      // show success message
      toast.success(message)

      // redirect back
      router.back()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="mx-auto max-w-1200">
      {/* Admin Header */}
      <AdminHeader
        title="Edit Flash Sale"
        backLink="/admin/flash-sale/all"
      />

      <Divider size={5} />

      <div className="rounded-lg bg-slate-200 p-21">
        {/* Type */}
        <Input
          id="type"
          label="Type"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="select"
          onFocus={() => clearErrors('type')}
          options={[
            {
              label: 'Percentage',
              value: 'percentage',
              selected: true,
            },
            {
              label: 'Fixed-Reduce',
              value: 'fixed-reduce',
              selected: false,
            },
            {
              label: 'Fixed',
              value: 'fixed',
              selected: false,
            },
          ]}
          icon={RiCharacterRecognitionLine}
          className="mb-5"
        />

        {/* Value */}
        <Input
          id="value"
          label="Value"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="text"
          icon={MdNumbers}
          className="mb-5"
          onFocus={() => clearErrors('value')}
        />

        {/* Begin */}
        <Input
          id="begin"
          label="Begin"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="datetime-local"
          icon={FaPlay}
          className="mb-5"
          onFocus={() => clearErrors('begin')}
        />

        {/* Time Type */}
        <div className="grid-col-1 mb-5 grid gap-5 lg:grid-cols-2">
          <Input
            id="timeType"
            label="Time Type"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="select"
            onChange={(e: any) => {
              setValue('timeType', e.target.value)
              setTimeType(e.target.value as 'loop' | 'once')
            }}
            onFocus={() => clearErrors('timeType')}
            options={[
              {
                label: 'Loop',
                value: 'loop',
                selected: true,
              },
              {
                label: 'Once',
                value: 'once',
                selected: false,
              },
            ]}
            icon={RiCharacterRecognitionLine}
          />

          {timeType === 'loop' && (
            <Input
              id="duration"
              label="Duration"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="number"
              icon={IoReload}
              onFocus={() => clearErrors('duration')}
            />
          )}
          {timeType === 'once' && (
            <Input
              id="expire"
              label="Expire"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="datetime-local"
              icon={FaPause}
              onFocus={() => clearErrors('expire')}
            />
          )}
        </div>

        {/* MARK: Ready to apply courses */}
        <p className="mb-1 text-xl font-semibold text-dark">Select Courses</p>
        <div className="mb-5 flex max-h-[300px] flex-wrap gap-2 overflow-y-auto rounded-lg bg-white p-3">
          <div
            className={`trans-200 flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 ${
              courses.length === selectedCourses.length
                ? 'border-dark bg-dark-100 text-light'
                : 'border-slate-300 text-dark'
            } }`}
            title="All"
            onClick={() =>
              courses.length === selectedCourses.length
                ? setSelectedCourses([])
                : setSelectedCourses(courses.map(course => course._id))
            }
          >
            <span className="line-clamp-1 block text-ellipsis text-nowrap">All</span>
          </div>
          {courses.map(course => (
            <div
              className={`trans-200 flex max-w-[250px] cursor-pointer items-center gap-2 rounded-lg border-2 border-slate-300 px-2 py-1 ${
                selectedCourses.includes(course._id)
                  ? 'border-light bg-secondary text-light'
                  : course.flashSale
                    ? 'bg-slate-200'
                    : 'text-dark'
              }`}
              title={course.title}
              onClick={() =>
                selectedCourses.includes(course._id)
                  ? setSelectedCourses(prev => prev.filter(id => id !== course._id))
                  : setSelectedCourses(prev => [...prev, course._id])
              }
              key={course._id}
            >
              <Image
                className="aspect-video rounded-md border-2 border-light"
                src={course.images[0]}
                height={60}
                width={60}
                alt="thumbnail"
              />
              <span className="line-clamp-1 block text-ellipsis text-nowrap text-sm">
                {course.title}
              </span>
            </div>
          ))}
        </div>

        {/* MARK: Save Button */}
        <LoadingButton
          className="trans-200 rounded-lg bg-secondary px-4 py-2 font-semibold text-light hover:bg-primary"
          onClick={handleSubmit(onSubmit)}
          text="Save"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default EditFlashSalePage
