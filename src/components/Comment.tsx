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
        <Link className='relative' href={`/user/${curUser?.username || curUser?.email}`}>
          {isShowCrown && (
            <Image
              className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square rounded-full overflow-hidden'
              src='/icons/ring-circle.png'
              width={46}
              height={46}
              alt='ring'
            />
          )}
          <Image
            className={`relative z-10 aspect-square rounded-full shadow-lg ${isShowCrown ? 'p-1' : ''}`}
            src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
            width={46}
            height={46}
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
        <div
          className={`relative w-full rounded-lg border-[2px] bg-white ${
            errors.comment ? 'border-rose-400' : 'border-slate-200'
          }`}
        >
          <input
            id='comment'
            className='h-[40px] block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer number-input'
            placeholder=' '
            disabled={isLoading}
            type='text'
            {...register('comment', { required: true })}
            onBlur={() => clearErrors('comment')}
          />

          {/* label */}
          <label
            htmlFor='comment'
            className={`absolute text-nowrap rounded-md text-sm text-gray-500 trans-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
              errors.comment ? 'text-rose-400' : 'text-dark'
            }`}
          >
            Comment
          </label>
        </div>
        <LoadingButton
          className='h-[40px] flex items-center px-3 sm:px-6 border border-dark hover:bg-dark-100 font-semibold text-dark hover:text-light rounded-lg trans-200'
          onClick={handleSubmit(sendComment)}
          text='Gửi'
          isLoading={isLoading}
        />
      </div>
      {errors.comment?.message && (
        <span className='text-sm text-rose-400 ml-[60px]'>{errors.comment?.message?.toString()}</span>
      )}

      {/* MARK: Comment List */}
      <div className='flex flex-col mt-5 gap-3'>
        {cmts
          .filter(comment => !comment.hide || comment.userId === curUser?._id)
          .map(comment => (
            <CommentItem comment={comment} setCmts={setCmts} key={comment._id} />
          ))}
      </div>
    </div>
  )
}

export default memo(Comment)
