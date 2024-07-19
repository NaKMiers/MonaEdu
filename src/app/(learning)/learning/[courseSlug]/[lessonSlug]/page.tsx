'use client'

import Comment from '@/components/Comment'
import Divider from '@/components/Divider'
import IframePlayer from '@/components/IframePlayer'
import ReportDialog from '@/components/dialogs/ReportDigalog'
import { reportContents } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useDetectDevTools from '@/libs/hooks/useDetectDevTools'
import { setLearningLesson } from '@/libs/reducers/learningReducer'
import { setOpenSidebar } from '@/libs/reducers/modalReducer'
import { IComment } from '@/models/CommentModel'
import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import { addReportApi, getLessonApi, likeLessonApi } from '@/requests'
import moment from 'moment-timezone'
import 'moment/locale/vi'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Fragment, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs'
import { FaAngleRight, FaChevronLeft, FaHeart, FaQuestion, FaRegHeart } from 'react-icons/fa'
import { HiDotsHorizontal } from 'react-icons/hi'

function LessonPage({
  params: { courseSlug, lessonSlug },
}: {
  params: { courseSlug: string; lessonSlug: string }
}) {
  // hooks
  // useDetectDevTools()
  const dispatch = useAppDispatch()
  const openSidebar = useAppSelector((state) => state.modal.openSidebar)
  const { data: session } = useSession()
  const curUser: any = session?.user
  const lesson = useAppSelector((state) => state.learning.learningLesson)

  // MARK: states
  const [comments, setComments] = useState<IComment[]>([])
  const [showActions, setShowActions] = useState<boolean>(false)
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])

  // report states
  const [isOpenReportDialog, setIsOpenReportDialog] = useState<boolean>(false)
  const [selectedContent, setSelectedContent] = useState<string>('')

  // MARK: get lesson
  useEffect(() => {
    const getLesson = async () => {
      // get lesson for learning
      try {
        const { lesson, comments } = await getLessonApi(lessonSlug)

        console.log('lesson', lesson)

        // set learning lesson
        dispatch(setLearningLesson(lesson))

        // set breadcrumbs
        setBreadcrumbs((lesson.courseId as any).category.slug.split('/'))

        // set states
        setComments(comments)
      } catch (err: any) {
        console.log(err)
        // router.back()
      }
    }

    getLesson()
  }, [dispatch, lessonSlug])

  const handleReport = useCallback(async () => {
    // check if content is selected or not
    if (!selectedContent) {
      toast.error('Hãy chọn nội dung cần báo cáo')
      return
    }

    try {
      const { message } = await addReportApi({
        type: 'lesson',
        content: selectedContent,
        link: `/admin/lesson/all?_id=${lesson?._id}`,
      })

      // show success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [lesson?._id, selectedContent])

  // MARK: like / unlike lesson
  const likeLesson = useCallback(
    async (value: 'y' | 'n') => {
      if (lesson?._id) {
        try {
          // send request to like / dislike lesson
          const { updatedLesson } = await likeLessonApi(lesson._id, value)

          // like / dislike lesson
          dispatch(
            setLearningLesson({
              ...lesson,
              likes: updatedLesson.likes,
            })
          )
        } catch (err: any) {
          toast.error(err.message)
          console.log(err)
        }
      } else {
        toast.error('Không tìm thấy khóa học')
      }
    },
    [dispatch, lesson]
  )

  return (
    <div className='w-full px-3'>
      <Divider size={5} />

      {/* MARK: Header Buttons */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <button
            className={`${
              openSidebar ? 'max-w-0 p-0 mr-0' : 'max-w-[44px] px-3 py-2 mr-2'
            } flex-shrink-0 overflow-hidden group rounded-lg trans-300`}
            onClick={() => dispatch(setOpenSidebar(!openSidebar))}
          >
            <BsLayoutSidebarInsetReverse size={20} className='wiggle' />
          </button>

          <Link
            href='/my-courses'
            className='flex items-center gap-1 font-bold px-2 py-1.5 text-xs hover:bg-dark-0 hover:border-dark hover:text-white border border-dark text-dark rounded-md shadow-md trans-200 group'
          >
            <FaChevronLeft size={12} className='wiggle' />
            Quay lại
          </Link>
        </div>

        {curUser?._id && (
          <div className='relative flex-shrink-0 flex justify-end items-center bg'>
            <button className='group' onClick={() => setShowActions((prev) => !prev)}>
              <HiDotsHorizontal size={24} className='wiggle' />
            </button>

            <div
              className={`fixed z-10 top-0 left-0 right-0 bottom-0 ${showActions ? '' : 'hidden'}`}
              onClick={() => setShowActions(false)}
            />
            <div
              className={`${
                showActions ? 'max-w-[120px] max-h-[40px]' : 'max-w-0 max-h-0 p-0'
              }  overflow-hidden absolute z-20 top-1/2 -translate-y-1/2 right-[calc(100%_+_8px)] flex gap-2 rounded-md bg-white trans-300`}
            >
              <button
                className={`font-bold px-1.5 py-1 text-[10px] bg-white hover:bg-dark-0 hover:border-dark hover:text-rose-500 border border-rose-400 text-rose-400 rounded-md shadow-md trans-200`}
                title='Report'
                onClick={() => setIsOpenReportDialog(true)}
              >
                Báo cáo
              </button>
            </div>
          </div>
        )}

        {/* Report Dialog */}
        <ReportDialog
          open={isOpenReportDialog}
          setOpen={setIsOpenReportDialog}
          title='Report Question'
          contents={reportContents.lesson}
          selectedContent={selectedContent}
          setSelectedContent={setSelectedContent}
          onAccept={handleReport}
          isLoading={false}
        />
      </div>

      <Divider size={4} />

      {lesson ? (
        <>
          {/* Breadcrumbs */}
          <div className='flex items-center flex-wrap gap-x-3 gap-y-1 relative z-20 text-slate-400 text-sm'>
            <Link href='/' className='hover:text-secondary trans-200 hover:drop-shadow-md'>
              trang-chu
            </Link>
            <FaAngleRight size={14} />
            <Link href='/categories' className='hover:text-secondary trans-200 hover:drop-shadow-md'>
              danh-muc
            </Link>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={index}>
                {index === 0 && <FaAngleRight size={14} />}
                <Link
                  href={`/categories/${breadcrumbs.slice(0, index + 1).join('/')}`}
                  className='hover:text-secondary trans-200 hover:drop-shadow-md'
                >
                  {breadcrumb}
                </Link>
                {index !== breadcrumbs.length - 1 && <FaAngleRight size={14} />}
              </Fragment>
            ))}
          </div>

          {/* Course */}
          <h2
            className='font-semibold text-2xl mt-2 text-ellipsis line-clamp-1'
            title={(lesson?.courseId as ICourse)?.title}
          >
            {(lesson?.courseId as ICourse)?.title}
          </h2>

          <Divider size={4} />

          {/* MARK: Source */}
          <div className='aspect-video w-full rounded-lg shadow-lg overflow-hidden'>
            {lesson.sourceType === 'embed' ? (
              <IframePlayer />
            ) : (
              <video className='rounded-lg w-full h-full object-contain' src={lesson.source} controls />
            )}
          </div>

          <Divider size={4} />

          <div className='flex justify-between font-semibold gap-21'>
            <div className='group flex items-center justify-center gap-1'>
              {lesson.likes.includes(curUser?._id) ? (
                <FaHeart
                  size={20}
                  className='text-rose-400 cursor-pointer wiggle'
                  onClick={() => likeLesson('n')}
                />
              ) : (
                <FaRegHeart
                  size={20}
                  className='text-rose-400 cursor-pointer wiggle'
                  onClick={() => likeLesson('y')}
                />
              )}{' '}
              <span>{lesson.likes.length}</span>
            </div>

            <Link
              href='/forum'
              className='px-2 py-1 bg-slate-200 flex items-center rounded-lg hover:bg-dark-100 hover:text-white trans-200 shadow-lg'
            >
              <span className='font-semibold text-lg'>Đặt câu hỏi </span>
              <FaQuestion size={18} />
            </Link>
          </div>

          <Divider size={2} />

          <div className='flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500'>
            <p className='font-body tracking-wider'>
              Thời gian tạo:{' '}
              <span className='font-semibold text-slate-600'>{moment(lesson.createdAt).fromNow()}</span>
            </p>
            <p className='font-body tracking-wider'>
              Thời gian cập nhật:{' '}
              <span className='font-semibold text-slate-600'>{moment(lesson.updatedAt).fromNow()}</span>
            </p>
          </div>

          <Divider size={2} />

          {/* Title */}
          <h1 className='text-ellipsis line-clamp-2 w-full text-3xl font-body tracking-wider' title=''>
            {lesson.title}
          </h1>

          <Divider size={4} />

          {/* Category */}
          <Link
            href={`/categories/${(lesson.courseId as any)?.category?.slug}`}
            className='rounded-3xl shadow-lg bg-primary text-slate-800 font-semibold uppercase px-3 py-2 text-xs md:text-sm text-nowrap'
          >
            {(lesson.courseId as any)?.category?.title}
          </Link>

          <Divider size={4} />

          {/* Description */}
          <div className=''>{lesson.description}</div>

          <Divider size={12} />

          {/* MARK: Comments */}
          <div className=''>
            <h3 className='font-semibold text-xl mb-2 text-slate-800'>Bình luận</h3>

            <Comment comments={comments} lessonId={lesson._id} />
          </div>

          <Divider size={8} />
        </>
      ) : (
        <p className='font-body tracking-wider font-semibold text-2xl italic text-slate-400 text-center mt-4'>
          Không tìm thấy bài giảng. Vui lòng kiểm tra lại đường dẫn.
        </p>
      )}
    </div>
  )
}

export default LessonPage
