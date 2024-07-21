import { connectDatabase } from '@/config/database'
import QuestionModel from '@/models/QuestionModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getUserName } from '@/utils/string'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Question, User, Notification
import '@/models/NotificationModel'
import NotificationModel from '@/models/NotificationModel'
import '@/models/QuestionModel'
import '@/models/UserModel'

// [PATCH]: /Question/:id/like
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Like Question -')

  try {
    // connect to database
    await connectDatabase()

    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
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

    let updatedQuestion: any = null
    if (!value) {
      // like
      updatedQuestion = await QuestionModel.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { new: true }
      ).lean()
    } else {
      // dislike
      updatedQuestion = await QuestionModel.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      ).lean()
    }

    if (!updatedQuestion) {
      return NextResponse.json({ message: 'Không tìm thấy câu hỏi' }, { status: 404 })
    }

    // notify user only if like
    if (!value && updatedQuestion.userId !== userId) {
      await NotificationModel.create({
        userId: updatedQuestion.userId,
        title: getUserName(user) + ' đã thích câu hỏi của bạn',
        image: user.avatar,
        type: 'emotion-question',
      })
    }

    // return response
    return NextResponse.json(
      {
        updatedQuestion,
        message: `Câu hỏi đã được ${!value ? 'thích' : 'bỏ thích'}`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
