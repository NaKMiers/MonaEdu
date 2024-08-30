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
    const courses: any[] = await Promise.all(
      Array.from({ length: 50 }).map(() =>
        CourseModel.aggregate([{ $sample: { size: 1 } }, { $project: { _id: 1 } }])
      )
    )
    await Promise.all(courses.map(c => CourseModel.findByIdAndUpdate(c[0]._id, { $inc: { joined: 1 } })))
    console.log('Increased Course Joined')

    // Increase "likes" of 500 random lessons
    const lessons: any[] = await Promise.all(
      Array.from({ length: 500 }).map(() =>
        LessonModel.aggregate([{ $sample: { size: 1 } }, { $project: { _id: 1 } }])
      )
    )

    await Promise.all(
      lessons.map(l => LessonModel.findByIdAndUpdate(l[0]._id, { $push: { likes: null } }))
    )
    console.log('Increased Lesson Likes')

    // ------------------------------

    // // create token
    // const newToken = jwt.sign({ key: process.env.JWT_SECRET! }, process.env.JWT_SECRET!)

    // // decode token
    // const decode = jwt.verify(newToken, process.env.JWT_SECRET!) as JwtPayload

    // console.log(newToken)
    // console.log(decode)

    // return response
    return NextResponse.json({ message: 'Increased' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
