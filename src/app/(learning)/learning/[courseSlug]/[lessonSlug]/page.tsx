'use client'

import Comment from '@/components/Comment'
import Divider from '@/components/Divider'
import IframePlayer from '@/components/iframe/IframePlayer'
import VideoPlayer from '@/components/VideoPlayer'
import ReportDialog from '@/components/dialogs/ReportDigalog'
import { reportContents } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setIsFullScreen, setLearningLesson } from '@/libs/reducers/learningReducer'
import { setOpenSidebar, setPageLoading } from '@/libs/reducers/modalReducer'
import { IComment } from '@/models/CommentModel'
import { ICourse } from '@/models/CourseModel'
import { IProgress } from '@/models/ProgressModel'
import { addReportApi, getLessonApi, likeLessonApi, updateProgressApi } from '@/requests'
import { formatFileSize } from '@/utils/number'
import moment from 'moment-timezone'
import 'moment/locale/vi'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs'
import { FaAngleRight, FaChevronLeft, FaFile, FaHeart, FaRegHeart } from 'react-icons/fa'
import { HiDotsHorizontal } from 'react-icons/hi'
import { RiFullscreenExitLine, RiFullscreenFill } from 'react-icons/ri'

function LessonPage({
  params: { courseSlug, lessonSlug },
}: {
  params: { courseSlug: string; lessonSlug: string }
}) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const openSidebar = useAppSelector(state => state.modal.openSidebar)
  const { data: session } = useSession()
  const curUser: any = session?.user
  const lesson = useAppSelector(state => state.learning.learningLesson)

  // MARK: stores
  const isFullScreen = useAppSelector(state => state.learning.isFullScreen)

  // MARK: states
  const [comments, setComments] = useState<IComment[]>([])
  const [showActions, setShowActions] = useState<boolean>(false)
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const [tab, setTab] = useState<number>(1)

  // report states
  const [isOpenReportDialog, setIsOpenReportDialog] = useState<boolean>(false)
  const [selectedContent, setSelectedContent] = useState<string>('')
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)

  // MARK: get lesson
  useEffect(() => {
    const getLesson = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      // get lesson for learning
      try {
        const { lesson, comments } = await getLessonApi(`${courseSlug}---${lessonSlug}`, '', {
          next: { revalidate: 300 },
        })

        // set learning lesson
        dispatch(setLearningLesson(lesson))

        // set breadcrumbs
        setBreadcrumbs((lesson.courseId as any).category.slug.split('/'))

        // set states
        setComments(comments)

        const isEnrolled = curUser?.courses
          ?.map((course: any) => course.course)
          .includes((lesson?.courseId as ICourse)._id)

        setIsEnrolled(isEnrolled)

        // check if lesson is "doc only" or not
        if (!lesson.source && lesson.docs.length > 0) {
          setTab(2)

          setTimeout(async () => {
            if (!lesson || lesson?.progress?.status === 'completed' || !isEnrolled) return

            const { progress } = await updateProgressApi(
              (lesson.progress as IProgress)._id,
              (lesson.courseId as ICourse)._id,
              'completed',
              100
            )

            // update states
            dispatch(setLearningLesson({ ...lesson, progress }))
          }, 5000)
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
        dispatch(setPageLoading(true))
        setTimeout(() => {
          router.push('/my-courses')
        }, 2000)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    if (lessonSlug !== 'continue') {
      getLesson()
    }
  }, [dispatch, lessonSlug, router, curUser?.courses, courseSlug])

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

  // set page title
  useEffect(() => {
    if (!lesson?.title) return
    document.title = `${lesson?.title} - Mona Edu`
  }, [lesson?.title])

  return (
    <div className="w-full px-3">
      <Divider size={5} />

      {/* MARK: Header Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className={`${
              openSidebar ? 'mr-0 max-w-0 p-0' : 'mr-2 max-w-[44px] px-3 py-2'
            } trans-300 group flex-shrink-0 overflow-hidden rounded-lg`}
            onClick={() => dispatch(setOpenSidebar(!openSidebar))}
          >
            <BsLayoutSidebarInsetReverse
              size={20}
              className="wiggle"
            />
          </button>

          <Link
            href="/my-courses"
            className="trans-200 group flex items-center gap-1 rounded-md border border-dark px-2 py-1.5 text-xs font-bold text-dark shadow-md hover:border-dark hover:bg-dark-0 hover:text-light"
          >
            <FaChevronLeft
              size={12}
              className="wiggle"
            />
            Quay lại
          </Link>
        </div>

        {curUser?._id && (
          <div className="bg relative flex flex-shrink-0 items-center justify-end">
            <button
              className="group"
              onClick={() => setShowActions(prev => !prev)}
            >
              <HiDotsHorizontal
                size={24}
                className="wiggle"
              />
            </button>

            <div
              className={`fixed bottom-0 left-0 right-0 top-0 z-10 ${showActions ? '' : 'hidden'}`}
              onClick={() => setShowActions(false)}
            />
            <div
              className={`${
                showActions ? 'max-h-[40px] max-w-[120px]' : 'max-h-0 max-w-0 p-0'
              } trans-300 absolute right-[calc(100%_+_8px)] top-1/2 z-20 flex -translate-y-1/2 gap-2 overflow-hidden rounded-md bg-white`}
            >
              <button
                className={`trans-200 rounded-md border border-rose-400 bg-white px-1.5 py-1 text-[10px] font-bold text-rose-400 shadow-md hover:border-dark hover:bg-dark-0 hover:text-rose-500`}
                title="Report"
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
          title="Báo cáo bài giảng"
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
          <div className="relative z-20 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
            <Link
              href="/"
              className="trans-200 hover:text-secondary hover:drop-shadow-md"
            >
              trang-chu
            </Link>
            <FaAngleRight size={14} />
            <Link
              href="/categories"
              className="trans-200 hover:text-secondary hover:drop-shadow-md"
            >
              danh-muc
            </Link>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={index}>
                {index === 0 && <FaAngleRight size={14} />}
                <Link
                  href={`/categories/${breadcrumbs.slice(0, index + 1).join('/')}`}
                  className="trans-200 hover:text-secondary hover:drop-shadow-md"
                >
                  {breadcrumb}
                </Link>
                {index !== breadcrumbs.length - 1 && <FaAngleRight size={14} />}
              </Fragment>
            ))}
          </div>

          {/* Course */}
          <h2
            className="mt-2 line-clamp-1 text-ellipsis text-2xl font-semibold"
            title={(lesson?.courseId as ICourse)?.title}
          >
            {(lesson?.courseId as ICourse)?.title}
          </h2>

          <Divider size={4} />

          {/* MARK: Source */}
          {lesson.source ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
              {lesson.sourceType === 'embed' ? (
                <IframePlayer lesson={lesson} />
              ) : (
                <VideoPlayer lesson={lesson} />
              )}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-200 px-3 py-2 text-center text-xl font-semibold text-slate-300">
              Tài liệu khóa học
            </p>
          )}

          <Divider size={4} />

          <div className="flex justify-between gap-21 font-semibold">
            <div className="group flex items-center justify-center gap-1">
              {lesson.likes.includes(curUser?._id) ? (
                <FaHeart
                  size={20}
                  className="wiggle cursor-pointer text-rose-400"
                  onClick={() => likeLesson('n')}
                />
              ) : (
                <FaRegHeart
                  size={20}
                  className="wiggle cursor-pointer text-rose-400"
                  onClick={() => likeLesson('y')}
                />
              )}{' '}
              <span>{lesson.likes.length}</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                className="group flex h-7 items-center justify-center rounded-md border-b-2 border-light bg-[#333] p-1 shadow-lg"
                onClick={() => dispatch(setIsFullScreen(!isFullScreen))}
                title="Toàn màn hình"
              >
                {!isFullScreen ? (
                  <RiFullscreenFill
                    size={20}
                    className="text-light"
                  />
                ) : (
                  <RiFullscreenExitLine
                    size={20}
                    className="text-light"
                  />
                )}
              </button>
            </div>
          </div>

          <Divider size={2} />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <p className="font-body tracking-wider">
              Thời gian tạo:{' '}
              <span className="font-semibold text-slate-600">{moment(lesson.createdAt).fromNow()}</span>
            </p>
            <p className="font-body tracking-wider">
              Thời gian cập nhật:{' '}
              <span className="font-semibold text-slate-600">{moment(lesson.updatedAt).fromNow()}</span>
            </p>
          </div>

          <Divider size={2} />

          {/* Title */}
          <h1
            className="line-clamp-2 w-full text-ellipsis font-body text-3xl tracking-wider"
            title=""
          >
            {lesson.title}
          </h1>

          <Divider size={4} />

          {/* Category */}
          {(lesson.courseId as any)?.category && (
            <Link
              href={`/categories/${(lesson.courseId as any)?.category?.slug}`}
              className="text-nowrap rounded-3xl bg-primary px-3 py-2 text-xs font-semibold uppercase text-slate-800 shadow-lg md:text-sm"
            >
              {(lesson.courseId as any)?.category?.title}
            </Link>
          )}

          <Divider size={12} />

          {/* Description & Docs */}
          <div className="w-full">
            <div className={`flex`}>
              <button
                className={`trans-200 rounded-t-lg px-4 py-1.5 font-semibold ${
                  tab === 1 ? 'bg-primary shadow-lg' : 'bg-white shadow-md'
                }`}
                onClick={() => setTab(1)}
              >
                Mô tả
              </button>
              {lesson?.docs?.length > 0 && (
                <button
                  className={`trans-200 rounded-t-lg px-4 py-1.5 font-semibold ${
                    tab === 2 ? 'bg-primary shadow-lg drop-shadow-lg' : 'bg-white shadow-md'
                  }`}
                  onClick={() => setTab(2)}
                >
                  Tài liệu
                </button>
              )}
            </div>
            <div className="rounded-b-lg border-t-2 border-primary bg-white py-3">
              {tab === 1 && <div dangerouslySetInnerHTML={{ __html: lesson?.description || '' }} />}
              {tab === 2 && lesson?.docs?.length > 0 && (
                <div className="grid grid-cols-2 gap-21 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {lesson.docs.map((doc, index) => (
                    <Link
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex gap-1.5 rounded-md border border-dark p-3 shadow-lg"
                      key={index}
                    >
                      <FaFile
                        size={20}
                        className="flex-shrink-0 text-secondary"
                      />

                      <div className="flex w-full flex-col font-body tracking-wider">
                        <p className="-mt-1 line-clamp-2 overflow-hidden text-ellipsis text-sm text-dark">
                          {doc.name}
                        </p>
                        <p className="text-xs text-slate-500">{formatFileSize(doc.size)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MARK: Comments */}
          {isEnrolled && (
            <div className="mt-12">
              <h3 className="mb-2 text-xl font-semibold text-slate-800">Bình luận</h3>

              <Comment
                comments={comments}
                lessonId={lesson._id}
              />
            </div>
          )}

          <Divider size={20} />
        </>
      ) : (
        <p className="mt-4 text-center font-body text-2xl font-semibold italic tracking-wider text-slate-400">
          Đang tải dữ liệu..., vui lòng chờ trong giây lát <span className="not-italic">😉</span>
        </p>
      )}
    </div>
  )
}

export default LessonPage
