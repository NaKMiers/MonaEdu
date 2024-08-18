import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import ChapterModel from '@/models/ChapterModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import LessonModel from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Tag, Category, FlashSale, Chapter, Lesson,
import '@/models/CategoryModel'
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'
import '@/models/LessonModel'
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /course/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Course Page -')

  try {
    // connect to database
    await connectDatabase()

    // get course from database
    const course: ICourse | null = await CourseModel.findOne({
      slug: encodeURIComponent(slug),
      active: true,
    })
      .populate('tags category flashSale')
      .lean()

    // check if course is not found
    if (!course) {
      return NextResponse.json({ message: 'Không tìm thấy khóa học' }, { status: 404 })
    }

    // get related courses of this courses
    const cate = (course.category as ICategory).slug.split('/')[0]

    // Check if 'cates' is not empty
    const categoryIds: any = await CategoryModel.find({
      slug: { $regex: cate, $options: 'i' },
    }).distinct('_id')

    // get all chapters and lessons of course
    const [chapters, lessons, relatedCourses] = await Promise.all([
      ChapterModel.find({
        courseId: course._id,
      })
        .sort({ order: 1 })
        .lean(),

      LessonModel.find({
        courseId: course._id,
        active: true,
      }).lean(),

      CourseModel.find({
        active: true,
        category: { $in: categoryIds },
        _id: { $ne: course._id },
      })
        .populate('category')
        .limit(8)
        .lean(),
    ])

    // add lessons to each chapter
    const chaptersWithLessons = chapters.map((chapter: any) => {
      const chapterLessons = lessons.filter(
        lesson => lesson.chapterId.toString() === chapter._id.toString()
      )
      return { ...chapter, lessons: chapterLessons }
    })

    // check if suggestedCourses less than 8
    if (relatedCourses.length < 8) {
      console.log('moreCourses')
      const moreCourses: ICourse[] = await CourseModel.find({
        _id: {
          $nin: [course._id, ...relatedCourses.map(course => course._id)],
        },
        active: true,
      })
        .populate({
          path: 'category',
          select: 'title slug',
        })
        .limit(8 - relatedCourses.length)
        .sort({ joined: -1 })
        .lean()

      relatedCourses.push(...moreCourses)
    }

    // return course with chapters and lessons
    return NextResponse.json({ course, chapters: chaptersWithLessons, relatedCourses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
