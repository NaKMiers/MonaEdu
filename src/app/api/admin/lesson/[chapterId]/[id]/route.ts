import { connectDatabase } from '@/config/database'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { getFileUrl } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Chapter, Course
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/LessonModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/lesson/:chapterId/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Lesson By ID - ')

  try {
    // connect to database
    await connectDatabase()

    // get lesson
    const lesson: ILesson | null = await LessonModel.findById(id)
      .populate({
        path: 'courseId',
        select: 'title',
      })
      .populate({
        path: 'chapterId',
        select: 'title',
      })
      .lean()

    // check if lesson exists
    if (!lesson) {
      return NextResponse.json({ message: 'Lesson not found' }, { status: 404 })
    }

    // get signed url of video source
    if (lesson.sourceType === 'file') {
      lesson.source = await getFileUrl(lesson.source)
    }

    // return lesson
    return NextResponse.json({ lesson }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
