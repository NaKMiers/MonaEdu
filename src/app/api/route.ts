import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import QuestionModel from '@/models/QuestionModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Question, User
import '@/models/CourseModel'
import '@/models/QuestionModel'
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /
export async function GET(req: NextRequest) {
  console.log(' - Get Home Page - ')

  try {
    // connect to database
    await connectDatabase()

    // get courses
    const courses = await CourseModel.find({
      active: true,
    })
      .sort({
        joined: -1,
      })
      .limit(8)
      .lean()

    // top 10 best-seller categories

    // top 8 best-seller courses
    const bestSellers = courses.slice(0, 8)

    // top 1 student that spend most time of learning

    // top 1 student that joined most courses

    // top 1 student that completed most questions

    // top 1 student that asked most questions

    // top 1 student that commented most

    // top 1 student that liked most at comment

    // best questions
    const questions = await QuestionModel.find({
      status: 'open',
    })
      .populate('userId')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ courses, bestSellers, questions }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
