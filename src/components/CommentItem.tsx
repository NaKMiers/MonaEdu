import { reportContents } from '@/constants'
import { IComment } from '@/models/CommentModel'
import { addReportApi } from '@/requests'
import { hideCommentApi, likeCommentApi, replyCommentApi } from '@/requests/commentRequest'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash, FaHeart, FaRegHeart, FaSortDown } from 'react-icons/fa'
import { HiDotsHorizontal } from 'react-icons/hi'
import { format, register as timeAgoRegister } from 'timeago.js'
import vi from 'timeago.js/lib/lang/vi'
import LoadingButton from './LoadingButton'
import ReportDialog from './dialogs/ReportDigalog'

interface CommentItemProps {
  comment: IComment
  setCmts: React.Dispatch<React.SetStateAction<IComment[]>>
  className?: string
}

function CommentItem({ comment, setCmts, className = '' }: CommentItemProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showActions, setShowActions] = useState<boolean>(false)

  // report states
  const [isOpenReportDialog, setIsOpenReportDialog] = useState<boolean>(false)
  const [selectedContent, setSelectedContent] = useState<string>('')

  // values
  const user = comment.user
  const isShowCrown =
    user?.package && (user.package.expire === null || new Date(user.package.expire) > new Date())
  timeAgoRegister('vi', vi)

  // form
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      comment: '',
    },
  })

  // MARK: Handlers
  // reply comment
  const replyComment: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // check login
      if (!curUser) return toast.error('Bạn cần đăng nhập để thực hiện chức năng này')

      // check if comment is valid
      if (comment._id && curUser?._id) {
        setIsLoading(true)

        try {
          // send request to add comment
          const { newComment, parentComment } = await replyCommentApi(comment._id, data.comment)
          newComment.user = curUser

          // add new comment to list
          setCmts(prev =>
            prev.map(comment =>
              comment._id === parentComment._id
                ? {
                    ...comment,
                    replied: [newComment, ...comment.replied],
                  }
                : comment
            )
          )

          // reset form
          reset()
        } catch (err: any) {
          toast.error(err.message)
          console.log(err)
        } finally {
          // reset loading state
          setIsLoading(false)
        }
      }
    },
    [comment._id, setCmts, curUser, reset]
  )

  // handle report comment
  const handleReport = useCallback(async () => {
    // check if content is selected or not
    if (!selectedContent) {
      toast.error('Please select a content to report')
      return
    }

    try {
      const { message } = await addReportApi({
        type: 'comment',
        content: selectedContent,
        link: `/comment/${comment._id}`,
      })

      // show success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [comment._id, selectedContent])

  // like / unlike comment
  const likeComment = useCallback(
    async (value: 'y' | 'n') => {
      try {
        // send request to like / dislike comment
        const { comment: cmt } = await likeCommentApi(comment._id, value)

        // like / dislike comment / replied comment
        if (!cmt.lessonId) {
          // replied comment

          setCmts(prev =>
            prev.map(c =>
              c.replied.map((reply: any) => reply._id).includes(cmt._id)
                ? {
                    ...c,
                    replied: c.replied.map((reply: any) => (reply._id === cmt._id ? cmt : reply)),
                  }
                : c
            )
          )
        } else {
          // normal comment
          setCmts(prev => prev.map(comment => (comment._id === cmt._id ? cmt : comment)))
        }
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      }
    },
    [comment._id, setCmts]
  )

  // hide / show comment
  const hideComment = useCallback(
    async (id: string, value: 'y' | 'n') => {
      try {
        // send request to hide / show comment
        const { comment: cmt } = await hideCommentApi(id, value)

        // hide / show comment / replied comment
        if (!cmt.lessonId) {
          // replied comment

          setCmts(prev =>
            prev.map(c => {
              return c.replied.map((reply: any) => reply._id).includes(cmt._id)
                ? {
                    ...c,
                    replied: c.replied.map((reply: any) => (reply._id === cmt._id ? cmt : reply)),
                  }
                : c
            })
          )
        } else {
          // normal comment
          setCmts(prev => prev.map(comment => (comment._id === cmt._id ? cmt : comment)))
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [setCmts]
  )

  return (
    <div className={`w-full flex items-start gap-3 ${className}`}>
      {/* Avatar */}
      <Link className='relative' href={`/user/${curUser?.username || curUser?.email}`}>
        {isShowCrown && (
          <Image
            className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square rounded-full overflow-hidden'
            src='/icons/ring-circle.png'
            width={40}
            height={40}
            alt='ring'
          />
        )}
        <Image
          className={`relative z-10 aspect-square rounded-full shadow-lg ${isShowCrown ? 'p-1' : ''}`}
          src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
          width={40}
          height={40}
          alt='avatar'
        />
        {isShowCrown && (
          <Image
            className='absolute z-20 -top-[11px] right-[3px] rotate-[18deg]'
            src='/icons/crown-icon-2.png'
            width={24}
            height={24}
            alt='crown'
          />
        )}
      </Link>

      <div className='w-full'>
        {/* MARK: Headline */}
        <div className='flex flex-wrap items-center gap-x-2'>
          <span className='font-semibold'>
            {user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.username}
          </span>{' '}
          - <span className='text-slate-500 text-sm'>{format(comment.createdAt, 'vi')}</span>{' '}
          {/* Action Buttons */}
          {curUser?._id && (
            <div className='relative flex justify-end items-center'>
              <button className='group' onClick={() => setShowActions(prev => !prev)}>
                <HiDotsHorizontal size={20} className='wiggle' />
              </button>

              <div
                className={`fixed z-10 top-0 left-0 right-0 bottom-0 ${showActions ? '' : 'hidden'}`}
                onClick={() => setShowActions(false)}
              />
              <div
                className={`${
                  showActions ? 'max-w-[120px] max-h-[80px]' : 'max-w-0 max-h-0 p-0'
                }  overflow-hidden absolute z-20 top-full right-0 flex shadow-lg rounded-md bg-white trans-300`}
              >
                {(user?._id === curUser._id || user?.role === 'admin') && (
                  <button
                    className={`font-bold px-1.5 py-1 text-[10px] bg-slate-200 hover:text-white trans-200 ${
                      status === 'open'
                        ? 'border-dark hover:bg-black'
                        : 'border-green-500 text-green-500 hover:bg-green-500'
                    }`}
                    title={status === 'open' ? 'opening' : 'closing'}
                    onClick={() => hideComment(comment._id, comment.hide ? 'n' : 'y')}
                  >
                    {comment.hide ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                )}

                <button
                  className={`font-bold text-nowrap px-1.5 py-1 text-[10px] hover:bg-dark-0 hover:border-dark hover:text-rose-500 border-rose-400 text-rose-400 trans-200`}
                  title='Report'
                  onClick={() => setIsOpenReportDialog(true)}
                >
                  Báo cáo
                </button>
              </div>
            </div>
          )}
          {/* Confirm Demote Collaborator Dialog */}
          <ReportDialog
            open={isOpenReportDialog}
            setOpen={setIsOpenReportDialog}
            title='Report Comment'
            contents={reportContents.comment}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
            onAccept={handleReport}
            isLoading={false}
          />
        </div>

        {/* MARK: Content */}
        <p className='font-body tracking-tide pt-1 pb-1.5'>{comment.content}</p>

        {/* MARK: Actions */}
        <div className='flex items-center gap-3 text-sm'>
          <div className='group flex items-center font-semibold gap-1'>
            {comment.likes.includes(curUser?._id) ? (
              <FaHeart
                size={14}
                className='h-[14px] text-secondary cursor-pointer wiggle'
                onClick={() => likeComment('n')}
              />
            ) : (
              <FaRegHeart
                size={14}
                className='w-4 h-[14px] text-secondary cursor-pointer wiggle'
                onClick={() => likeComment('y')}
              />
            )}{' '}
            <span>{comment.likes.length}</span>
          </div>

          {comment.lessonId && (
            <div
              className='flex font-semibold text-primary gap-1 cursor-pointer select-none'
              onClick={() => setIsOpenReply(prev => !prev)}
            >
              <span>{comment.replied.length}</span>
              <span className=''>Response</span>
              <FaSortDown />
            </div>
          )}
        </div>

        {/* MARK: Reply Section */}
        <div
          className={`${
            isOpenReply ? 'max-h-[350px]' : 'max-h-0'
          } relative h-full overflow-y-scroll trans-200 mt-1 `}
        >
          {/* MARK: Input */}
          <div className='sticky z-10 top-0 flex items-start gap-2 bg-white'>
            <Image
              className={`rounded-full shadow-lg ${className}`}
              src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
              width={24}
              height={24}
              alt='avatar'
            />
            <div className='w-full flex flex-col items-end sm:flex-row sm:items-center'>
              <input
                id='comment'
                className='px-2 py-1 border-b w-full text-sm text-dark focus:outline-none focus:ring-0 peer'
                placeholder=' '
                disabled={isLoading}
                type='text'
                {...register('comment', { required: true })}
                onWheel={e => e.currentTarget.blur()}
              />
              <div className='flex gap-2 mt-2 justify-end'>
                <button
                  className='h-[30px] text-sm px-3 rounded-lg border border-slate-200 hover:bg-slate-200 trans-200 ml-2'
                  onClick={() => setIsOpenReply(false)}
                >
                  Hủy
                </button>
                <LoadingButton
                  className='h-[30px] flex items-center text-sm px-3 border border-dark hover:bg-dark-100 text-dark hover:text-white rounded-lg trans-200'
                  onClick={handleSubmit(replyComment)}
                  text='Gửi'
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* MARK: Replied Comments */}
          <div className='relative flex flex-col gap-3 mt-1'>
            {(comment.replied as IComment[]).map((comment: IComment) => (
              <CommentItem setCmts={setCmts} comment={comment} key={comment._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CommentItem)
