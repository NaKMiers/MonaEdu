import { connectDatabase } from '@/config/database'
import LessonModel from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson
import '@/models/LessonModel'

// [PATCH]: /admin/lesson/status
export async function PATCH(req: NextRequest) {
  console.log('- Change Lesson Status -')

  try {
    // connect to database
    await connectDatabase()

    // get lesson ids and status
    const { ids, status } = await req.json()

    const [lessons] = await Promise.all([
      // get lessons from database
      LessonModel.find({ _id: { $in: ids } }).lean(),

      // update lessons from database
      LessonModel.updateMany({ _id: { $in: ids } }, { status }),
    ])

    // return response
    return NextResponse.json(
      {
        updatedLessons: lessons,
        message: `${lessons.length} lesson${lessons.length > 1 ? 's' : ''} ${
          lessons.length > 1 ? 'have' : 'has'
        } been made ${status}`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
