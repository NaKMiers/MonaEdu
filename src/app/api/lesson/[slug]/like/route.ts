import { connectDatabase } from '@/config/database'
import LessonModel from '@/models/LessonModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, User
import '@/models/LessonModel'
import '@/models/UserModel'

// [PATCH]: /lesson/:id/like
export async function PATCH(req: NextRequest, { params: { slug: id } }: { params: { slug: string } }) {
  console.log('- Like Lesson -')

  try {
    // connect to database
    await connectDatabase()

    // get current user id
    const token = await getToken({ req })
    const userId = token?._id

    // get id and value to like to dislike
    const { value } = await req.json()

    // get user liked / disliked
    const user: IUser | null = await UserModel.findById(userId)
      .select('username avatar firstName lastName')
      .lean()

    // user does not exist
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 401 })
    }

    let updatedLesson: any = null
    if (value === 'y') {
      // like
      updatedLesson = await LessonModel.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { new: true }
      ).lean()
    } else if (value === 'n') {
      // dislike
      updatedLesson = await LessonModel.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      ).lean()
    }

    if (!updatedLesson) {
      return NextResponse.json({ message: 'Không tìm thấy bài giảng' }, { status: 404 })
    }

    // return response
    return NextResponse.json(
      {
        updatedLesson,
        message: `${value === 'y' ? 'Thích' : 'Bỏ thích'} thành công`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
