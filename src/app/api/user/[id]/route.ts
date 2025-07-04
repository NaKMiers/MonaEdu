import { connectDatabase } from '@/config/database'
import UserModel, { IUser } from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Course
import '@/models/CourseModel'
import '@/models/UserModel'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

// [GET]: /api/user/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get User -')

  try {
    // connect to database
    await connectDatabase()

    // get user by id
    let user: IUser | null = await UserModel.findOne({
      $or: [{ username: id }, { email: id }],
    })
      .populate({
        path: 'courses.course',
      })
      .populate('gifts')
      .lean()

    // check if user exists
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 })
    }

    // return user
    return NextResponse.json({ user, message: 'Lấy người dùng thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
