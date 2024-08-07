import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PATCH]: /user/change-avatar
export async function PATCH(req: NextRequest) {
  console.log('- Change Avatar -')

  try {
    // connect to database
    await connectDatabase()

    // get userId to update user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const userId = token?._id
    const oldAvatar: string = token?.avatar as string

    // get data to create product
    const formData = await req.formData()
    let avatar = formData.get('avatar')

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 401 })
    }

    // check avatar
    if (!avatar) {
      return NextResponse.json({ message: 'Vui lòng tải ảnh lên' }, { status: 400 })
    }

    const [avatarUrl] = await Promise.all([uploadFile(avatar, '1:1'), deleteFile(oldAvatar)])

    // update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { avatar: avatarUrl } },
      { new: true }
    )

    // return response
    return NextResponse.json(
      {
        updatedUser,
        message: 'Đổi ảnh đại diện thành công',
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
