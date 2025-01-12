import { connectDatabase } from '@/config/database'
import UserModel, { IUser } from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Course
import '@/models/UserModel'
import '@/models/CourseModel'

// [GET]: /admin/user/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get User -')

  try {
    // connect to database
    await connectDatabase()

    console.log('user id', id)

    // get user
    const user: IUser | null = await UserModel.findById(id)
      .populate({ path: 'courses.course', select: 'title slug' })
      .lean()

    // check if user not found
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // return response
    return NextResponse.json({ user }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
