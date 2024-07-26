'use client'

import CourseCard from '@/components/CourseCard'
import Input from '@/components/Input'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IOrder } from '@/models/OrderModel'
import { IVoucher } from '@/models/VoucherModel'
import { editOrderApi, getOrderApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSave, FaTrash } from 'react-icons/fa'
import { MdCancel, MdDateRange, MdEdit } from 'react-icons/md'
import { RiCheckboxMultipleBlankLine, RiDonutChartFill } from 'react-icons/ri'

function AdminOrderDetailPage({ params: { code } }: { params: { code: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()

  // states
  const [originalOrder, setOriginalOrder] = useState<IOrder | null>(null)
  const [order, setOrder] = useState<IOrder | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const totalQuantity: number = order?.items.length || 0

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      code: '',
      createdAt: '',
      email: '',
      status: '',
      total: 0,
    },
  })

  // MARK: Get Data
  // get order
  useEffect(() => {
    const getOrder = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { order } = await getOrderApi(code)

        // set order to state
        setOrder(order)
        setOriginalOrder(order)

        // set form values
        reset({
          code: order.code,
          createdAt: moment(order.createdAt).local().format('YYYY-MM-DDTHH:mm'),
          email: order.email,
          status: order.status,
          total: order.total,
        })
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    if (code) {
      getOrder()
    }
  }, [dispatch, reset, code])

  // MARK: Save Order Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (order) {
        setIsSaving(true)

        try {
          const { updatedOrder, message } = await editOrderApi(order?._id, { ...order, ...data })

          // updated order state
          setOrder(updatedOrder)
          setOriginalOrder(updatedOrder)

          // show success
          toast.success(message)

          // turn off edit mode
          setEditMode(false)

          // redirect back
          router.push('/admin/order/all')
        } catch (err: any) {
          toast.error(err.message)
          console.log(err)
        } finally {
          // reset loading state
          setIsSaving(false)
        }
      }
    },
    [router, order]
  )

  // handle remove item
  const handleRemoveItem = useCallback((removeItem: any) => {
    setOrder(
      (prev: any) =>
        ({
          ...prev,
          items: prev.items.filter((item: any) => item._id !== removeItem._id),
        } as IOrder)
    )
  }, [])

  return (
    <div className='bg-white py-21 px-4 rounded-medium shadow-medium-light text-dark'>
      <div className='font-semibold text-3xl font-body tracking-wide mb-5 flex items-center justify-between'>
        <h1 className='flex items-center gap-2'>
          Order Detail:
          {!editMode ? (
            <>
              <span className='text-primary font-sans'>{order?.code}</span>
            </>
          ) : (
            <Input
              id='code'
              label='Code'
              disabled={isSaving}
              register={register}
              errors={errors}
              required
              type='text'
              maxLength={5}
              icon={MdDateRange}
              onFocus={() => clearErrors('code')}
            />
          )}
        </h1>
        <div className='flex items-center justify-center gap-2'>
          {editMode ? (
            <>
              <button
                className='group flex items-center justify-center h-9 rounded-md px-2 border-2 border-slate-400 text-slate-400 hover:bg-slate-400 hover:text-white trans-200'
                onClick={() => {
                  setOrder(originalOrder)
                  setEditMode(false)
                }}
              >
                <MdCancel size={20} className='wiggle' />
              </button>
              <button
                className={`group flex items-center justify-center h-9 rounded-md px-2 border-2 hover:bg-rose-500 hover:text-white trans-200 ${
                  isSaving
                    ? 'pointer-events-none border-slate-400 text-slate-400'
                    : 'border-rose-500 text-rose-500'
                }`}
                onClick={handleSubmit(onSubmit)}
              >
                {isSaving ? (
                  <RiDonutChartFill size={20} className='animate-spin' />
                ) : (
                  <FaSave size={20} className='wiggle' />
                )}
              </button>
            </>
          ) : (
            <button
              className='group flex items-center justify-center h-9 rounded-md px-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white trans-200'
              onClick={() => setEditMode(true)}
            >
              <MdEdit size={20} className='wiggle' />
            </button>
          )}
        </div>
      </div>

      {/* MARK: Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-5 items-start'>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide trans-200'>
          {!editMode ? (
            <>
              <span className='font-semibold'>Date: </span>
              {order && <span className=''>{formatTime(order.createdAt)}</span>}
            </>
          ) : (
            <Input
              id='createdAt'
              label='Date'
              disabled={isSaving}
              register={register}
              errors={errors}
              required
              type='datetime-local'
              icon={MdDateRange}
              className='my-1'
              onFocus={() => clearErrors('createdAt')}
            />
          )}
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide trans-200'>
          {!editMode ? (
            <>
              <span className='font-semibold'>Status: </span>
              <span
                className={`font-semibold ${
                  order?.status === 'pending'
                    ? 'text-yellow-400'
                    : order?.status === 'done'
                    ? 'text-green-500'
                    : 'text-slate-400'
                }`}
              >
                {order?.status}
              </span>
            </>
          ) : (
            <Input
              id='status'
              label='Status'
              disabled={isSaving}
              register={register}
              errors={errors}
              icon={RiCheckboxMultipleBlankLine}
              type='select'
              onFocus={() => clearErrors('status')}
              options={[
                {
                  value: 'pending',
                  label: 'Pending',
                },
                {
                  value: 'done',
                  label: 'Done',
                },
                {
                  value: 'cancel',
                  label: 'Cancel',
                },
              ]}
            />
          )}
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide trans-200'>
          {!editMode ? (
            <>
              <span className='font-semibold'>Email: </span>
              <span className='text-sky-500'>{order?.email}</span>
            </>
          ) : (
            <Input
              id='email'
              label='Email'
              disabled={isSaving}
              register={register}
              errors={errors}
              required
              type='email'
              icon={MdDateRange}
              className='my-1'
              onFocus={() => clearErrors('email')}
            />
          )}
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide trans-200'>
          {!editMode ? (
            <>
              <span className='font-semibold'>Total: </span>
              <span className='text-secondary font-semibold'>{formatPrice(order?.total)}</span>
            </>
          ) : (
            <Input
              id='total'
              label='Total'
              disabled={isSaving}
              register={register}
              errors={errors}
              required
              type='number'
              icon={MdDateRange}
              className='my-1'
              onFocus={() => clearErrors('total')}
            />
          )}
        </div>
        {order?.voucher && (
          <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide trans-200'>
            <span className='font-semibold'>Voucher: </span>
            <span className='text-slate-400 font-semibold' title={(order?.voucher as IVoucher).desc}>
              {(order?.voucher as IVoucher).code}
            </span>
          </div>
        )}
        {!!order?.discount && (
          <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide trans-200'>
            <span className='font-semibold'>Giảm giá: </span>
            <span className='text-secondary font-semibold'>{formatPrice(order?.discount)}</span>
          </div>
        )}
      </div>

      {/* Course */}
      <h3 className='text-2xl font-semibold mb-4 mt-6'>
        Course{totalQuantity > 1 ? 's' : ''} ({totalQuantity})
      </h3>

      {/* MARK: Items */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-21'>
        {order?.items.map((course: any, index: number) => (
          <div className='relative' key={index}>
            {editMode && (
              <div className='flex gap-2 absolute z-10 top-2 right-2'>
                {/* Remove Button */}
                <button
                  className='group rounded-md h-7 w-7 flex items-center justify-center border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white trans-200'
                  onClick={() => handleRemoveItem(course)}
                >
                  <FaTrash size={12} className='wiggle' />
                </button>
              </div>
            )}
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOrderDetailPage
