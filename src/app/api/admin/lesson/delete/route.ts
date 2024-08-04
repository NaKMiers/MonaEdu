import { connectDatabase } from '@/config/database'
import LessonModel from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'
import { deleteFile } from '@/utils/uploadFile'

// Models: Lesson, Course
import '@/models/CourseModel'
import '@/models/LessonModel'

// [DELETE]: /admin/lesson/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Lessons - ')

  try {
    // connect to database
    await connectDatabase()

    // get lesson ids to delete
    const { ids } = await req.json()

    // get lessons from database
    const lessons = await LessonModel.find({ _id: { $in: ids } }).lean()

    // delete lessons from database
    await LessonModel.deleteMany({ _id: { $in: ids } }), console.log('lessons', lessons)

    // delete all video and document files of lessons
    await Promise.all(
      lessons.map(async (lesson: any) => {
        if (lesson.sourceType === 'file') {
          await deleteFile(lesson.source)
        }

        if (lesson.docs.length) {
          await Promise.all(lesson.docs.map((doc: any) => deleteFile(doc.url)))
        }
      })
    )

    // return response
    return NextResponse.json(
      {
        deletedLessons: lessons,
        message: `${lessons.length} lesson${lessons.length > 1 ? 's' : ''} ${
          lessons.length > 1 ? 'have' : 'has'
        } been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
