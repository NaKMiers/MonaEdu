import { connectDatabase } from '@/config/database'
import UserModel, { IUser } from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Models: User
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/user/:id
export async function GET(req: NextRequest, { params: { email } }: { params: { email: string } }) {
  console.log('- Find User -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const token = await getToken({ req })
    const curUserEmail = token?.email

    // check if curUserEmail = email
    if (curUserEmail === email) {
      return NextResponse.json(
        { message: 'Bạn không thể tặng khóa học cho chính mình' },
        { status: 401 }
      )
    }

    // get user by email
    let user: IUser | null = await UserModel.findOne({ email }).lean()

    // check if user exists
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy' }, { status: 404 })
    }

    // return user
    return NextResponse.json({ user, message: 'Lấy người dùng thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
