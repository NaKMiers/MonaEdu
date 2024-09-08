import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { deleteFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Chapter
import '@/models/ChapterModel'
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
    const lessons: ILesson[] = await LessonModel.find({ _id: { $in: ids } }).lean()

    // delete lessons from database
    await LessonModel.deleteMany({ _id: { $in: ids } })

    // delete all video and document files of lessons
    await Promise.all(
      lessons.map(async (lesson: any) => {
        if (lesson.sourceType === 'file') {
          await deleteFile(lesson.source)
        }

        if (lesson.docs.length) {
          await Promise.all(lesson.docs.map((doc: any) => deleteFile(doc.url)))
        }

        // decrease lesson quantity of chapter
        await ChapterModel.findByIdAndUpdate(lesson.chapterId, { $inc: { lessonQuantity: -1 } })
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
