import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category
import '@/models/CategoryModel'
import '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /
export async function GET(req: NextRequest) {
  console.log(' - Get Home Page - ')

  try {
    // connect to database
    await connectDatabase()

    const [courses, bestSellers, newCourses, bootedCourses] = await Promise.all([
      // get courses
      CourseModel.find({
        active: true,
        booted: true,
      })
        .sort({
          joined: -1,
        })
        .limit(8)
        .lean(),

      // get best sellers
      CourseModel.find().sort({ joined: -1 }).limit(8).lean(),

      // get new courses
      CourseModel.find().sort({ createdAt: -1 }).limit(8).lean(),

      // get booted courses
      CourseModel.find({ booted: true }).populate({
        path: 'category',
        select: 'title slug',
      }),
    ])

    // categories's slugs from booted courses
    const categoriesFromBootedCourses = bootedCourses.map(course => course.category.slug.split('/')[0])

    // get categories from booted courses
    const categories = await CategoryModel.find({
      slug: { $in: categoriesFromBootedCourses },
      parentId: null,
    })
      .select('title slug')
      .lean()

    // group booted courses by category
    const groupedBootedCourses = categories.map(category => {
      const courses = bootedCourses.filter(course => course.category.slug.includes(category.slug))

      return {
        category,
        courses,
      }
    })

    // return response
    return NextResponse.json({ courses, bestSellers, newCourses, groupedBootedCourses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
