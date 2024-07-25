import { connectDatabase } from '@/config/database'
import CommentModel, { IComment } from '@/models/CommentModel'
import NotificationModel from '@/models/NotificationModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getUserName } from '@/utils/string'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Comment, User, Notification
import '@/models/CommentModel'
import '@/models/NotificationModel'
import '@/models/UserModel'

// [POST]: /comment/add
export async function POST(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Reply Comment - ')

  try {
    // connect to database
    await connectDatabase()

    // get user id to add comment
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // get content to add comment
    const { content } = await req.json()

    // get user commented
    const user: IUser | null = await UserModel.findById(userId).lean()

    // user does not exist
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 401 })
    }

    // check if user is allowed to comment
    if (user.blockStatuses.blockedComment) {
      return NextResponse.json({ message: 'Bạn không được phép bình luận' }, { status: 403 })
    }

    // check if parent comment id or content is empty
    if (!id || !content) {
      // return error
      return NextResponse.json({ message: 'Nội dung không hợp lệ' }, { status: 400 })
    }

    // create new comment
    const newComment = await CommentModel.create({
      userId,
      content: content.trim(),
    })

    // add new comment to parent comment
    const parentComment: IComment | null = await CommentModel.findByIdAndUpdate(
      id,
      { $push: { replied: newComment._id } },
      { new: true }
    )
      .populate('userId', 'username avatar firstName lastName')
      .lean()

    // parent comment not found
    if (!parentComment) {
      return NextResponse.json({ message: 'Không tìm thấy bình luận' }, { status: 404 })
    }

    // notify user
    await NotificationModel.create({
      userId: parentComment?.userId,
      title: getUserName(user) + ' đã trả lời bình luận của bạn',
      image: user.avatar,
      type: 'replied-comment',
    })

    // return new comment
    return NextResponse.json(
      { newComment, parentComment, message: 'Trả lời bình luận thành công!' },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
