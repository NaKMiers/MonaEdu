import { connectDatabase } from '@/config/database'
import LessonModel from '@/models/LessonModel'
import ProgressModel, { IProgress } from '@/models/ProgressModel'
import UserModel from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// models: User, Progress, Lesson
import '@/models/LessonModel'
import '@/models/ProgressModel'
import '@/models/UserModel'

// [PUT]: /api/progress/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Update Progress - ')

  try {
    // connect database
    await connectDatabase()

    // get user id to add progress
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // check if userId exists
    if (!userId) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 })
    }

    // get user's courses to check if user has joined the course
    const courses: any = await UserModel.findById(userId).select('courses').lean()

    // courses not found
    if (!courses) {
      return NextResponse.json({ message: 'Không tìm thấy khóa học' }, { status: 404 })
    }

    // get data to add progress
    const { courseId, status, progress: value } = await req.json()
    // check if user has joined the course

    // check if user has joined the course
    const isEnrolled = courses.courses.some((course: any) => course.course.toString() === courseId)
    if (!isEnrolled) {
      return NextResponse.json({ message: 'Bạn chưa tham gia khóa học' }, { status: 403 })
    }

    // create progress
    const progress: IProgress | null = await ProgressModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          progress: status === 'completed' ? 100 : value,
        },
      },
      { new: true }
    ).lean()

    // check progress
    if (!progress) {
      return NextResponse.json({ message: 'Không tìm thấy tiến trình' }, { status: 404 })
    }

    if (progress.status === 'completed') {
      // update user's courses's progress
      // get all progresses of the course of the user
      const [completedProgresses, totalLessons] = await Promise.all([
        ProgressModel.countDocuments({
          courseId,
          userId,
          status: 'completed',
        }),
        LessonModel.countDocuments({ courseId, active: true }),
      ])
      const percent = Math.round((completedProgresses / totalLessons) * 100)

      const userCourses = courses.courses.map((course: any) =>
        course.course.toString() === courseId ? { ...course, progress: percent } : course
      )
      await UserModel.findByIdAndUpdate(userId, { $set: { courses: userCourses } }).lean()
    }

    // return response
    return NextResponse.json({ progress, message: 'Cập nhật tiến trình thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
