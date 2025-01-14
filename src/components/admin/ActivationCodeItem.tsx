import { IActivationCode } from '@/models/ActivationCodeModel'
import { formatTime } from '@/utils/time'
import Link from 'next/link'
import React, { memo, useState } from 'react'
import { FaCheck, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import useUtils from '@/libs/hooks/useUtils'
import Image from 'next/image'
import { IUser } from '@/models/UserModel'
import moment from 'moment-timezone'

interface ActivationCodeItemProps {
  data: IActivationCode
  loadingActivationCodes: string[]
  className?: string

  selectedActivationCodes: string[]
  setSelectedActivationCodes: React.Dispatch<React.SetStateAction<string[]>>

  handleActivateActivationCodes: (ids: string[], value: boolean) => void
  handleDeleteActivationCodes: (ids: string[]) => void
}

function ActivationCodeItem({
  data,
  loadingActivationCodes,
  className = '',
  // selected
  selectedActivationCodes,
  setSelectedActivationCodes,
  // functions
  handleActivateActivationCodes,
  handleDeleteActivationCodes,
}: ActivationCodeItemProps) {
  // hooks
  const { handleCopy } = useUtils()

  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`trans-200 relative flex cursor-pointer items-start justify-between gap-2 rounded-lg p-4 text-dark shadow-lg ${
          selectedActivationCodes.includes(data._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${className}`}
        onClick={() =>
          setSelectedActivationCodes(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        {/* MARK: Body */}
        <div>
          <div className="flex items-center gap-3">
            {/* Code */}
            <p
              className="font-semibold text-secondary"
              title="code"
              onClick={e => {
                e.stopPropagation()
                handleCopy(data.code)
              }}
            >
              {data.code}
            </p>

            {/* Times Left */}
            <p
              className="font-semibold text-slate-400"
              title="timesLeft"
              onClick={e => {
                e.stopPropagation()
                handleCopy(data.timesLeft.toString())
              }}
            >
              {data.timesLeft}
            </p>
          </div>

          {/* Begin */}
          <p
            className="text-sm"
            title="begin (d/m/y)"
          >
            <span className="font-semibold">Begin: </span>
            <span
              className={` ${moment(data.begin) > moment() ? 'text-yellow-500' : ''}`}
              onClick={e => {
                e.stopPropagation()
                handleCopy(formatTime(data.begin))
              }}
            >
              {formatTime(data.begin)}
            </span>
          </p>

          {/* Expire */}
          {data.expire && (
            <p
              className="text-sm"
              title="expire (d/m/y)"
            >
              <span className="font-semibold">Expire: </span>
              <span
                className={` ${moment(data.expire) < moment() ? 'text-rose-500' : ''}`}
                onClick={e => {
                  e.stopPropagation()
                  handleCopy(formatTime(data.expire))
                }}
              >
                {formatTime(data.expire)}
              </span>
            </p>
          )}

          {/* Used Users */}
          {!!data.usedUsers.length && (
            <p
              className="text-sm"
              title="usedUsers"
            >
              <span className="font-semibold">Used users: </span>
              {(data.usedUsers as IUser[]).map((user, index) => (
                <span
                  onClick={e => {
                    e.stopPropagation()
                    handleCopy(user.email)
                  }}
                  key={user.email}
                >
                  {user.email} {index < data.usedUsers.length - 1 && ', '}
                </span>
              ))}
            </p>
          )}

          <p className="mt-1 text-sm font-semibold text-dark">Courses: {data.courses.length}</p>
          <div className="flex max-h-[155px] flex-col gap-1 overflow-y-auto rounded-lg text-dark">
            {data.courses.map((course: any) => (
              <div
                className="trans-200 flex cursor-pointer items-start gap-4 rounded-lg border border-neutral-800 p-2 py-2"
                key={course._id}
              >
                <div className="relative aspect-video flex-shrink-0">
                  <Image
                    className="rounded-md shadow-lg"
                    src={course.images[0]}
                    width={55}
                    height={55}
                    alt={course.title}
                  />
                </div>

                <p className="trans-200 -mt-0.5 line-clamp-1 w-full text-ellipsis font-body text-sm leading-5 tracking-wide">
                  {course.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className="flex flex-col gap-4 rounded-lg border border-dark px-2 py-3">
          {/* Active Button */}
          <button
            className="group block"
            onClick={e => {
              e.stopPropagation()
              handleActivateActivationCodes([data._id], !data.active)
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
            href={`/admin/activation-code/${data.code}/edit`}
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
            disabled={loadingActivationCodes.includes(data._id)}
            title="Delete"
          >
            {loadingActivationCodes.includes(data._id) ? (
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
        title="Delete Activation Code"
        content="Are you sure that you want to delete these courses?"
        onAccept={() => handleDeleteActivationCodes([data._id])}
        isLoading={loadingActivationCodes.includes(data._id)}
      />
    </>
  )
}

export default memo(ActivationCodeItem)
