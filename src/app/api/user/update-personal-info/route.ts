import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PUT]: /user/update-personal-info
export async function PUT(req: NextRequest) {
  console.log('- Update Personal Information -')

  try {
    // connect to database
    await connectDatabase()

    // get user to check authentication
    const token = await getToken({ req })
    const userId = token?._id

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Xác thực thất bại' }, { status: 401 })
    }

    // get data to update personal info
    const { firstName, lastName, birthday, job, bio, gender } = await req.json()

    // update personal info
    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        firstName,
        lastName,
        birthday,
        job,
        bio,
        gender,
      },
    })

    // return response
    return NextResponse.json({ message: 'Đã cập nhật thông thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
