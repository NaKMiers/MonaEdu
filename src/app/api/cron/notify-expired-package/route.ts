import { connectDatabase } from '@/config/database'
import UserModel, { IUser } from '@/models/UserModel'
import jwt, { JwtPayload } from 'jsonwebtoken'
import momentTZ from 'moment-timezone'
import { NextRequest, NextResponse } from 'next/server'
import { format, register } from 'timeago.js'
import vi from 'timeago.js/lib/lang/vi'
register('vi', vi)

// Models: User
import CategoryModel from '@/models/CategoryModel'
import ChapterModel from '@/models/ChapterModel'
import CourseModel from '@/models/CourseModel'
import LessonModel from '@/models/LessonModel'
import '@/models/UserModel'
import { removeDiacritics } from '@/utils'
import { notifyExpiredPackage } from '@/utils/sendMail'

export const dynamic = 'force-dynamic'

// [GET]: /cron/notify-expired-package
export async function GET(req: NextRequest) {
  console.log('- Notify Expired Package -')

  try {
    // connect to database
    await connectDatabase()

    const categories = await CategoryModel.find().select('title').lean()
    const courses = await CourseModel.find().select('title').lean()
    const chapters = await ChapterModel.find().select('title').lean()
    const lessons = await LessonModel.find().select('title').lean()

    await Promise.all(
      categories.map(async (item: any) => {
        await CategoryModel.updateOne(
          { _id: item._id },
          { $set: { titleNoDiacritics: removeDiacritics(item.title) } }
        )
      })
    )

    await Promise.all(
      courses.map(async (item: any) => {
        await CourseModel.updateOne(
          { _id: item._id },
          { $set: { titleNoDiacritics: removeDiacritics(item.title) } }
        )
      })
    )

    await Promise.all(
      chapters.map(async (item: any) => {
        await ChapterModel.updateOne(
          { _id: item._id },
          { $set: { titleNoDiacritics: removeDiacritics(item.title) } }
        )
      })
    )

    await Promise.all(
      lessons.map(async (item: any) => {
        await LessonModel.updateOne(
          { _id: item._id },
          { $set: { titleNoDiacritics: removeDiacritics(item.title) } }
        )
      })
    )

    // get token from query
    const searchParams = req.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    if (!decode || decode.key !== process.env.JWT_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const now = momentTZ.tz(new Date(), 'Asia/Ho_Chi_Minh').toDate()
    const twelveHoursAgo = momentTZ.tz(now, 'Asia/Ho_Chi_Minh').add(12, 'hours').toDate()
    const twentyFourHoursAgo = momentTZ.tz(now, 'Asia/Ho_Chi_Minh').add(24, 'hours').toDate()

    console.log('twentyFourHoursAgo:', twentyFourHoursAgo)
    console.log('twelveHoursAgo:', twelveHoursAgo)

    // get all users have expired monthly package
    const users: IUser[] = await UserModel.find({
      'package.expire': { $gt: twelveHoursAgo, $lte: twentyFourHoursAgo }, // (12, 24h]
    }).lean()

    await Promise.all(
      users.map(async (user: any) => {
        let remainingTime = format(user.package.expire, 'vi')

        const { _id, username, email, firstName, nickname, lastName, package: pkg } = user

        const data = {
          _id,
          username,
          email,
          firstName,
          nickname,
          lastName,
          package: pkg,
          remainingTime,
        }

        await notifyExpiredPackage(user.email, data)
      })
    )

    // return response
    return NextResponse.json({ message: 'Notified' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
