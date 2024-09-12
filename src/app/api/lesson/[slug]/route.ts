import { connectDatabase } from '@/config/database'
import CommentModel from '@/models/CommentModel'
import { ICourse } from '@/models/CourseModel'
import LessonModel, { ILesson } from '@/models/LessonModel'
import ProgressModel, { IProgress } from '@/models/ProgressModel'
import { getFileUrl } from '@/utils/uploadFile'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import UserModel, { IUser } from '@/models/UserModel'

// Models: Lesson, Comment, User, Category, Progress, Course
import '@/models/CategoryModel'
import '@/models/CommentModel'
import '@/models/CourseModel'
import '@/models/LessonModel'
import '@/models/ProgressModel'
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/lesson/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Lesson -')

  try {
    // connect to database
    await connectDatabase()

    // get user to check if user is allow to access this lesson
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // check if user is logged in
    if (!userId) {
      return NextResponse.json({ message: 'Bạn cần đăng nhập để xem bài giảng này' }, { status: 401 })
    }

    // get user
    const user: IUser | null = await UserModel.findById(userId).lean()

    // check if user exists or not
    if (!user) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 })
    }

    // get lesson from database
    const lesson: ILesson | null = await LessonModel.findOne({ slug, active: true })
      .populate({
        path: 'courseId',
        populate: {
          path: 'category',
          select: 'title slug',
        },
      })
      .lean()

    // check lesson
    if (!lesson) {
      return NextResponse.json({ message: 'Không tìm thấy bài giảng' }, { status: 404 })
    }

    // get progress of this user of this lesson
    const progress: IProgress | null = await ProgressModel.findOne({
      userId: user._id,
      lessonId: lesson?._id,
    }).lean()

    if (progress) {
      lesson.progress = progress
    }

    // if user is not enrolled in this course
    let isEnrolled = user.courses
      .map((course: any) => course.course.toString())
      .includes((lesson.courseId as ICourse)._id.toString())

    // check if lesson is public
    if (lesson.status !== 'public' && !isEnrolled) {
      return NextResponse.json(
        { message: 'Bạn không được phép truy cập bài giảng này' },
        { status: 403 }
      )
    }

    // if user joined the course by subscription and subscription expired -> not allow
    const userCourse = user.courses.find(
      (course: any) => course.course.toString() === (lesson.courseId as ICourse)._id.toString()
    )
    if (
      userCourse &&
      userCourse.expire &&
      userCourse.expire !== null &&
      new Date(userCourse.expire) < new Date() &&
      lesson.status !== 'public'
    ) {
      return NextResponse.json(
        { message: 'Gói học viên của bạn đã hết hạn, vui lòng gia hạn hoặc mua khóa học để tiếp tục' },
        { status: 403 }
      )
    }

    // get file url if lesson's source type is file
    if (lesson.sourceType === 'file') {
      lesson.source = await getFileUrl(lesson.source)
    }

    let comments: any[] = []

    if (isEnrolled) {
      // get comment of the current lesson
      comments = await CommentModel.find({
        lessonId: lesson._id,
      })
        .populate({
          path: 'userId',
          select: 'avatar firstName lastName email nickname package',
        })
        .populate({
          path: 'replied',
          populate: {
            path: 'userId',
            select: 'avatar firstName lastName email nickname package',
          },
          options: { sort: { likes: -1, createdAt: -1 }, limit: 6 },
        })
        .sort({ likes: -1, createdAt: -1 })
        .limit(8)
        .lean()

      comments = comments.map(comment => ({
        ...comment,
        userId: comment.userId._id,
        user: comment.userId,
        replied: comment.replied.map((reply: any) => ({
          ...reply,
          userId: reply.userId._id,
          user: reply.userId,
        })),
      }))
    }

    // return lesson
    return NextResponse.json({ lesson, comments }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
