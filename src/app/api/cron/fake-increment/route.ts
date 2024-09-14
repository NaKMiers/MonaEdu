import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import LessonModel from '@/models/LessonModel'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Lesson
import '@/models/CourseModel'
import '@/models/LessonModel'

export const dynamic = 'force-dynamic'

// [GET]: /cron/increase-joined
export async function GET(req: NextRequest) {
  console.log('- Fake Increment -')

  try {
    // connect to database
    await connectDatabase()

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

    // Increase "joined" of 50 random courses
    const courses = await CourseModel.aggregate([{ $sample: { size: 50 } }, { $project: { _id: 1 } }])
    await CourseModel.updateMany({ _id: { $in: courses.map(c => c._id) } }, { $inc: { joined: 1 } })

    // Increase "likes" of 500 random lessons
    const lessons = await LessonModel.aggregate([{ $sample: { size: 500 } }, { $project: { _id: 1 } }])
    await LessonModel.updateMany({ _id: { $in: lessons.map(l => l._id) } }, { $push: { likes: null } })

    // ------------------------------

    // // create token
    // const newToken = jwt.sign({ key: process.env.JWT_SECRET! }, process.env.JWT_SECRET!)

    // // decode token
    // const decode = jwt.verify(newToken, process.env.JWT_SECRET!) as JwtPayload

    // console.log(newToken)
    // console.log(decode)

    // return response
    return NextResponse.json({ message: 'Increased', courses, lessons }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
