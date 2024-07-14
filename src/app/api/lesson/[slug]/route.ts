import { connectDatabase } from '@/config/database'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Comment, User
import '@/models/LessonModel'
import '@/models/CommentModel'
import '@/models/UserModel'
import CommentModel from '@/models/CommentModel'
import { getFileUrl } from '@/utils/uploadFile'
import { getToken } from 'next-auth/jwt'
import { ICourse } from '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/lesson/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Lesson -')

  try {
    // connect to database
    await connectDatabase()

    // get user to check if user is allow to access this lesson
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const user: any = token

    if (!user?._id) {
      return NextResponse.json({ message: 'Bạn cần đăng nhập để xem bài giảng này' }, { status: 401 })
    }

    // get lesson from database
    const lesson: ILesson | null = await LessonModel.findOne({ slug })
      .populate({
        path: 'courseId',
      })
      .lean()

    // check lesson
    if (!lesson) {
      return NextResponse.json({ message: 'Không tìm thấy bài giảng' }, { status: 404 })
    }

    // check if lesson is public
    if (lesson.status !== 'public') {
      // if user is not enrolled in this course
      if (!user.courses.map((course: any) => course.course).includes((lesson.courseId as ICourse)._id)) {
        return NextResponse.json({ message: 'Bài giảng này không được công khai' }, { status: 403 })
      }
    }
    console.log('Lesson:', lesson)

    // get file url if lesson's source type is file
    if (lesson.sourceType === 'file') {
      lesson.source = await getFileUrl(lesson.source)
    }

    // get comment of the current lesson
    let comments = await CommentModel.find({
      lessonId: lesson._id,
    })
      .populate('userId')
      .populate({
        path: 'replied',
        populate: {
          path: 'userId',
        },
        options: { sort: { likes: -1, createdAt: -1 }, limit: 6 },
      })
      .sort({ likes: -1, createdAt: -1 })
      .limit(8)
      .lean()

    comments = comments.map((comment) => ({
      ...comment,
      userId: comment.userId._id,
      user: comment.userId,
      replied: comment.replied.map((reply: any) => ({
        ...reply,
        userId: reply.userId._id,
        user: reply.userId,
      })),
    }))

    // return lesson
    return NextResponse.json({ lesson, comments }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
