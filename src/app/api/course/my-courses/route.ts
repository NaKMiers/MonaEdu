// Models:

import { connectDatabase } from '@/config/database'
import CourseModel, { ICourse } from '@/models/CourseModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, User
import '@/models/CourseModel'
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /course/my-courses
export async function GET(req: NextRequest) {
  console.log('- Get My Courses -')

  try {
    // connect to database
    await connectDatabase()

    // get user to check authentication
    const token = await getToken({ req })
    const userId = token?._id

    // get user to get course id list
    const user: IUser | null = await UserModel.findById(userId).select('courses').lean()

    // check if user is logged in
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 })
    }

    // user's course ids
    const userCourses = user.courses.map((course: any) => course.course)

    // get user's courses
    const courses: ICourse[] = await CourseModel.find({ _id: { $in: userCourses } }).lean()

    // return user's courses
    return NextResponse.json({ courses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
