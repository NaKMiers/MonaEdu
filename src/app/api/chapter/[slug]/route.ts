import { connectDatabase } from '@/config/database'
import ChapterModel, { IChapter } from '@/models/ChapterModel'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel, { ICourse } from '@/models/CourseModel'
import ProgressModel from '@/models/ProgressModel'

// Models: Course, Chapter, Lesson, Progress
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/LessonModel'
import '@/models/ProgressModel'

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
      return NextResponse.json({ message: 'Không tìm thấy khóa học' }, { status: 404 })
    }

    // get all chapters and lessons of course
    let [chapters, lessons, progresses]: any = await Promise.all([
      ChapterModel.find({
        courseId: course._id,
      }).lean(),
      LessonModel.find({
        courseId: course._id,
        active: true,
      }).lean(),
      ProgressModel.find({
        courseId: course._id,
      }),
    ])
    chapters = chapters.sort((a: IChapter, b: IChapter) => a.order - b.order)

    // // add lessons to each chapter
    // const chaptersWithLessons = chapters.map((chapter: IChapter) => {
    //   const chapterLessons = lessons.filter(
    //     (lesson: ILesson) => lesson.chapterId.toString() === chapter._id.toString()
    //   )
    //   return { ...chapter, lessons: chapterLessons }
    // })

    // add progress to each lessons and add lessons to each chapter
    const chaptersWithLessons = chapters.map((chapter: IChapter) => {
      const chapterLessons = lessons.filter(
        (lesson: ILesson) => lesson.chapterId.toString() === chapter._id.toString()
      )

      // add progress to each lesson
      const chapterLessonsWithProgress = chapterLessons.map((lesson: ILesson) => {
        const progress = progresses.find(
          (progress: any) => progress.lessonId.toString() === lesson._id.toString()
        )
        return { ...lesson, progress }
      })

      return { ...chapter, lessons: chapterLessonsWithProgress }
    })

    // return course
    return NextResponse.json({ chapters: chaptersWithLessons, courseId: course._id }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
