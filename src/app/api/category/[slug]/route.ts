import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel, { ICourse } from '@/models/CourseModel'

// Models: Category, Course
import '@/models/CategoryModel'
import '@/models/CourseModel'

// [GET]: /api/category/[slug]
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Category By Slug: ', slug)

  try {
    // connect database
    await connectDatabase()

    // get category by slug
    const category: ICategory | null = await CategoryModel.findOne({ slug }).lean()

    // check if category not found
    if (!category) {
      return NextResponse.json({ message: 'Không tìm thấy danh mục' }, { status: 404 })
    }

    // get subs categories & get all courses of current categories
    const [subs, courses] = await Promise.all([
      await CategoryModel.find({ parentId: category._id }).lean(),
      await CourseModel.find({})
        .populate({
          path: 'categories',
          select: 'title slug',
        })
        .lean(),
    ])

    // return response
    return NextResponse.json({ category, subs, courses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
