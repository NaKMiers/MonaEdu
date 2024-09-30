import { connectDatabase } from '@/config/database'
import { NextRequest, NextResponse } from 'next/server'

import CourseModel, { ICourse } from '@/models/CourseModel'
import UserModel, { IUser } from '@/models/UserModel'

// Models: User, Course
import '@/models/CourseModel'
import '@/models/UserModel'
import { getUserName } from '@/utils/string'

// [PATCH]: /admin/user/:id/revoke-course
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Revoke Course -')

  try {
    // connect to the database
    await connectDatabase()

    // get course id from request to revoke from user courses
    const { courseId } = await req.json()

    console.log('courseId:', courseId)

    // get course
    const course: ICourse | null = await CourseModel.findById(courseId).select('title').lean()

    console.log('course:', course)

    // check if course exists
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    // revoke course from user courses
    const updatedUser: IUser | null = await UserModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          courses: { course: courseId },
        },
      },
      { new: true }
    )

    // check if user exists
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // return response
    return NextResponse.json(
      {
        updatedUser,
        message: `Course "${course.title}" has been revokes from ${getUserName(updatedUser)}'s courses`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
