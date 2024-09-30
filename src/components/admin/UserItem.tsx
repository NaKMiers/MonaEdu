import { ICartItem } from '@/models/CartItemModel'
import { IUser } from '@/models/UserModel'
import {
  blockCommentApi,
  demoteCollaboratorApi,
  getCartApi,
  revokeCourseApi,
  setCollaboratorApi,
} from '@/requests'
import { formatPrice } from '@/utils/number'
import { getUserName } from '@/utils/string'
import { formatDate, formatTime } from '@/utils/time'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCartArrowDown, FaCommentSlash, FaEye, FaTrash } from 'react-icons/fa'
import { GrUpgrade } from 'react-icons/gr'
import { HiLightningBolt } from 'react-icons/hi'
import { RiCheckboxMultipleBlankLine, RiDonutChartFill } from 'react-icons/ri'
import { SiCoursera } from 'react-icons/si'
import Divider from '../Divider'
import Input from '../Input'
import LoadingButton from '../LoadingButton'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface UserItemProps {
  data: IUser
  loadingUsers: string[]
  className?: string

  selectedUsers: string[]
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>

  handleDeleteUsers: (ids: string[]) => void
}

function UserItem({
  data,
  loadingUsers,
  className = '',
  // selected
  selectedUsers,
  setSelectedUsers,
  // functions
  handleDeleteUsers,
}: UserItemProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [userData, setUserData] = useState<IUser>(data)
  const [userCart, setUserCart] = useState<ICartItem[]>([])

  // open states
  const [isOpenSetCollaborator, setIsOpenSetCollaborator] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [isOpenBlockCommentConfirmationDialog, setIsOpenBlockCommentConfirmationDialog] =
    useState<boolean>(false)
  const [isOpenDemoteCollboratorConfirmationDialog, setIsOpenDemoteCollboratorConfirmationDialog] =
    useState<boolean>(false)
  const [isOpenCartList, setIsOpenCartList] = useState<boolean>(false)
  const [isOpenUserProgresses, setIsOpenUserProgresses] = useState<boolean>(false)
  const [isOpenOptions, setIsOpenOptions] = useState<boolean>(false)

  // loading states
  const [isLoadingSetCollaborator, setIsLoadingSetCollaborator] = useState<boolean>(false)
  const [isDemoting, setIsDemoting] = useState<boolean>(false)
  const [isBlockingComment, setIsBlockingComment] = useState<boolean>(false)
  const [isRevokingCourse, setIsRevokingCourse] = useState<boolean>(false)

  // values
  const isCurUser = data._id === curUser?._id

  console.log('data:', data)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      type: 'percentage',
      ['value-' + data._id]: '10%',
    },
  })

  // MARK: Validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    formData => {
      let isValid = true

      // if type if percentage, value must have '%' at the end
      if (formData.type === 'percentage' && !formData['value-' + data._id].endsWith('%')) {
        setError('value-' + data._id, { type: 'manual', message: 'Value must have %' })
        isValid = false
      }

      // if type if percentage, value have '%' at the end and must be number
      if (formData.type === 'percentage' && isNaN(Number(formData['value-' + data._id].slice(0, -1)))) {
        setError('value-' + data._id, { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if type if fixed-reduce, value must be number
      if (formData.type !== 'percentage' && isNaN(Number(formData['value-' + data._id]))) {
        setError('value-' + data._id, { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      return isValid
    },
    [setError, data._id]
  )

  // MARK: Submit collaborator form
  const onSetCollaboratorSubmit: SubmitHandler<FieldValues> = async formData => {
    // validate form
    if (!handleValidate(formData)) return

    setIsLoadingSetCollaborator(true)

    try {
      // send request to server
      const { user, message } = await setCollaboratorApi(
        userData._id,
        formData.type,
        formData['value-' + data._id]
      )

      // update user data
      setUserData(user)

      // show success message
      toast.success(message)

      // reset
      reset()
      setIsOpenSetCollaborator(false)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setIsLoadingSetCollaborator(false)
    }
  }

  // MARK: Handle demote collaborator
  const handleDemoteCollaborator = useCallback(async () => {
    setIsDemoting(true)

    try {
      // send request to server
      const { user, message } = await demoteCollaboratorApi(data._id)

      // update user data
      setUserData(user)

      // show success message
      toast.success(message)

      // reset
      reset()
      setIsOpenSetCollaborator(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsDemoting(false)
    }
  }, [data._id, reset])

  // MARK: handle block / unblock comment
  const handleBlockComment = useCallback(async () => {
    // start loading
    setIsBlockingComment(true)

    try {
      // send request to server
      const { updatedUser, message } = await blockCommentApi(
        data._id,
        !userData.blockStatuses.blockedComment
      )

      // update user data
      setUserData(updatedUser)

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsBlockingComment(false)
    }
  }, [data._id, userData.blockStatuses.blockedComment])

  // MARK: handle get user cart
  const handleGetUserCart = useCallback(async () => {
    try {
      // send request to get user's cart
      const { cart } = await getCartApi(`?userId=${data._id}`) // cache: no-store

      // set cart states
      setUserCart(cart)

      // open cart list modal
      setIsOpenCartList(true)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [data])

  // MARK: handle revoke user course
  const handleRevokeCourse = useCallback(
    async (courseId: string) => {
      console.log('Revoke Course:', courseId)

      // start loading
      setIsRevokingCourse(true)

      try {
        // send request to revoke course
        const { updatedUser, message } = await revokeCourseApi(data._id, courseId)

        // show success message
        toast.success(message)

        // update user data
        setUserData(updatedUser)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setIsRevokingCourse(false)
      }
    },
    [data._id]
  )

  return (
    <>
      <div
        className={`trans-200 relative flex select-none items-start justify-between gap-2 rounded-lg p-4 text-dark shadow-lg ${
          selectedUsers.includes(userData._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${!isCurUser ? 'cursor-pointer' : ''} ${className}`}
        onClick={() =>
          !isCurUser &&
          setSelectedUsers(prev =>
            prev.includes(userData._id)
              ? prev.filter(id => id !== userData._id)
              : [...prev, userData._id]
          )
        }
      >
        {/* MARK: Body */}
        <div className="w-full">
          {/* Avatar */}
          <Link
            href={`/user/${userData.username || userData.email}`}
            className="float-start mr-3 block overflow-hidden rounded-md"
            onClick={e => e.stopPropagation()}
          >
            <Image
              className="aspect-square"
              src={userData.avatar}
              height={65}
              width={65}
              alt="avatar"
              title={userData._id}
            />
          </Link>

          {/* Role */}
          <div className="absolute -left-2 -top-2 z-30 select-none rounded-lg bg-secondary px-2 py-[2px] font-body text-xs text-yellow-300 shadow-md">
            {userData.role}
          </div>

          {/* Email */}
          <p
            className="line-clamp-1 block text-ellipsis font-body text-[18px] font-semibold tracking-wide text-secondary"
            title={userData.email}
          >
            {userData.email}
          </p>

          {/* Expended */}
          <div className="flex items-center gap-2 text-sm">
            <p>
              <span className="font-semibold">Expended: </span>
              <span className="text-green-500">{formatPrice(userData.expended)}</span>
            </p>
          </div>

          {/* Username */}
          {userData.username && (
            <p className="text-sm">
              <span className="font-semibold">Username: </span>
              <span>{userData.username}</span>
            </p>
          )}

          {/* Nickname */}
          {userData.nickname && (
            <p className="text-sm">
              <span className="font-semibold">Nickname: </span>
              <span>{userData.nickname}</span>
            </p>
          )}

          {/* First Name + Last Name: Full Name */}
          {(userData.firstName || userData.lastName) && (
            <p className="text-sm">
              <span className="font-semibold">Fullname: </span>
              <span>{userData.firstName + ' ' + userData.lastName}</span>
            </p>
          )}

          {/* Birthday */}
          {userData.birthday && (
            <p className="text-sm">
              <span className="font-semibold">Birthday: </span>
              <span>{formatDate(userData.birthday)}</span>
            </p>
          )}

          {/* Phone */}
          {userData.phone && (
            <p className="text-sm">
              <span className="font-semibold">Phone: </span>
              <span>{userData.phone}</span>
            </p>
          )}

          {/* Address */}
          {userData.address && (
            <p className="text-sm">
              <span className="font-semibold">Address: </span>
              <span>{userData.address}</span>
            </p>
          )}

          {/* Job */}
          {userData.job && (
            <p className="text-sm">
              <span className="font-semibold">Job: </span>
              <span>{userData.job}</span>
            </p>
          )}

          {/* Created At */}
          <p className="text-sm">
            <span className="font-semibold">Created At: </span>
            <span
              className={`${
                +new Date() - +new Date(data.createdAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
              }`}
            >
              {formatTime(userData.createdAt)}
            </span>
          </p>

          {/* Updated At */}
          <p className="text-sm">
            <span className="font-semibold">Updated At: </span>
            <span
              className={`${
                +new Date() - +new Date(data.updatedAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
              }`}
            >
              {formatTime(userData.updatedAt)}
            </span>
          </p>
        </div>

        {/* MARK: Set Collaborator Modal */}
        {isOpenSetCollaborator && (
          <div
            className="absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center gap-2 rounded-md bg-yellow-400 bg-opacity-80 p-21"
            onClick={e => {
              e.stopPropagation()
              setIsOpenSetCollaborator(false)
            }}
          >
            {/* Type */}
            <Input
              id="type"
              label="Type"
              disabled={isLoadingSetCollaborator}
              register={register}
              errors={errors}
              icon={RiCheckboxMultipleBlankLine}
              type="select"
              className="w-full"
              onClick={e => e.stopPropagation()}
              onFocus={() => clearErrors('type')}
              options={[
                {
                  value: 'percentage',
                  label: 'Percentage',
                },
                {
                  value: 'fixed',
                  label: 'Fixed',
                },
              ]}
            />
            <div className="flex w-full items-center gap-2">
              <Input
                id={'value-' + data._id}
                label="Commission"
                disabled={isLoadingSetCollaborator}
                register={register}
                errors={errors}
                required
                type="text"
                icon={HiLightningBolt}
                className="w-full shadow-lg"
                onClick={e => e.stopPropagation()}
                onFocus={() => clearErrors('value-' + data._id)}
              />
              <LoadingButton
                className="trans-200 flex h-[46px] items-center justify-center rounded-lg bg-secondary px-4 font-semibold text-light shadow-lg hover:bg-primary"
                text="Set"
                onClick={e => {
                  e.stopPropagation()
                  handleSubmit(onSetCollaboratorSubmit)(e)
                }}
                isLoading={isLoadingSetCollaborator}
              />
            </div>
          </div>
        )}

        {/* MARK: Action Buttons*/}
        <div className="flex flex-col gap-4 rounded-lg border border-dark px-2 py-3 text-dark">
          {/* Promote User Button */}
          {!isCurUser && (
            <button
              className="group block"
              onClick={e => {
                e.stopPropagation()
                userData.role === 'collaborator'
                  ? setIsOpenDemoteCollboratorConfirmationDialog(true)
                  : setIsOpenSetCollaborator(true)
              }}
              disabled={loadingUsers.includes(userData._id) || isDemoting}
              title={userData.role === 'collaborator' ? 'Demote' : 'Promote'}
            >
              {loadingUsers.includes(userData._id) ? (
                <RiDonutChartFill
                  size={18}
                  className="animate-spin text-slate-300"
                />
              ) : (
                <GrUpgrade
                  size={18}
                  className={`wiggle ${userData.role === 'collaborator' ? 'rotate-180 text-red-500' : ''}`}
                />
              )}
            </button>
          )}

          {/* Block Comment Button */}
          {!isCurUser && (
            <button
              className="group block"
              onClick={e => {
                e.stopPropagation()
                setIsOpenBlockCommentConfirmationDialog(true)
              }}
              disabled={loadingUsers.includes(userData._id) || isBlockingComment || isDemoting}
              title="Block Comment"
            >
              {isBlockingComment ? (
                <RiDonutChartFill
                  size={18}
                  className="animate-spin text-slate-300"
                />
              ) : (
                <FaCommentSlash
                  size={18}
                  className={`wiggle ${
                    userData.blockStatuses.blockedComment ? 'text-rose-500' : 'text-green-500'
                  }`}
                />
              )}
            </button>
          )}

          {/* Delete Button */}
          {!isCurUser && (
            <button
              className="group block"
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
              }}
              disabled={loadingUsers.includes(userData._id) || isBlockingComment || isDemoting}
              title="Delete"
            >
              {loadingUsers.includes(userData._id) ? (
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
          )}

          {/* Change Status Button */}
          <div className="relative">
            <button
              className="group block"
              onClick={e => {
                e.stopPropagation()
                setIsOpenOptions(prev => !prev)
              }}
              disabled={false}
              title="Change Status"
            >
              <FaEye
                size={18}
                className="wiggle text-violet-500"
              />
            </button>

            <AnimatePresence>
              {isOpenOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, translateY: '-50%', originX: '100%' }}
                  animate={{ opacity: 1, scale: 1, translateY: '-50%', originX: '100%' }}
                  exit={{ opacity: 0, scale: 0.5, translateY: '-50%', originX: '100%' }}
                  className="absolute right-8 top-1/2 flex items-center justify-between gap-4 rounded-md bg-black px-3 py-2 shadow-lg"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="group"
                    title="Publish"
                    onClick={() => {
                      setIsOpenOptions(false)
                      handleGetUserCart()
                    }}
                  >
                    <FaCartArrowDown
                      size={18}
                      className="wiggle text-yellow-500"
                    />
                  </button>
                  <button
                    className="group"
                    title="Draft"
                    onClick={() => {
                      setIsOpenOptions(false)
                      setIsOpenUserProgresses(true)
                    }}
                  >
                    <SiCoursera
                      size={18}
                      className="wiggle text-orange-500"
                    />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* List Cart Modal */}
      <AnimatePresence>
        {isOpenCartList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 top-0 z-40 flex items-center justify-center bg-black bg-opacity-50 text-dark ${className}`}
            onClick={() => setIsOpenCartList(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="max-h-[500px] w-full max-w-[500px] overflow-y-auto rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <h1 className="font-semibold">{getUserName(data)}&apos;s Cart</h1>
              <Divider
                border
                size={4}
              />

              {userCart.length > 0 ? (
                <div className="flex flex-col gap-1 font-body text-sm tracking-wider">
                  {userCart.map((item: any, index) => (
                    <Link
                      href={`/${item.courseId.slug}`}
                      className="trans-200 flex items-start gap-2 hover:text-sky-500 hover:underline"
                      key={item._id}
                    >
                      <span className="border-dark-100 min-w-6 rounded-full border px-0.5 text-center text-[10px]">
                        {index + 1}
                      </span>
                      <span>{item.courseId.title}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-slate-400">User cart is empty.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Courses Progresses */}
      <AnimatePresence>
        {isOpenUserProgresses && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 top-0 z-40 flex items-center justify-center bg-black bg-opacity-50 text-dark ${className}`}
            onClick={() => setIsOpenUserProgresses(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="max-h-[500px] w-full max-w-[500px] overflow-y-auto rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <h1 className="font-semibold">{getUserName(data)}&apos;s Courses&apos;s Progresses</h1>
              <Divider
                border
                size={4}
              />

              {data.courses.length > 0 ? (
                <div className="flex flex-col gap-1 font-body text-sm tracking-wider">
                  {data.courses.map((item: any, index) => (
                    <div
                      className="flex items-center gap-2"
                      key={item.course}
                    >
                      <Link
                        href={`/${item.course.slug}`}
                        className="trans-200 flex w-full items-center gap-2 hover:text-sky-500"
                      >
                        <span className="border-dark-100 min-w-6 rounded-full border px-0.5 text-center text-[10px]">
                          {index + 1}
                        </span>
                        <span>{item.course.title}</span> -{' '}
                        <span className="font-semibold text-orange-500">{item.progress}%</span>
                      </Link>
                      <button
                        className={`trans-200 flex min-h-5 min-w-8 items-center justify-center rounded-md border border-rose-400 px-1.5 text-[10px] text-rose-400 !no-underline shadow-lg hover:bg-red-400 hover:text-light ${isRevokingCourse ? 'pointer-events-none flex justify-center' : ''} ${className}`}
                        disabled={isRevokingCourse}
                        onClick={() => handleRevokeCourse(item.course._id)}
                      >
                        {isRevokingCourse ? (
                          <RiDonutChartFill
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          'Revoke'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-slate-400">User courses is empty.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete User"
        content="Are you sure that you want to delete this user?"
        onAccept={() => handleDeleteUsers([data._id])}
        isLoading={loadingUsers.includes(data._id)}
      />

      {/* Confirm Block Comment Dialog */}
      <ConfirmDialog
        open={isOpenBlockCommentConfirmationDialog}
        setOpen={setIsOpenBlockCommentConfirmationDialog}
        title="Block Comment"
        content="Are you sure that you want to block comment this user?"
        onAccept={handleBlockComment}
        isLoading={isBlockingComment}
      />

      {/* Confirm Demote Collaborator Dialog */}
      <ConfirmDialog
        open={isOpenDemoteCollboratorConfirmationDialog}
        setOpen={setIsOpenDemoteCollboratorConfirmationDialog}
        title="Demote Collaborator"
        content="Are you sure that you want to  this collaborator?"
        onAccept={handleDemoteCollaborator}
        isLoading={isDemoting}
      />
    </>
  )
}

export default memo(UserItem)
