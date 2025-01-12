import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { updateCoursePropertyApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaEye, FaTrash } from 'react-icons/fa'
import { IoRocketSharp } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { PiLightningFill, PiLightningSlashFill } from 'react-icons/pi'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import useUtils from '@/libs/hooks/useUtils'
import { formatTime } from '@/utils/time'

interface CourseItemProps {
  data: ICourse
  loadingCourses: string[]
  className?: string

  // selected
  selectedCourses: string[]
  setSelectedCourses: React.Dispatch<React.SetStateAction<string[]>>

  // functions
  handleActivateCourses: (ids: string[], active: boolean) => void
  handleBootCourses: (ids: string[], active: boolean) => void
  handleRemoveApplyingFlashSales: (ids: string[]) => void
  handleDeleteCourses: (ids: string[]) => void
}

function CourseItem({
  data,
  loadingCourses,
  className = '',
  // selected
  selectedCourses,
  setSelectedCourses,
  // functions
  handleActivateCourses,
  handleBootCourses,
  handleRemoveApplyingFlashSales,
  handleDeleteCourses,
}: CourseItemProps) {
  // hooks
  const { handleCopy } = useUtils()

  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<
    'deactivate' | 'unbooted' | 'Remove Flash Sale' | 'delete'
  >('delete')

  // editable properties
  const [joined, setJoined] = useState<number>(data.joined)
  const [likes, setLikes] = useState<number>(data.likes.length)
  const [editingJoined, setEditingJoined] = useState<boolean>(false)
  const [editingLikes, setEditingLikes] = useState<boolean>(false)

  // handle update properties
  const handleUpdateProperties = useCallback(
    async (property: string) => {
      try {
        const { updatedCourse, message } = await updateCoursePropertyApi(
          data._id,
          property,
          property === 'joined' ? joined : likes
        )

        // show success message
        toast.success(message)

        // update states
        if (property === 'joined') {
          setJoined(updatedCourse.joined)
          setEditingJoined(false)
        } else {
          setLikes(updatedCourse.likes.length)
          setEditingLikes(false)
        }
      } catch (err: any) {
        console.error(err)
        toast.error(err.message)
      }
    },
    [data._id, joined, likes]
  )

  return (
    <>
      <div
        className={`trans-200 relative flex cursor-pointer items-start justify-between gap-2 rounded-lg p-4 shadow-lg ${
          selectedCourses.includes(data._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${className}`}
        onClick={() =>
          setSelectedCourses(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        <div className="flex-grow">
          {/* MARK: Thumbnails */}
          <Link
            href={`/${data.slug}`}
            prefetch={false}
            className="relative mb-2 flex max-w-[160px] items-center overflow-hidden rounded-lg shadow-md"
            onClick={e => e.stopPropagation()}
            title={data._id}
          >
            <div className="no-scrollbar flex w-full snap-x snap-mandatory items-center overflow-x-scroll">
              {data.images.map((src, index) => (
                <Image
                  key={index}
                  className="aspect-video flex-shrink-0 snap-start"
                  src={src}
                  height={200}
                  width={200}
                  alt={data.title}
                />
              ))}
            </div>
          </Link>

          {/* Flash sale */}
          {data.flashSale && (
            <PiLightningFill
              className="absolute -top-1.5 left-1 animate-bounce text-yellow-400"
              size={25}
            />
          )}

          {/* Title */}
          <p
            className="mt-1 font-semibold tracking-wider text-dark"
            title={data.title}
            onClick={e => {
              e.stopPropagation()
              handleCopy(data.title)
            }}
          >
            {data.title}
          </p>

          {/* Category */}
          <p className="mb-1 text-sm font-semibold tracking-wider text-slate-500">
            Category:{' '}
            <Link
              href={`/categories/${(data.category as ICategory)?.slug}`}
              className="font-normal italic text-sky-500 underline"
            >
              {(data.category as ICategory)?.slug}
            </Link>
          </p>

          {/* Text Hook */}
          {data.textHook && (
            <p
              className="line-clamp-2 text-ellipsis rounded-md border px-2 py-0.5 font-body text-sm tracking-wider text-dark"
              title={data.textHook}
              onClick={e => {
                e.stopPropagation()
                handleCopy(data.textHook)
              }}
            >
              Hook: {data.textHook}
            </p>
          )}

          {/* Author */}
          <p
            className="text-sm font-semibold tracking-wider text-slate-500"
            title={data.author}
            onClick={e => {
              e.stopPropagation()
              handleCopy(data.author)
            }}
          >
            Author: <span className="font-normal">{data.author}</span>
          </p>

          {/* Price - Old Price */}
          <div className="flex flex-wrap items-center gap-2">
            <p
              className="text-xl font-semibold text-primary"
              onClick={e => {
                e.stopPropagation()
                handleCopy(data.price.toString())
              }}
            >
              {formatPrice(data.price)}
            </p>
            {data.oldPrice && (
              <p
                className="text-sm text-slate-500 line-through"
                onClick={e => {
                  e.stopPropagation()
                  handleCopy(data.oldPrice.toString())
                }}
              >
                {formatPrice(data.oldPrice)}
              </p>
            )}
          </div>

          {/* Tags */}
          <p className="text-sm text-slate-500">
            <span className="font-semibold">Tags: </span>
            {data.tags.map((tag: any, index) => (
              <span
                className="text-slate-400"
                onClick={e => {
                  e.stopPropagation()
                  handleCopy(tag.title)
                }}
                key={tag.slug}
              >
                {tag.title}
                {index < data.tags.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* Languages */}
          <p className="text-sm text-slate-500">
            <span className="font-semibold">Languages: </span>
            {data?.languages?.map((language, index) => (
              <span
                className="text-slate-600"
                onClick={e => {
                  e.stopPropagation()
                  handleCopy(language)
                }}
                key={index}
              >
                {language}
                {index < data.languages.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* Joined & Likes */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <div onDoubleClick={() => setEditingJoined(true)}>
              {!editingJoined ? (
                <>
                  <span className="font-semibold">Joined: </span>
                  <span
                    className="text-green-500"
                    onClick={e => {
                      e.stopPropagation()
                      handleCopy(joined.toString())
                    }}
                  >
                    {joined}
                  </span>
                </>
              ) : (
                <input
                  type="number"
                  value={joined}
                  min={0}
                  onChange={e => setJoined(+e.target.value)}
                  onClick={e => e.stopPropagation()}
                  onBlur={() => handleUpdateProperties('joined')}
                  className="mt-1 max-w-[80px] rounded-lg border px-2 py-1 shadow-lg outline-none"
                />
              )}
            </div>
            <div onDoubleClick={() => setEditingLikes(true)}>
              {!editingLikes ? (
                <>
                  <span className="font-semibold">Likes: </span>
                  <span
                    className="text-rose-500"
                    onClick={e => {
                      e.stopPropagation()
                      handleCopy(likes.toString())
                    }}
                  >
                    {likes}
                  </span>
                </>
              ) : (
                <input
                  type="number"
                  value={likes}
                  min={0}
                  onChange={e => setLikes(+e.target.value)}
                  onClick={e => e.stopPropagation()}
                  onBlur={() => handleUpdateProperties('likes')}
                  className="mt-1 max-w-[80px] rounded-lg border px-2 py-1 shadow-lg outline-none"
                />
              )}
            </div>
          </div>

          {/* Created & Updated */}
          <p
            className="text-sm text-slate-500"
            title="Updated At (d/m/y)"
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

        {/* MARK: Action Buttons */}
        <div className="flex flex-col gap-4 rounded-lg border border-dark px-2 py-3 text-dark">
          {/* Active Button */}
          <button
            className="group block"
            onClick={e => {
              e.stopPropagation()
              // is being active
              if (data.active) {
                setIsOpenConfirmModal(true)
                setConfirmType('deactivate')
              } else {
                handleActivateCourses([data._id], true)
              }
            }}
            disabled={loadingCourses.includes(data._id)}
            title={data.active ? 'Deactivate' : 'Activate'}
          >
            <FaCheck
              size={18}
              className={`wiggle ${data.active ? 'text-green-500' : 'text-slate-300'}`}
            />
          </button>

          {/* Boot Button */}
          <button
            className="group block"
            onClick={e => {
              e.stopPropagation()
              // is being booted
              if (data.booted) {
                setIsOpenConfirmModal(true)
                setConfirmType('unbooted')
              } else {
                handleBootCourses([data._id], !data.booted)
              }
            }}
            disabled={loadingCourses.includes(data._id)}
            title={data.booted ? 'Boot' : 'Unboot'}
          >
            <IoRocketSharp
              size={18}
              className={`wiggle ${data.booted ? 'text-green-500' : 'text-slate-300'}`}
            />
          </button>

          {/* Remove Flashsale Button */}
          {data.flashSale && (
            <button
              className="group block"
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
                setConfirmType('Remove Flash Sale')
              }}
              disabled={loadingCourses.includes(data._id)}
              title="Remove Flash Sale"
            >
              <PiLightningSlashFill
                size={18}
                className="wiggle text-yellow-400"
              />
            </button>
          )}

          {/* Edit Button Link */}
          <Link
            href={`/admin/course/${data._id}/edit`}
            className="group block"
            onClick={e => e.stopPropagation()}
            title="Edit"
          >
            <MdEdit
              size={18}
              className="wiggle"
            />
          </Link>

          {/* All Chapters Button Link */}
          <Link
            href={`/admin/chapter/${data._id}/all`}
            className="group block"
            onClick={e => e.stopPropagation()}
            title="View Chapters"
          >
            <FaEye
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
            disabled={loadingCourses.includes(data._id)}
            title="Delete"
          >
            {loadingCourses.includes(data._id) ? (
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
        title={`${confirmType.charAt(0).toUpperCase() + confirmType.slice(1)} Course`}
        content={`Are you sure that you want to ${confirmType} this course?`}
        onAccept={() =>
          confirmType === 'deactivate'
            ? handleActivateCourses([data._id], false)
            : confirmType === 'unbooted'
              ? handleBootCourses([data._id], false)
              : confirmType === 'Remove Flash Sale'
                ? handleRemoveApplyingFlashSales([data._id])
                : handleDeleteCourses([data._id])
        }
        isLoading={loadingCourses.includes(data._id)}
      />
    </>
  )
}

export default memo(CourseItem)
