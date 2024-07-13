import { connectDatabase } from '@/config/database';
import UserModel from '@/models/UserModel';
import { deleteFile, uploadFile } from '@/utils/uploadFile';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Models: User
import '@/models/UserModel';

// [PATCH]: /user/change-banner
export async function PATCH(req: NextRequest) {
  console.log('- Change Banner -');

  try {
    // connect to database
    await connectDatabase();

    // get userId to update user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
    const userId = token?._id;
    const oldBanner: string = token?.banner as string;

    // get data to create product
    const formData = await req.formData();
    let banner = formData.get('banner');

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Người không tồn tại' }, { status: 401 });
    }

    // check banner
    if (!banner) {
      return NextResponse.json({ message: 'Không có hình ảnh tải lên' }, { status: 400 });
    }

    // remove old banner
    if (oldBanner) {
      await deleteFile(oldBanner);
    }

    // upload banner and get imageUrl from AWS S3 Bucket
    const bannerUrl = await uploadFile(banner);

    // update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { banner: bannerUrl } },
      { new: true }
    );

    // return reponse
    return NextResponse.json(
      {
        updatedUser,
        message: 'Cập nhật ảnh bìa thành công, vui lòng tải lại trang để xem thay đổi',
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
