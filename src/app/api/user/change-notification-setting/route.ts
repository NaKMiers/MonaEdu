import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PATCH]: /user/:id/change-notification-setting
export async function PATCH(req: NextRequest) {
  console.log('- Change Notification Setting -')

  try {
    // connect to database
    await connectDatabase()

    // get user to update
    const token = await getToken({ req })
    const userId = token?._id

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Xác thực thất bại' }, { status: 401 })
    }

    // get data to change notification setting
    const { type, value } = await req.json()

    // update user notification setting
    const field = `notificationSettings.${type}`

    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        [field]: value,
      },
    })

    // return responseO
    return NextResponse.json({ value, message: 'Đã thay đổi cài đặt thông báo' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
