import { connectDatabase } from '@/config/database'
import ChapterModel, { IChapter } from '@/models/ChapterModel'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel, { ICourse } from '@/models/CourseModel'

// Models: Course, Chapter, Lesson
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/LessonModel'

export const dynamic = 'force-dynamic'

// [GET]: /course/learning/:courseId
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Chapters Learning - ')

  try {
    // connect to database
    await connectDatabase()

    // get course from database
    const course: ICourse | null = await CourseModel.findOne({ slug }).lean()

    // check course
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    // get all chapters and lessons of course
    let chapters: IChapter[] = await ChapterModel.find({ courseId: course._id }).lean()
    const lessons: ILesson[] = await LessonModel.find({ courseId: course._id }).lean()

    chapters = chapters.sort((a, b) => a.order - b.order)

    // add lessons to each chapter
    const chaptersWithLessons = chapters.map(chapter => {
      const chapterLessons = lessons.filter(
        lesson => lesson.chapterId.toString() === chapter._id.toString()
      )
      return { ...chapter, lessons: chapterLessons }
    })

    // return course
    return NextResponse.json({ chapters: chaptersWithLessons, courseId: course._id }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
