import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import CourseModel from '@/models/CourseModel'
import LessonModel from '@/models/LessonModel'
import NotificationModel from '@/models/NotificationModel'
import UserModel from '@/models/UserModel'
import { uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Course, Chapter, User, Notification
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/LessonModel'
import '@/models/NotificationModel'
import '@/models/UserModel'
import { generateSlug } from '@/utils'

// [POST]: /admin/lesson/add
export async function POST(
  req: NextRequest,
  { params: { chapterId } }: { params: { chapterId: string } }
) {
  console.log('- Add Lesson - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to create lesson
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { courseId, title, description, duration, active, status, embedUrl } = data
    let file = formData.get('file')
    let docs: any[] = formData.getAll('docs')
    let customDocs: any[] = JSON.parse(data.customDocs as string)

    if (!file && !embedUrl && !docs.length && !customDocs.length) {
      return NextResponse.json({ message: 'Source or Embed or Document is required' }, { status: 400 })
    }

    // check if new lesson is duplicate with another lesson (title, slug) in them same course

    const isDuplicateLesson = await LessonModel.findOne({
      courseId,
      $or: [{ title }, { slug: generateSlug(title as string) }],
    })
    if (isDuplicateLesson) {
      return NextResponse.json({ message: 'Lesson title is duplicated' }, { status: 400 })
    }

    // check file
    let source: string = ''
    if (embedUrl) {
      source = embedUrl as string
    } else if (file) {
      source = await uploadFile(file, '16:9', 'video')
    }

    // check docs
    if (docs.length) {
      docs = await Promise.all(
        docs.map(async (doc: any) => {
          const url = await uploadFile(doc, 'auto', 'doc')
          return { name: doc.name, url, size: doc.size }
        })
      )
    }

    if (customDocs.length) {
      docs = [...docs, ...customDocs]
    }

    // get all users who joined the course | course slug
    const [newLesson, userIds, courseSlug] = await Promise.all([
      // create new lesson
      LessonModel.create({
        courseId,
        chapterId,
        title,
        duration,
        sourceType: embedUrl ? 'embed' : file ? 'file' : 'none',
        docs: docs.length ? docs : [],
        source,
        description,
        active,
        status,
      }),

      // get all users who joined the course
      UserModel.find({ 'courses.course': courseId }).distinct('_id'),

      // course slug
      CourseModel.findById(courseId).distinct('slug'),
    ])

    // notify to all users who joined course | update total duration of course | increase lesson quantity in chapter
    await Promise.all([
      // notify to all users who joined course
      NotificationModel.insertMany(
        userIds.map(userId => ({
          userId,
          title: 'Bài học mới: ' + title,
          image: '/images/logo.png',
          link: `/learning/${courseSlug}/${newLesson.slug}`,
          type: 'new-lesson',
        }))
      ),

      // update total duration of course
      CourseModel.findByIdAndUpdate(courseId, { $inc: { duration } }),

      // increase lesson quantity in chapter
      ChapterModel.findByIdAndUpdate(chapterId, { $inc: { lessonQuantity: 1 } }),
    ])

    // return response
    return NextResponse.json({ message: 'Add lesson successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
