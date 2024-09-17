import { connectDatabase } from '@/config/database'
import NotificationModel from '@/models/NotificationModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Notification
import '@/models/NotificationModel'

export const dynamic = 'force-dynamic'

// [GET]: /notification/:userId
export async function GET(req: NextRequest) {
  console.log('- Get User Notifications -')

  try {
    // connect database
    await connectDatabase()

    // get userId to get notifications
    const token = await getToken({ req })
    const userId = token?._id

    // check if userId exists or not
    if (!userId) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 400 })
    }

    // get user notifications
    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 })

    // return response
    return NextResponse.json({ notifications }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
