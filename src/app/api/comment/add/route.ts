import { connectDatabase } from '@/config/database'
import CommentModel from '@/models/CommentModel'
import LessonModel from '@/models/LessonModel'
import QuestionModel, { IQuestion } from '@/models/QuestionModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getUserName } from '@/utils/string'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Comment, Question, User, Lesson
import '@/models/CommentModel'
import '@/models/LessonModel'
import '@/models/QuestionModel'
import '@/models/UserModel'

// [POST]: /comment/add
export async function POST(req: NextRequest) {
  console.log('- Add Comment - ')

  try {
    // connect to database
    await connectDatabase()

    // get user id to add comment
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET!,
    })
    const userId = token?._id

    // get product id and content to add comment
    const { questionId, lessonId, content } = await req.json()

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

    // check if productId or content is empty
    if ((!questionId && !lessonId) || !content) {
      // return error
      return NextResponse.json({ message: 'Nội dung không hợp lệ' }, { status: 400 })
    }

    // create new comment
    const comment = new CommentModel({
      userId,
      questionId,
      lessonId,
      content: content.trim(),
    })

    // save new comment to database
    await comment.save()

    // if user comment on question
    if (questionId) {
      const [_, question] = await Promise.all([
        // increase comment amount in question
        QuestionModel.findByIdAndUpdate(questionId, {
          $inc: { commentAmount: 1 },
        }),
        QuestionModel.findById(questionId).select('userId slug').lean(),
      ])

      if (!question) {
        return NextResponse.json({ message: 'Không tìm thấy câu hỏi' }, { status: 404 })
      }

      // notify user
      await UserModel.findByIdAndUpdate((question as IQuestion).userId, {
        $push: {
          notifications: {
            _id: new Date().getTime(),
            title: getUserName(user) + ' đã trả lời bình luận của bạn',
            image: user.avatar,
            link: `/question/${(question as IQuestion).slug}`,
            type: 'comment-question',
            status: 'unread',
          },
        },
      })
    }

    // if user comment on lesson
    if (lessonId) {
      // increase comment amount in lesson
      await LessonModel.findByIdAndUpdate(lessonId, {
        $inc: { commentAmount: 1 },
      })
    }

    // return new comment
    return NextResponse.json({ newComment: comment, message: 'Bình luận thành công!' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
