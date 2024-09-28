'use client'

import { IComment } from '@/models/CommentModel'
import { addCommentApi } from '@/requests/commentRequest'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CommentItem from './CommentItem'
import LoadingButton from './LoadingButton'

interface CommentProps {
  comments: IComment[]
  lessonId?: string
  className?: string
}

function Comment({ comments, lessonId, className = '' }: CommentProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [cmts, setCmts] = useState<IComment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // values
  const isShowCrown =
    curUser?.package &&
    (curUser.package.expire === null || new Date(curUser.package.expire) > new Date())

  // forms
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      comment: '',
    },
  })

  // set cmts
  useEffect(() => {
    setCmts(comments)
  }, [comments])

  // handle send comment
  const sendComment: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // check login
      if (!curUser) return toast.error('Hãy đăng nhập để bình luận')

      // check if comment is valid
      if (lessonId) {
        setIsLoading(true)

        try {
          // send request to add comment
          const { newComment } = await addCommentApi({
            lessonId,
            content: data.comment,
          })
          newComment.user = curUser

          // add new comment to list
          setCmts(prev => [newComment, ...prev])

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
    [reset, lessonId, curUser]
  )

  return (
    <div>
      {/* MARK: Input */}
      <div className={`flex items-center justify-between gap-3 ${className}`}>
        <Link
          className="relative"
          href={`/user/${curUser?.username || curUser?.email}`}
        >
          {isShowCrown && (
            <Image
              className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
              src="/icons/ring-circle.png"
              width={46}
              height={46}
              alt="ring"
            />
          )}
          <Image
            className={`relative z-10 aspect-square rounded-full shadow-lg ${isShowCrown ? 'p-1' : ''}`}
            src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
            width={46}
            height={46}
            alt="avatar"
          />
          {isShowCrown && (
            <Image
              className="absolute -top-[11px] right-[3px] z-20 rotate-[18deg]"
              src="/icons/crown-icon-2.png"
              width={24}
              height={24}
              alt="crown"
            />
          )}
        </Link>
        <div
          className={`relative w-full rounded-lg border-[2px] bg-white ${
            errors.comment ? 'border-rose-400' : 'border-slate-200'
          }`}
        >
          <input
            id="comment"
            className="number-input peer block h-[40px] w-full bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-dark focus:outline-none focus:ring-0"
            placeholder=" "
            disabled={isLoading}
            type="text"
            {...register('comment', { required: true })}
            onBlur={() => clearErrors('comment')}
            onKeyDown={e => e.stopPropagation()}
          />

          {/* label */}
          <label
            htmlFor="comment"
            className={`trans-300 absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer text-nowrap rounded-md bg-white px-2 text-sm text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 ${
              errors.comment ? 'text-rose-400' : 'text-dark'
            }`}
          >
            Bình luận
          </label>
        </div>
        <LoadingButton
          className="trans-200 flex h-[40px] items-center rounded-lg border border-dark px-3 font-semibold text-dark hover:bg-dark-100 hover:text-light sm:px-6"
          onClick={handleSubmit(sendComment)}
          text="Gửi"
          isLoading={isLoading}
        />
      </div>
      {errors.comment?.message && (
        <span className="ml-[60px] text-sm text-rose-400">{errors.comment?.message?.toString()}</span>
      )}

      {/* MARK: Comment List */}
      <div className="mt-5 flex flex-col gap-3">
        {cmts
          .filter(comment => !comment.hide || comment.userId === curUser?._id)
          .map(comment => (
            <CommentItem
              comment={comment}
              setCmts={setCmts}
              key={comment._id}
            />
          ))}
      </div>
    </div>
  )
}

export default memo(Comment)
