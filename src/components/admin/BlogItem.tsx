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
        className={`trans-200 relative flex cursor-pointer items-start justify-between gap-2 rounded-lg p-4 shadow-lg ${
          selectedBlogs.includes(data._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${className}`}
        onClick={() =>
          setSelectedBlogs(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        <div className="flex-grow">
          {/* MARK: Thumbnails */}
          <Link
            href={`/blog/${data.slug}`}
            prefetch={false}
            className="relative mb-2 flex max-w-[160px] items-center overflow-hidden rounded-lg shadow-md"
            onClick={e => e.stopPropagation()}
            title={data._id}
          >
            <div className="no-scrollbar flex w-full snap-x snap-mandatory items-center overflow-x-scroll">
              {data.thumbnails.map((src, index) => (
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

          {/* Title */}
          <p
            className="mt-1 font-semibold tracking-wider text-dark"
            title={data.title}
          >
            {data.title}
          </p>

          {/* Summary */}
          {data.summary && (
            <p
              className="line-clamp-2 text-ellipsis rounded-md border px-2 py-0.5 font-body text-sm tracking-wider text-dark"
              title={data.summary}
            >
              Summary: {data.summary}
            </p>
          )}

          {/* Author */}
          <p className="text-sm font-semibold tracking-wider text-slate-500">
            Author: <span className="font-normal">{getUserName(data.author as IUser)}</span>
          </p>

          {/* Tags */}
          <p className="text-sm text-slate-500">
            <span className="font-semibold">Tags: </span>
            {data.tags.map((tag: any, index) => (
              <span
                key={tag.slug}
                className="text-slate-400"
              >
                {tag}
                {index < data.tags.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* Likes */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <div onDoubleClick={() => setEditingLikes(true)}>
              {!editingLikes ? (
                <>
                  <span className="font-semibold">Likes: </span>
                  <span className="text-rose-500">{likes}</span>
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
        </div>

        {/* MARK: Action Buttons */}
        <div className="flex flex-col gap-4 rounded-lg border border-dark px-2 py-3 text-dark">
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
          <div className="relative">
            <button
              className="group block"
              onClick={e => {
                e.stopPropagation()
                setIsOpenStatusOptions(prev => !prev)
              }}
              disabled={loadingBlogs.includes(data._id)}
              title="Change Status"
            >
              {data.status === 'published' ? (
                <FaCloudUploadAlt
                  size={18}
                  className="wiggle text-violet-500"
                />
              ) : data.status === 'draft' ? (
                <RiDraftLine
                  size={18}
                  className="wiggle -ml-0.5 text-slate-500"
                />
              ) : (
                <FaArchive
                  size={17}
                  className="wiggle text-blue-500"
                />
              )}
            </button>

            <AnimatePresence>
              {isOpenStatusOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, translateY: '-50%', originX: '100%' }}
                  animate={{ opacity: 1, scale: 1, translateY: '-50%', originX: '100%' }}
                  exit={{ opacity: 0, scale: 0.5, translateY: '-50%', originX: '100%' }}
                  className="absolute right-8 top-1/2 flex items-center justify-between gap-4 rounded-md bg-black px-3 py-2 shadow-lg"
                  onClick={e => e.stopPropagation()}
                >
                  {data.status !== 'published' && (
                    <button
                      className="group"
                      title="Publish"
                      onClick={() => {
                        setIsOpenStatusOptions(false)
                        handleChangeBlogsStatus([data._id], 'published')
                      }}
                    >
                      <FaCloudUploadAlt
                        size={18}
                        className="wiggle text-violet-500"
                      />
                    </button>
                  )}
                  {data.status !== 'draft' && (
                    <button
                      className="group"
                      title="Draft"
                      onClick={() => {
                        setIsOpenStatusOptions(false)
                        handleChangeBlogsStatus([data._id], 'draft')
                      }}
                    >
                      <RiDraftLine
                        size={18}
                        className="wiggle -ml-0.5 text-slate-300"
                      />
                    </button>
                  )}
                  {data.status !== 'archived' && (
                    <button
                      className="group"
                      title="Archive"
                      onClick={() => {
                        setIsOpenStatusOptions(false)
                        handleChangeBlogsStatus([data._id], 'archived')
                      }}
                    >
                      <FaArchive
                        size={17}
                        className="wiggle text-blue-500"
                      />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Edit Button Link */}
          <Link
            href={`/admin/blog/${data._id}/edit`}
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
            disabled={loadingBlogs.includes(data._id)}
            title="Delete"
          >
            {loadingBlogs.includes(data._id) ? (
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
