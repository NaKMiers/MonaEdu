import { IFlashSale } from '@/models/FlashSaleModel'
import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface FlashSaleItemProps {
  data: IFlashSale
  loadingFlashSales: string[]
  className?: string

  selectedFlashSales: string[]
  setSelectedFlashSales: React.Dispatch<React.SetStateAction<string[]>>

  handleDeleteFlashSales: (ids: string[]) => void
}

function FlashSaleItem({
  data,
  loadingFlashSales,
  className = '',
  // selected
  selectedFlashSales,
  setSelectedFlashSales,
  // functions
  handleDeleteFlashSales,
}: FlashSaleItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`trans-200 flex cursor-pointer flex-col rounded-lg p-4 text-dark shadow-lg ${
          selectedFlashSales.includes(data._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${className}`}
        onClick={() =>
          setSelectedFlashSales(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        {/* MARK: Body */}
        {/* Value - Time Type - Type */}
        <div className="font-semibold">
          <span
            title="Value"
            className="mr-2 font-semibold text-primary"
          >
            {data.type === 'percentage' ? data.value : formatPrice(+data.value)}
          </span>
          <span title="Time Type">{data.timeType}</span> <span title="Type">{data.type}</span>
        </div>

        {/*  Duration */}
        {data.timeType === 'loop' && (
          <div>
            <span
              className="font-semibold"
              title="duration"
            >
              Duration:
            </span>{' '}
            <span
              className="font-semibold text-secondary"
              title="duration"
            >
              {data.duration}m
            </span>
          </div>
        )}

        {/* Begin - Expire */}
        <div>
          <span
            title="Begin (d/m/y)"
            className="font-semibold"
          >
            Begin:{' '}
          </span>
          <span title="Begin (d/m/y)">{formatTime(data.begin)}</span>
        </div>
        {data.timeType === 'once' && (
          <div>
            <span
              title="Expire (d/m/y)"
              className="font-semibold"
            >
              Expire:{' '}
            </span>
            <span title="Expire (d/m/y)">{formatTime(data.expire)}</span>
          </div>
        )}

        {/* Course Quantity */}
        <p className="font-semibold">
          <span>Course Quantity:</span> <span className="text-primary">{data.courseQuantity}</span>
        </p>

        {/* Applying Courses */}
        <div className="mb-3 flex max-h-[300px] flex-wrap gap-2 overflow-y-auto rounded-lg">
          {data.courses?.map(course => (
            <div
              className="flex items-start gap-2 rounded-lg border border-slate-300 bg-white p-2"
              key={course._id}
            >
              <Image
                className="aspect-video rounded-md border"
                src={course.images[0]}
                height={80}
                width={80}
                alt={course.title}
              />
              <span
                className="line-clamp-2 text-ellipsis"
                title={course.title}
              >
                {course.title}
              </span>
            </div>
          ))}
        </div>

        {/* MARK: Action Buttons */}
        <div className="flex gap-4 self-end rounded-lg border border-dark px-3 py-2 text-dark">
          {/* Edit Button Link */}
          <Link
            href={`/admin/flash-sale/${data._id}/edit`}
            className="group block"
            onClick={e => e.stopPropagation()}
            title="Edit"
          >
            <MdEdit
              size={18}
              className="wiggle"
            />
          </Link>

          {/* Delete Button */}
          <button
            className="group block"
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingFlashSales.includes(data._id)}
            title="Delete"
          >
            {loadingFlashSales.includes(data._id) ? (
              <RiDonutChartFill
                size={18}
                className="animate-spin text-slate-300"
              />
            ) : (
              <FaTrash
                size={18}
                className="wiggle"
              />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete Flash Sale"
        content="Are you sure that you want to delete this flash sale?"
        onAccept={() => handleDeleteFlashSales([data._id])}
        isLoading={loadingFlashSales.includes(data._id)}
      />
    </>
  )
}

export default memo(FlashSaleItem)
