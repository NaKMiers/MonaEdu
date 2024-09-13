import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { generateSlug, removeDiacritics } from '@/utils'
import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Course
import '@/models/CourseModel'
import '@/models/LessonModel'

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
    const originalDocs = JSON.parse(data.originalDocs as string)
    let docs: any[] = formData.getAll('docs')
    let customDocs: any[] = JSON.parse(data.customDocs as string)

    // get lesson from database to edit
    const lesson: ILesson | null = await LessonModel.findById(id).lean()

    // lesson does not exist
    if (!lesson) {
      return NextResponse.json({ message: 'Lesson does not exist' }, { status: 404 })
    }

    let newSource: string = lesson.source

    // delete the file do not associated with the lesson in cloud
    if (file || embedUrl) {
      if (lesson.sourceType === 'file') {
        const [newSrc] = await Promise.all([
          uploadFile(file, '16:9', 'video'),
          deleteFile(lesson.source),
        ])

        if (newSrc) {
          newSource = newSrc as string
        }
      }

      if (embedUrl) {
        newSource = embedUrl as string
      }
    }

    // upload docs to aws s3
    docs = await Promise.all(
      docs.map(async (doc: any) => {
        const url = await uploadFile(doc, 'auto', 'doc')
        return { name: doc.name, url, size: doc.size }
      })
    )

    const stayDocs = lesson.docs.filter(doc => originalDocs.map((d: any) => d.url).includes(doc.url))
    const needToRemovedDocs = lesson.docs.filter(
      doc => !originalDocs.map((d: any) => d.url).includes(doc.url)
    )

    // delete the docs do not associated with the lesson in aws s3
    if (needToRemovedDocs && !!needToRemovedDocs.length) {
      await Promise.all(needToRemovedDocs.map(doc => deleteFile(doc.url)))
    }

    // merge the available docs and new upload docs
    const newDocs = Array.from(new Set([...stayDocs, ...docs, ...customDocs]))

    await Promise.all([
      // update lesson in database
      await LessonModel.findByIdAndUpdate(lesson._id, {
        $set: {
          courseId,
          chapterId,
          title,
          titleNoDiacritics: removeDiacritics(title as string),
          duration,
          sourceType: embedUrl ? 'embed' : file ? 'file' : lesson.sourceType,
          source: newSource,
          docs: newDocs,
          description,
          active,
          status,
          slug: generateSlug(title as string),
        },
      }),

      // update total duration of course
      await CourseModel.findByIdAndUpdate(courseId, {
        $inc: { duration: +duration - lesson.duration },
      }),
    ])

    // return response
    return NextResponse.json({ message: 'Edit lesson successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
