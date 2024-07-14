import { connectDatabase } from '@/config/database'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { generateSlug } from '@/utils'
import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Order
import CourseModel from '@/models/CourseModel'
import '@/models/LessonModel'
import '@/models/OrderModel'

// [PUT]: /lesson/:chapterId/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Lesson -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create lesson
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { courseId, chapterId, title, description, duration, active, status, embedUrl } = data
    let file = formData.get('file')

    // get course from database to edit
    const lesson: ILesson | null = await LessonModel.findById(id).lean()

    // course does exist
    if (!lesson) {
      return NextResponse.json({ message: 'Lesson does not exist' }, { status: 404 })
    }

    let newSource: string = ''
    // delete the file do not associated with the lesson in cloud
    if (file || embedUrl) {
      if (lesson.sourceType === 'file') {
        await deleteFile(lesson.source)
      }

      if (embedUrl) {
        newSource = embedUrl as string
      } else if (file) {
        newSource = await uploadFile(file, '16:9', 'video')
      }
    }

    // update lesson in database
    await LessonModel.findByIdAndUpdate(lesson._id, {
      $set: {
        courseId,
        chapterId,
        title,
        duration,
        sourceType: embedUrl ? 'embed' : file ? 'file' : lesson.sourceType,
        source: newSource,
        description,
        active,
        status,
        slug: generateSlug(title as string),
      },
    })

    // update total duration of course
    await CourseModel.findByIdAndUpdate(courseId, {
      $inc: { duration: +duration - lesson.duration },
    })

    // return response
    return NextResponse.json({ message: 'Edit lesson successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
