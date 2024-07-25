import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [POST]: /auth/register
export async function POST(req: NextRequest) {
  console.log('- Register -')

  try {
    // connect to database
    await connectDatabase()

    let { firstName, lastName, username, email, password } = await req.json()
    email = email.toLowerCase()

    // check if user is already exist in database
    const existingUser: any = await UserModel.findOne({
      $or: [{ email }, { username }],
    }).lean()

    // check if user is already exist in database
    if (existingUser) {
      return NextResponse.json({ message: 'Tên người dùng hoặc email không tồn tại' }, { status: 401 })
    }

    // create new user
    await UserModel.create({
      firstName,
      lastName,
      username,
      email,
      password,
    })

    // get registered user
    const registeredUser: any = await UserModel.findOne({ email }).lean()

    // exclude password from user object
    const { password: _, ...user } = registeredUser

    // return home page
    return NextResponse.json({ user, message: 'Đăng nhập thành công' }, { status: 200 })
  } catch (err) {
    return NextResponse.json(err, { status: 500 })
  }
}
