import { IOrder } from '@/models/OrderModel'
import { IVoucher } from '@/models/VoucherModel'
import { deliverOrderApi, reDeliverOrder } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatTime, isToday } from '@/utils/time'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEye, FaHistory, FaRegTrashAlt, FaSearch } from 'react-icons/fa'
import { GrDeliver } from 'react-icons/gr'
import { ImCancelCircle } from 'react-icons/im'
import { RiDonutChartFill } from 'react-icons/ri'
import { SiGooglemessages } from 'react-icons/si'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import Input from '../Input'
import useUtils from '@/libs/hooks/useUtils'

interface OrderItemProps {
  data: IOrder
  loadingOrders: string[]
  className?: string

  setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>
  selectedOrders: string[]
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>

  handleCancelOrders: (ids: string[]) => void
  handleDeleteOrders: (ids: string[]) => void
  setValue: (name: string, value: any) => void
  handleFilter: () => void
}

function OrderItem({
  data,
  loadingOrders,
  className = '',

  // selected
  setOrders,
  selectedOrders,
  setSelectedOrders,

  // functions
  handleCancelOrders,
  handleDeleteOrders,
  setValue,
  handleFilter,
}: OrderItemProps) {
  // hooks
  const { handleCopy } = useUtils()

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'deliver' | 're-deliver' | 'delete'>('delete')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [isOpenMessageModal, setIsOpenMessageModal] = useState<boolean>(false)

  // form
  const {
    register,
    formState: { errors },
    clearErrors,
    getValues,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  })

  // handle deliver order
  const handleDeliverOrder = useCallback(async () => {
    // start loading
    setIsLoading(true)

    try {
      // send request to deliver order
      const { message } = await deliverOrderApi(data._id, getValues('message'))

      // update order status
      setOrders(prev => prev.map(o => (o._id === data._id ? { ...o, status: 'done' } : o)))

      // show success message
      toast.success(message)

      // clear message
      reset()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [data._id, setOrders, getValues, reset])

  // handle re-deliver order
  const handleReDeliverOrder = useCallback(async () => {
    // start loading
    setIsLoading(true)

    try {
      // send request to re-deliver order
      const { message } = await reDeliverOrder(data._id, getValues('message'))

      // show success message
      toast.success(message)

      // clear message
      reset()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [data._id, getValues, reset])

  return (
    <>
      <div
        className={`justify trans-200 relative flex w-full cursor-pointer items-start gap-2 rounded-lg p-4 text-dark shadow-lg ${
          selectedOrders.includes(data._id)
            ? '-translate-y-1 bg-violet-50'
            : data.status === 'done'
              ? 'bg-green-100'
              : data.status === 'pending'
                ? 'bg-red-100'
                : 'bg-slate-200'
        } ${className}`}
        onClick={() =>
          setSelectedOrders(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        {data.isPackage && (
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-light bg-neutral-950 px-3 py-1 text-xs font-semibold text-light shadow-lg">
            {data.items[0].title}
          </div>
        )}

        <div className="w-[calc(100%_-_44px)]">
          {/* MARK: Thumbnails */}
          {!data.isPackage && (
            <div className="mb-2 flex h-full max-h-[152px] w-full flex-wrap items-center gap-2 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {data.items.map((course: any) => (
                  <Link
                    href={`/${course.slug}`}
                    prefetch={false}
                    className="relative flex-shrink-0 overflow-hidden rounded-lg shadow-md"
                    onClick={e => e.stopPropagation()}
                    key={course._id}
                  >
                    <Image
                      className="aspect-video h-auto w-auto"
                      src={course.images[0] || '/images/not-found.jpg'}
                      height={100}
                      width={100}
                      alt={course.title}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* MARK: Information */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <p
              className={`inline font-semibold text-${
                data.status === 'done' ? 'green' : data.status === 'pending' ? 'red' : 'slate'
              }-400`}
              title="status"
            >
              {data.status}
            </p>

            {/* Code */}
            <p
              className="inline font-semibold text-sky-500"
              title="code"
            >
              {data.code}
            </p>

            {/* Method */}
            <p
              className={`inline font-semibold text-[${
                data.paymentMethod === 'momo' ? '#a1396c' : '#399162'
              }]`}
              title="payment-method"
            >
              {data.paymentMethod}
            </p>
          </div>

          {/* Email */}
          <div
            className="line-clamp-1 flex items-center gap-1 text-ellipsis font-body tracking-wider underline"
            title={'Email: ' + data.email}
          >
            <span
              onClick={e => {
                e.stopPropagation()
                handleCopy(data.email)
              }}
            >
              {data.email}
            </span>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-secondary px-1.5 py-1">
              <span
                className="group text-secondary"
                onClick={e => {
                  e.stopPropagation()
                  setValue('search', data.email)
                  handleFilter()
                }}
              >
                <FaSearch
                  size={14}
                  className="wiggle"
                />
              </span>
            </div>
          </div>

          {/* Received User */}
          {data.receivedUser && (
            <div className="mt-2 flex items-center gap-1 border-t border-slate-600 pt-1.5 font-body tracking-wider">
              <span className="line-clamp-1 text-ellipsis text-orange-500 underline underline-offset-1">
                {data.receivedUser}
              </span>{' '}
              <div className="inline-flex items-center gap-1.5 rounded-md border border-secondary px-1.5 py-1">
                <span
                  className="group text-secondary"
                  onClick={e => {
                    e.stopPropagation()
                    setValue('search', data.receivedUser)
                    handleFilter()
                  }}
                >
                  <FaSearch
                    size={14}
                    className="wiggle"
                  />
                </span>
              </div>
            </div>
          )}

          {/* Total */}
          <p
            className="mr-2 flex flex-wrap items-center gap-x-2 text-xl font-semibold text-green-500"
            title="total"
          >
            {formatPrice(data.total)}{' '}
          </p>

          {/* Voucher */}
          {data.voucher && data.discount && (
            <p
              className="text-sm font-semibold text-slate-400"
              title={`voucher: ${(data.voucher as IVoucher).desc}`}
            >
              {(data.voucher as IVoucher).code}{' '}
              <span className="font-normal text-secondary">({formatPrice(data.discount)})</span>
            </p>
          )}

          {/* Created */}
          <div className="flex flex-wrap gap-x-2">
            <p
              className="text-sm"
              title="Created (d/m/y)"
            >
              <span className="font-semibold">Created: </span>
              <span className={isToday(new Date(data.createdAt)) ? 'font-semibold text-slate-600' : ''}>
                {formatTime(data.createdAt)}
              </span>
            </p>

            {/* Updated */}
            <p
              className="text-sm"
              title="Updated (d/m/y)"
            >
              <span className="font-semibold">Updated: </span>
              <span
                className={`${
                  +new Date() - +new Date(data.updatedAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
                }`}
              >
                {formatTime(data.updatedAt)}
              </span>
            </p>
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className="flex flex-shrink-0 flex-col gap-4 rounded-lg border border-dark bg-white px-2 py-3 text-dark">
          {/* Detail Button */}
          <Link
            href={`/admin/order/${data.code}`}
            className="group block"
            onClick={e => e.stopPropagation()}
            title="Detail"
          >
            <FaEye
              size={18}
              className="wiggle text-primary"
            />
          </Link>

          {/* Deliver Button */}
          {data.status !== 'done' && (
            <button
              className="group block"
              disabled={loadingOrders.includes(data._id) || isLoading}
              onClick={e => {
                e.stopPropagation()
                setConfirmType('deliver')
                setIsOpenConfirmModal(true)
              }}
              title="Deliver"
            >
              {isLoading ? (
                <RiDonutChartFill
                  size={18}
                  className="animate-spin text-slate-300"
                />
              ) : (
                <GrDeliver
                  size={18}
                  className="wiggle text-yellow-400"
                />
              )}
            </button>
          )}

          {/* Re-Deliver Button */}
          {data.status === 'done' && (
            <button
              className="group block"
              disabled={loadingOrders.includes(data._id) || isLoading}
              onClick={e => {
                e.stopPropagation()
                setConfirmType('re-deliver')
                setIsOpenConfirmModal(true)
              }}
              title="Re-Deliver"
            >
              {isLoading ? (
                <RiDonutChartFill
                  size={18}
                  className="animate-spin text-slate-300"
                />
              ) : (
                <FaHistory
                  size={18}
                  className="wiggle text-blue-500"
                />
              )}
            </button>
          )}

          {/* Add Messsage To Deliver Button */}
          <button
            className="group block"
            disabled={loadingOrders.includes(data._id) || isLoading}
            onClick={e => {
              e.stopPropagation()
              setIsOpenMessageModal(true)
            }}
            title="Re-Deliver"
          >
            <SiGooglemessages
              size={19}
              className="wiggle text-teal-500"
            />
          </button>

          {/* Cancel Button */}
          {data.status === 'pending' && (
            <button
              className="group block"
              disabled={loadingOrders.includes(data._id) || isLoading}
              onClick={e => {
                e.stopPropagation()
                handleCancelOrders([data._id])
              }}
              title="Cancel"
            >
              <ImCancelCircle
                size={18}
                className="wiggle text-slate-300"
              />
            </button>
          )}

          {/* Delete Button */}
          <button
            className="group block"
            disabled={loadingOrders.includes(data._id) || isLoading}
            onClick={e => {
              e.stopPropagation()
              setConfirmType('delete')
              setIsOpenConfirmModal(true)
            }}
            title="Delete"
          >
            {loadingOrders.includes(data._id) ? (
              <RiDonutChartFill
                size={18}
                className="animate-spin text-slate-300"
              />
            ) : (
              <FaRegTrashAlt
                size={18}
                className="wiggle text-rose-500"
              />
            )}
          </button>
        </div>

        {isOpenMessageModal && (
          <div
            className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center gap-2 rounded-md bg-teal-400 bg-opacity-80 p-21"
            onClick={e => {
              e.stopPropagation()
              setIsOpenMessageModal(false)
            }}
          >
            <Input
              id="message"
              label="Message"
              register={register}
              errors={errors}
              required
              type="text"
              icon={SiGooglemessages}
              className="w-full shadow-lg"
              onClick={e => e.stopPropagation()}
              onFocus={() => clearErrors('message')}
            />
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title={`${confirmType.charAt(0).toUpperCase() + confirmType.slice(1)} Order`}
        content={`Are you sure that you want to ${confirmType} this order?`}
        onAccept={() =>
          confirmType === 'deliver'
            ? handleDeliverOrder()
            : confirmType === 're-deliver'
              ? handleReDeliverOrder()
              : handleDeleteOrders([data._id])
        }
        isLoading={loadingOrders.includes(data._id) || isLoading}
        color={confirmType === 'deliver' ? 'yellow' : confirmType === 're-deliver' ? 'sky' : 'rose'}
      />
    </>
  )
}

export default memo(OrderItem)
