import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PATCH]: /user/change-banner
export async function PATCH(req: NextRequest) {
  console.log('- Change Banner -')

  try {
    // connect to database
    await connectDatabase()

    // get userId to update user
    const token = await getToken({ req })
    const userId = token?._id
    const oldBanner: string = token?.banner as string

    // get data to create product
    const formData = await req.formData()
    let banner = formData.get('banner')

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Người không tồn tại' }, { status: 401 })
    }

    // check banner
    if (!banner) {
      return NextResponse.json({ message: 'Không có hình ảnh tải lên' }, { status: 400 })
    }

    const promises: any[] = []

    // remove old banner
    if (oldBanner) {
      promises.push(deleteFile(oldBanner))
    }

    // upload banner and get imageUrl from AWS S3 Bucket
    promises.push(uploadFile(banner))

    // Execute all promises concurrently
    const [_, bannerUrl] = await Promise.all(promises)

    // update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { banner: bannerUrl } },
      { new: true }
    )

    // return response
    return NextResponse.json(
      {
        updatedUser,
        message: 'Cập nhật ảnh bìa thành công',
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
