import { connectDatabase } from '@/config/database'
import NotificationModel from '@/models/NotificationModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Notification
import '@/models/NotificationModel'

// [PATCH]: /notification/read
export async function PATCH(req: NextRequest) {
  console.log('- Read Notifications -')

  try {
    // connect to database
    await connectDatabase()

    // get notification ids to remove
    const { ids, status } = await req.json()

    console.log('ids:', ids)
    console.log('status:', status)

    // mark notification as read / unread
    await NotificationModel.updateMany({ _id: { $in: ids } }, { $set: { status } })

    // return response
    return NextResponse.json(
      { message: `Thông báo đã được ${status === 'read' ? 'đọc' : 'đánh dấu chưa đọc'}` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 })
  }
}
