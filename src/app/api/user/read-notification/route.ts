import { connectDatabase } from '@/config/database';
import UserModel from '@/models/UserModel';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Models: User
import '@/models/UserModel';

// [PATCH]: /user/read-notification
export async function PATCH(req: NextRequest) {
  console.log('- Read Notifications -');

  try {
    // connect to database
    await connectDatabase();

    // get notification ids to remove
    const { ids, value } = await req.json();

    // get user id to remove notification
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = token?._id;

    // remove notification
    await UserModel.updateOne(
      { _id: userId },
      { $set: { 'notifications.$[elem].status': value ? 'read' : 'unread' } },
      { arrayFilters: [{ 'elem._id': { $in: ids } }] }
    );

    // return response
    return NextResponse.json(
      { message: `Thông báo đã được ${value ? 'đọc' : 'đánh dấu chưa đọc'}` },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
