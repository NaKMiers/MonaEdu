import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel, { ICourse } from '@/models/CourseModel'

// Models: Category, Course
import '@/models/CategoryModel'
import '@/models/CourseModel'
import { searchParamsToObject } from '@/utils/handleQuery'

// [GET]: /api/category/[slug]
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string[] } }) {
  console.log('- Get Category By Slug: ', slug.join('/'))

  try {
    // connect database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 16
    const filter: { [key: string]: any } = {}
    let sort: { [key: string]: any } = { createdAt: -1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        // Special Cases ---------------------
        if (key === 'limit') {
          if (params[key][0] === 'no-limit') {
            itemPerPage = Number.MAX_SAFE_INTEGER
            skip = 0
          } else {
            itemPerPage = +params[key][0]
          }
          continue
        }

        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['title', 'author', 'description', 'slug']

          filter.$or = searchFields.map(field => ({
            [field]: { $regex: params[key][0], $options: 'i' },
          }))
          continue
        }

        if (key === 'price') {
          const from = [params[key][0].split('-')[0]]
          const to = [params[key][0].split('-')[1]]
          if (from && to) {
            filter.price = {
              $gte: from,
              $lte: to,
            }
          } else if (from) {
            filter.price = {
              $gte: from,
            }
          } else if (to) {
            filter.price = {
              $lte: to,
            }
          }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get category by slug
    const category: ICategory | null = await CategoryModel.findOne({ slug: slug.join('/') }).lean()

    // check if category not found
    if (!category) {
      return NextResponse.json({ message: 'Không tìm thấy danh mục' }, { status: 404 })
    }

    // get subs categories & get all courses of current categories
    const [subs, courses] = await Promise.all([
      await CategoryModel.find({ parentId: category._id }).lean(),
      await CourseModel.find({ categories: category._id, ...filter })
        .sort(sort)
        .skip(skip)
        .limit(itemPerPage)
        .lean(),
    ])

    // get all order without filter
    const chops = await CourseModel.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$Price' },
          maxPrice: { $max: '$Price' },
        },
      },
    ])

    // return response
    return NextResponse.json({ category, subs, courses, chops }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
