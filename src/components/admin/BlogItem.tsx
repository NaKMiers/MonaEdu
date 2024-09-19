import { IBlog } from '@/models/BlogModel'
import { IUser } from '@/models/UserModel'
import { updateBlogPropertyApi } from '@/requests'
import { getUserName } from '@/utils/string'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArchive, FaCloudUploadAlt, FaTrash } from 'react-icons/fa'
import { IoRocketSharp } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill, RiDraftLine } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface BlogItemProps {
  data: IBlog
  loadingBlogs: string[]
  className?: string

  // selected
  selectedBlogs: string[]
  setSelectedBlogs: React.Dispatch<React.SetStateAction<string[]>>

  // functions
  handleBootBlogs: (ids: string[], active: boolean) => void
  handleChangeBlogsStatus: (ids: string[], status: 'draft' | 'published' | 'archived') => void
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
  handleBootBlogs,
  handleChangeBlogsStatus,
  handleDeleteBlogs,
}: BlogItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'unbooted' | 'delete'>('delete')
  const [isOpenStatusOptions, setIsOpenStatusOptions] = useState<boolean>(false)

  // editable properties
  const [likes, setLikes] = useState<number>(data.likes.length)
  const [editingLikes, setEditingLikes] = useState<boolean>(false)

  // handle update properties
  const handleUpdateProperties = useCallback(
    async (property: string) => {
      try {
        const { updatedBlog, message } = await updateBlogPropertyApi(data._id, property, likes)

        // show success message
        toast.success(message)

        // update states
        setLikes(updatedBlog.likes.length)
        setEditingLikes(false)
      } catch (err: any) {
        console.error(err)
        toast.error(err.message)
      }
    },
    [data._id, likes]
  )

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
            href={`/blog/${data.slug}`}
            prefetch={false}
            className='relative flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden mb-2'
            onClick={e => e.stopPropagation()}
            title={data._id}
          >
            <div className='flex items-center w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
              {data.thumbnails.map((src, index) => (
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

          {/* Summary */}
          {data.summary && (
            <p
              className='text-sm text-dark border px-2 py-0.5 rounded-md font-body tracking-wider text-ellipsis line-clamp-2'
              title={data.summary}
            >
              Summary: {data.summary}
            </p>
          )}

          {/* Author */}
          <p className='text-slate-500 text-sm font-semibold tracking-wider'>
            Author: <span className='font-normal'>{getUserName(data.author as IUser)}</span>
          </p>

          {/* Tags */}
          <p className='text-slate-500 text-sm'>
            <span className='font-semibold'>Tags: </span>
            {data.tags.map((tag: any, index) => (
              <span key={tag.slug} className='text-slate-400'>
                {tag}
                {index < data.tags.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* Likes */}
          <div className='flex items-center flex-wrap gap-3 text-slate-500 text-sm'>
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
                handleBootBlogs([data._id], !data.booted)
              }
            }}
            disabled={loadingBlogs.includes(data._id)}
            title={data.booted ? 'Boot' : 'Unboot'}
          >
            <IoRocketSharp
              size={18}
              className={`wiggle ${data.booted ? 'text-green-500' : 'text-slate-300'}`}
            />
          </button>

          {/* Change Status Button */}
          <div className='relative'>
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                setIsOpenStatusOptions(prev => !prev)
              }}
              disabled={loadingBlogs.includes(data._id)}
              title='Change Status'
            >
              {data.status === 'published' ? (
                <FaCloudUploadAlt size={18} className='wiggle text-violet-500' />
              ) : data.status === 'draft' ? (
                <RiDraftLine size={18} className='wiggle text-slate-500 -ml-0.5' />
              ) : (
                <FaArchive size={17} className='wiggle text-blue-500' />
              )}
            </button>

            <AnimatePresence>
              {isOpenStatusOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, translateY: '-50%', originX: '100%' }}
                  animate={{ opacity: 1, scale: 1, translateY: '-50%', originX: '100%' }}
                  exit={{ opacity: 0, scale: 0.5, translateY: '-50%', originX: '100%' }}
                  className='flex items-center justify-between gap-4 absolute top-1/2 right-8 rounded-md shadow-lg px-3 py-2 bg-black'
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className='group'
                    title='Publish'
                    onClick={() => {
                      setIsOpenStatusOptions(false)
                      handleChangeBlogsStatus([data._id], 'published')
                    }}
                  >
                    <FaCloudUploadAlt size={18} className='wiggle text-violet-500' />
                  </button>
                  <button
                    className='group'
                    title='Draft'
                    onClick={() => {
                      setIsOpenStatusOptions(false)
                      handleChangeBlogsStatus([data._id], 'draft')
                    }}
                  >
                    <RiDraftLine size={18} className='wiggle text-slate-300 -ml-0.5' />
                  </button>
                  <button
                    className='group'
                    title='Archive'
                    onClick={() => {
                      setIsOpenStatusOptions(false)
                      handleChangeBlogsStatus([data._id], 'archived')
                    }}
                  >
                    <FaArchive size={17} className='wiggle text-blue-500' />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Edit Button Link */}
          <Link
            href={`/admin/blog/${data._id}/edit`}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='Edit'
          >
            <MdEdit size={18} className='wiggle' />
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
        onAccept={() =>
          confirmType === 'unbooted' ? handleBootBlogs([data._id], false) : handleDeleteBlogs([data._id])
        }
        isLoading={loadingBlogs.includes(data._id)}
      />
    </>
  )
}

export default memo(BlogItem)
