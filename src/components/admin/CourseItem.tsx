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
        className={`relative flex justify-between items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer trans-200 ${
          selectedCourses.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedCourses(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        <div className='flex-grow'>
          {/* MARK: Thumbnails */}
          <Link
            href={`/${data.slug}`}
            prefetch={false}
            className='relative flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden mb-2'
            onClick={e => e.stopPropagation()}
            title={data._id}
          >
            <div className='flex items-center w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
              {data.images.map((src, index) => (
                <Image
                  key={index}
                  className='aspect-video flex-shrink-0 snap-start'
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
              className='absolute -top-1.5 left-1 text-yellow-400 animate-bounce'
              size={25}
            />
          )}

          {/* Title */}
          <p className='text-dark font-semibold tracking-wider mt-1' title={data.title}>
            {data.title}
          </p>

          {/* Category */}
          <p className='text-slate-500 text-sm font-semibold tracking-wider mb-1'>
            Category:{' '}
            <Link
              href={`/categories/${(data.category as ICategory)?.slug}`}
              className='text-sky-500 underline italic font-normal'
            >
              {(data.category as ICategory)?.slug}
            </Link>
          </p>

          {/* Text Hook */}
          {data.textHook && (
            <p
              className='text-sm text-dark border px-2 py-0.5 rounded-md font-body tracking-wider text-ellipsis line-clamp-2'
              title={data.textHook}
            >
              Hook: {data.textHook}
            </p>
          )}

          {/* Author */}
          <p className='text-slate-500 text-sm font-semibold tracking-wider'>
            Author: <span className='font-normal'>{data.author}</span>
          </p>

          {/* Price - Old Price */}
          <div className='flex items-center flex-wrap gap-2'>
            <p className='font-semibold text-xl text-primary'>{formatPrice(data.price)}</p>
            {data.oldPrice && (
              <p className='line-through text-slate-500 text-sm'>{formatPrice(data.oldPrice)}</p>
            )}
          </div>

          {/* Tags */}
          <p className='text-slate-500 text-sm'>
            <span className='font-semibold'>Tags: </span>
            {data.tags.map((tag: any, index) => (
              <span key={tag.slug} className='text-slate-400'>
                {tag.title}
                {index < data.tags.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          <p className='text-slate-500 text-sm'>
            <span className='font-semibold'>Languages: </span>
            {data?.languages?.map((language, index) => (
              <span className='text-slate-600' key={index}>
                {language}
                {index < data.languages.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* Joined & Likes */}
          <div className='flex items-center flex-wrap gap-3 text-slate-500 text-sm'>
            <div onDoubleClick={() => setEditingJoined(true)}>
              {!editingJoined ? (
                <>
                  <span className='font-semibold'>Joined: </span>
                  <span className='text-green-500'>{joined}</span>
                </>
              ) : (
                <input
                  type='number'
                  value={joined}
                  min={0}
                  onChange={e => setJoined(+e.target.value)}
                  onClick={e => e.stopPropagation()}
                  onBlur={() => handleUpdateProperties('joined')}
                  className='border rounded-lg shadow-lg max-w-[80px] px-2 py-1 outline-none mt-1'
                />
              )}
            </div>
            <div onDoubleClick={() => setEditingLikes(true)}>
              {!editingLikes ? (
                <>
                  <span className='font-semibold'>Likes: </span>
                  <span className='text-rose-500'>{likes}</span>
                </>
              ) : (
                <input
                  type='number'
                  value={likes}
                  min={0}
                  onChange={e => setLikes(+e.target.value)}
                  onClick={e => e.stopPropagation()}
                  onBlur={() => handleUpdateProperties('likes')}
                  className='border rounded-lg shadow-lg max-w-[80px] px-2 py-1 outline-none mt-1'
                />
              )}
            </div>
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-col border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Active Button */}
          <button
            className='block group'
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
            className='block group'
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
              className='block group'
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
                setConfirmType('Remove Flash Sale')
              }}
              disabled={loadingCourses.includes(data._id)}
              title='Remove Flash Sale'
            >
              <PiLightningSlashFill size={18} className='wiggle text-yellow-400' />
            </button>
          )}

          {/* Edit Button Link */}
          <Link
            href={`/admin/course/${data._id}/edit`}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='Edit'
          >
            <MdEdit size={18} className='wiggle' />
          </Link>

          {/* All Chapters Button Link */}
          <Link
            href={`/admin/chapter/${data._id}/all`}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='View Chapters'
          >
            <FaEye size={18} className='wiggle' />
          </Link>

          {/* Delete Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingCourses.includes(data._id)}
            title='Delete'
          >
            {loadingCourses.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaTrash size={18} className='wiggle' />
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
