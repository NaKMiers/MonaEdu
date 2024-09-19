import { IChapter } from '@/models/ChapterModel'
import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaLock, FaLockOpen, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface LessonItemProps {
  data: ILesson
  loadingLessons: string[]
  className?: string

  selectedLessons: string[]
  setSelectedLessons: React.Dispatch<React.SetStateAction<string[]>>

  handleActivateLessons: (ids: string[], value: boolean) => void
  handleChangeLessonStatus: (ids: string[], status: 'public' | 'private') => void
  handleDeleteLessons: (ids: string[]) => void
}

function LessonItem({
  data,
  loadingLessons,
  className = '',
  // selected
  selectedLessons,
  setSelectedLessons,
  // functions
  handleActivateLessons,
  handleChangeLessonStatus,
  handleDeleteLessons,
}: LessonItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [isOpenStatusConfirmModal, setIsOpenStatusConfirmModal] = useState<boolean>(false)

  // handle copy
  const handleCopy = useCallback((text: string = '') => {
    navigator.clipboard.writeText(text)
    toast.success('Copied: ' + text)
  }, [])

  return (
    <>
      <div
        className={`relative text-dark w-full flex items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer trans-200 ${
          selectedLessons.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedLessons(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        {/* MARK: Thumbnails */}
        <Link
          href={`/${(data.courseId as ICourse).slug || ''}`}
          prefetch={false}
          onClick={e => e.stopPropagation()}
          title={(data.courseId as ICourse).title}
          className='absolute -top-2.5 -left-2 border-2 border-secondary flex items-center max-w-[60px] rounded-md shadow-md overflow-hidden mb-2'
        >
          <div className='flex items-center w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
            <Image
              className='aspect-video flex-shrink-0 snap-start object-cover w-full h-full'
              src={(data.courseId as ICourse).images[0] || '/images/not-found.jpg'}
              height={60}
              width={60}
              alt={(data.courseId as ICourse).title}
            />
          </div>
        </Link>

        <div className='flex flex-wrap flex-1 gap-x-21 items-start'>
          <div className='flex items-center max-w-[120px] sm:max-w-[250px] rounded-lg shadow-md overflow-hidden mb-2'>
            {data.sourceType === 'file' ? (
              <video
                className='aspect-video flex-shrink-0 snap-start object-cover w-full h-full'
                src={data.source}
                height={250}
                width={250}
                controls
              />
            ) : (
              <iframe
                className='aspect-video rounded-lg w-full h-full object-contain'
                width='1519'
                height='574'
                src={data.source}
                title='Is Civilization on the Brink of Collapse?'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            )}
          </div>

          {/* Title */}
          <div className='flex flex-col'>
            <p
              className='flex items-center gap-2 font-semibold font-body tracking-wide'
              onClick={e => e.stopPropagation()}
            >
              <span className='cursor-copy hover:opacity-75' onClick={() => handleCopy(data.title)}>
                {data.title}
              </span>{' '}
              <span
                className={`p-1.5 border-2 rounded-full ${
                  data.status === 'public'
                    ? 'border-primary hover:bg-primary text-primary hover:text-dark'
                    : 'border-dark hover:bg-dark-0 text-dark hover:text-light'
                } trans-200 group`}
                onClick={() => setIsOpenStatusConfirmModal(true)}
              >
                {data.status === 'public' ? (
                  <FaLockOpen size={14} className='trans-200' />
                ) : (
                  <FaLock size={14} className='trans-200' />
                )}
              </span>
            </p>

            {/* Duration */}
            <p className='font-semibold font-body tracking-wide'>
              <span>Duration: </span>
              <span className='text-sky-500'>
                {Math.floor(data.duration / 3600)}h:{Math.floor((data.duration % 3600) / 60)}m:
                {(data.duration % 3600) % 60}s
              </span>
            </p>

            {/* Likes */}
            <p className='font-semibold font-body tracking-wide'>
              <span>Likes: </span>
              <span className='text-rose-500'>{data.likes.length}</span>
            </p>

            {/* Source Type */}
            <p className='font-semibold font-body tracking-wide'>
              <span>Source Type: </span>
              <span className='text-slate-500 text-sm font-normal'>{data.sourceType}</span>
            </p>

            {/* Slug */}
            <p className='font-semibold font-body tracking-wide'>
              <span>Slug: </span>
              <span className='text-slate-500 text-sm font-normal'>{data.slug}</span>
            </p>

            {/* Docs */}
            {!!data?.docs?.length && (
              <p className='font-semibold font-body tracking-wide'>
                <span>Docs: </span>
                <span className='text-slate-500 text-sm font-normal'>({data.docs.length})</span>
              </p>
            )}
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-col flex-shrink-0 border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Active Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleActivateLessons([data._id], !data.active)
            }}
            title={data.active ? 'Deactivate' : 'Activate'}
          >
            <FaCheck
              size={18}
              className={`wiggle ${data.active ? 'text-green-500' : 'text-slate-300'}`}
            />
          </button>

          {/* Edit Button Link */}
          <Link
            href={`/admin/lesson/${(data.chapterId as IChapter)._id}/${data._id}/edit`}
            className='block group'
            title='Edit'
            onClick={e => e.stopPropagation()}
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
            disabled={loadingLessons.includes(data._id)}
            title='Delete'
          >
            {loadingLessons.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaTrash size={18} className='wiggle' />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Lesson'
        content='Are you sure that you want to delete this lesson?'
        onAccept={() => handleDeleteLessons([data._id])}
        isLoading={loadingLessons.includes(data._id)}
      />

      {/* Confirm Status Dialog */}
      <ConfirmDialog
        open={isOpenStatusConfirmModal}
        setOpen={setIsOpenStatusConfirmModal}
        title='Change Lesson Status'
        content='Are you sure that you want to change this lesson status?'
        onAccept={() =>
          handleChangeLessonStatus([data._id], data.status === 'public' ? 'private' : 'public')
        }
        color='primary'
        isLoading={loadingLessons.includes(data._id)}
      />
    </>
  )
}

export default memo(LessonItem)
