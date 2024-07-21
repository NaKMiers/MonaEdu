import { connectDatabase } from '@/config/database'
import NotificationModel from '@/models/NotificationModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Notification
import '@/models/NotificationModel'

// [DELETE]: /notification/delete
export async function DELETE(req: NextRequest) {
  console.log('- Remove Notifications -')

  try {
    // connect to database
    await connectDatabase()

    // get notification ids to remove
    const { ids } = await req.json()

    // remove notifications
    await NotificationModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json({ message: 'Thông báo đã được xóa' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 })
  }
}
