import { IReport } from '@/models/ReportModel'
import Link from 'next/link'
import React, { memo, useState } from 'react'
import { FaEye, FaTrash } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface ReportItemProps {
  data: IReport
  loadingReports: string[]
  className?: string
  selectedReports: string[]
  setSelectedReports: React.Dispatch<React.SetStateAction<string[]>>
  handleDeleteReports: (ids: string[]) => void
}

function ReportItem({
  data,
  loadingReports,
  className = '',
  // selected
  selectedReports,
  setSelectedReports,
  // functions
  handleDeleteReports,
}: ReportItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`trans-200 flex cursor-pointer flex-col rounded-lg p-4 text-dark shadow-lg ${
          selectedReports.includes(data._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${className}`}
        key={data._id}
        onClick={() =>
          setSelectedReports(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        {/* Type */}
        <div className="mb-2">
          <p
            className="inline-block rounded-lg bg-primary px-2 py-1 font-body text-xs font-semibold tracking-wider shadow-lg"
            title=""
          >
            {data.type}
          </p>
        </div>

        {/* Content */}
        <p
          className="font-semibold"
          title=""
        >
          <span>Content:</span> <span className="text-slate-400">{data.content}</span>
        </p>

        {/* MARK: Action Buttons */}
        <div className="mt-2 flex gap-4 self-end rounded-lg border border-dark px-3 py-2">
          {/* Detail Button */}
          <Link
            href={data.link}
            className="group block"
            onClick={e => e.stopPropagation()}
            title="Detail"
          >
            <FaEye
              size={18}
              className="wiggle text-primary"
            />
          </Link>

          {/* Delete Button */}
          <button
            className="group block"
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingReports.includes(data._id)}
            title="Delete"
          >
            {loadingReports.includes(data._id) ? (
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
        title="Delete Report"
        content="Are you sure that you want to delete this Report?"
        onAccept={() => handleDeleteReports([data._id])}
        isLoading={loadingReports.includes(data._id)}
      />
    </>
  )
}

export default memo(ReportItem)
