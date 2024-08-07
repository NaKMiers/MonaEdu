import { connectDatabase } from '@/config/database'
import LessonModel from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson
import '@/models/LessonModel'

// [PATCH]: /admin/lesson/activate
export async function PATCH(req: NextRequest) {
  console.log('- Activate Lessons - ')

  try {
    // connect to database
    await connectDatabase()

    // get lesson id to delete
    const { ids, value } = await req.json()

    const [lessons] = await Promise.all([
      // get lessons from database
      LessonModel.find({ _id: { $in: ids } }).lean(),

      // update lessons from database
      LessonModel.updateMany({ _id: { $in: ids } }, { $set: { active: value || false } }),
    ])

    if (!lessons.length) {
      throw new Error('No lesson found')
    }

    // return response
    return NextResponse.json(
      {
        updatedLessons: lessons,
        message: `${lessons.length} lesson${lessons.length > 1 ? 's' : ''} ${
          lessons.length > 1 ? 'have' : 'has'
        } been ${value ? 'activated' : 'deactivated'}`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
