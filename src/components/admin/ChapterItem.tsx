import { EditingValues } from '@/app/(admin)/admin/chapter/[courseId]/all/page'
import { IChapter } from '@/models/ChapterModel'
import Link from 'next/link'
import React, { memo, useState } from 'react'
import { FaEye, FaPlusCircle, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface ChapterItemProps {
  data: IChapter
  loadingChapters: string[]
  className?: string

  selectedChapters: string[]
  setSelectedChapters: React.Dispatch<React.SetStateAction<string[]>>
  setEditingValues: React.Dispatch<React.SetStateAction<EditingValues | null>>

  handleDeleteChapters: (ids: string[]) => void
}

function ChapterItem({
  data,
  loadingChapters,
  className = '',
  // selected
  selectedChapters,
  setSelectedChapters,
  setEditingValues,
  // functions
  handleDeleteChapters,
}: ChapterItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`trans-200 relative flex cursor-pointer rounded-lg px-4 py-2 text-dark shadow-lg ${
          selectedChapters.includes(data._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${className}`}
        key={data._id}
        onClick={() =>
          setSelectedChapters(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        <div className="flex flex-1 items-center gap-3">
          {/* Chapter Title */}
          <p className="font-semibold">{data.title}</p>

          {/* Order */}
          <p
            className="absolute left-2 top-0 min-w-6 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-center text-xs font-semibold"
            title={`Order: ${data.order}`}
          >
            {data.order}:{' '}
            <span className="font-semibold text-sky-500">
              {data.lessonQuantity} lesson{data.lessonQuantity != 1 ? 's' : ''}
            </span>
          </p>
        </div>

        {/* MARK: Action Buttons */}
        <div className="flex gap-4 self-end rounded-lg border border-dark px-3 py-2">
          {/* View Lessons */}
          <Link
            href={`/admin/lesson/${data._id}/all`}
            className="group block"
            onClick={e => e.stopPropagation()}
            title="View Lessons"
          >
            <FaEye
              size={18}
              className="wiggle"
            />
          </Link>

          {/* Add Lesson */}
          <Link
            href={`/admin/lesson/${data._id}/add`}
            className="group block"
            onClick={e => e.stopPropagation()}
            title="Add Lesson"
          >
            <FaPlusCircle
              size={18}
              className="wiggle"
            />
          </Link>

          {/* Edit Button */}
          <button
            className="group block"
            title="Edit"
            onClick={e => {
              e.stopPropagation()

              setEditingValues({
                _id: data._id,
                title: data.title,
                content: data.content,
                order: data.order,
              })
            }}
          >
            <MdEdit
              size={18}
              className="wiggle"
            />
          </button>

          {/* Delete Button */}
          <button
            className="group block"
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingChapters.includes(data._id)}
            title="Delete"
          >
            {loadingChapters.includes(data._id) ? (
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
        title="Delete Chapter"
        content="Are you sure that you want to delete this category?"
        onAccept={() => handleDeleteChapters([data._id])}
        isLoading={loadingChapters.includes(data._id)}
      />
    </>
  )
}

export default memo(ChapterItem)
