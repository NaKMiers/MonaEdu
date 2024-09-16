import { connectDatabase } from '@/config/database'
import ProgressModel from '@/models/ProgressModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// models: User, Progress
import '@/models/ProgressModel'
import '@/models/UserModel'

// [POST]: /api/progress/add
export async function POST(req: NextRequest) {
  console.log('- Add Progress - ')

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
    const user: IUser | null = await UserModel.findById(userId).select('courses').lean()

    // user not found
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy khóa học' }, { status: 404 })
    }

    const userCourses = user.courses

    // get data to add progress
    const { courseId, lessonId, status } = await req.json()

    // check if user has joined the course
    const isEnrolled = userCourses.some((course: any) => course.course.toString() === courseId)
    if (!isEnrolled) {
      return NextResponse.json({ message: 'Bạn chưa tham gia khóa học' }, { status: 403 })
    }

    // create progress
    const progress = await ProgressModel.create({
      userId,
      courseId,
      lessonId,
      status,
      progress: status === 'completed' ? 100 : 0,
    })

    // return response
    return NextResponse.json({ progress, message: 'Thêm tiến trình thành công' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
