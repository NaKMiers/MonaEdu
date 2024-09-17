import { IBlog } from '@/models/BlogModel'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useState } from 'react'
import { FaEye, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface BlogItemProps {
  data: IBlog
  loadingBlogs: string[]
  className?: string

  // selected
  selectedBlogs: string[]
  setSelectedBlogs: React.Dispatch<React.SetStateAction<string[]>>

  // functions
  handleDeleteBlogs: (ids: string[]) => void
}

function BlogItem({
  data,
  loadingBlogs,
  className = '',
  // selected
  selectedBlogs,
  setSelectedBlogs,
  // functions
  handleDeleteBlogs,
}: BlogItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'delete'>('delete')

  return (
    <>
      <div
        className={`relative flex justify-between items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer trans-200 ${
          selectedBlogs.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedBlogs(prev =>
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

          {/* Title */}
          <p className='text-dark font-semibold tracking-wider mt-1' title={data.title}>
            {data.title}
          </p>

          {/* Author */}
          <p className='text-slate-500 text-sm font-semibold tracking-wider'>
            Author: <span className='font-normal'>{data.author}</span>
          </p>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-col border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Edit Button Link */}
          <Link
            href={`/admin/blog/${data._id}/edit`}
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
            disabled={loadingBlogs.includes(data._id)}
            title='Delete'
          >
            {loadingBlogs.includes(data._id) ? (
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
        title={`${confirmType.charAt(0).toUpperCase() + confirmType.slice(1)} Blog`}
        content={`Are you sure that you want to ${confirmType} this blog?`}
        onAccept={() => handleDeleteBlogs([data._id])}
        isLoading={loadingBlogs.includes(data._id)}
      />
    </>
  )
}

export default memo(BlogItem)
