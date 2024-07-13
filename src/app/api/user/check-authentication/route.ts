import { connectDatabase } from '@/config/database';
import UserModel from '@/models/UserModel';
import bcrypt from 'bcrypt';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Models: User
import '@/models/UserModel';

// [POST]: /user/:id/change-notification-setting
export async function POST(req: NextRequest) {
  console.log('- Check Authentication -');

  try {
    // connect to database
    await connectDatabase();

    // get user to check authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = token?._id;

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Xác thực thất bại' }, { status: 401 });
    }

    // get data from credentials
    const { password } = await req.json();

    // find user from database
    const user: any = await UserModel.findById(userId).lean();

    // check user exists or not in database
    if (!user) {
      return NextResponse.json({ message: 'Xác thực thất bại' }, { status: 401 });
    }

    // check if user is not local
    if (user.authType !== 'local') {
      return NextResponse.json(
        { message: 'Tài khoản này được xác thực bởi ' + user.authType },
        { status: 401 }
      );
    }

    // check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Sai mật khẩu!' }, { status: 401 });
    }

    // return response
    return NextResponse.json({ message: 'Xác thực thành công' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
