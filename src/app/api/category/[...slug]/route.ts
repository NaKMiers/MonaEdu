import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category, Course
import '@/models/CategoryModel'
import '@/models/CourseModel'
import { searchParamsToObject } from '@/utils/handleQuery'

// [GET]: /api/category/[slug]
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string[] } }) {
  console.log('- Get Category By Slug -')

  try {
    // connect database
    await connectDatabase()

    // get category by slug
    const category: ICategory | null = await CategoryModel.findOne({
      slug: slug.join('/'),
    }).lean()

    // check if category not found
    if (!category) {
      return NextResponse.json({ message: 'Không tìm thấy danh mục' }, { status: 404 })
    }

    // get category ids
    const categoryIds: any = await CategoryModel.find({
      slug: { $regex: category.slug, $options: 'i' },
    }).select('_id')

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 16
    const filter: { [key: string]: any } = {
      category: { $in: categoryIds },
      active: true,
    }
    let sort: { [key: string]: any } = {} // default sort

    // build filter & sort
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
          const from = +params[key][0].split('-')[0]
          const to = +params[key][0].split('-')[1]
          if (from >= 0 && to >= 0) {
            filter[key] = {
              $gte: from,
              $lte: to,
            }
          } else if (from >= 0) {
            filter[key] = {
              $gte: from,
            }
          } else if (to >= 0) {
            filter[key] = {
              $lte: to,
            }
          }
          continue
        }

        if (key === 'duration') {
          const from = +params[key][0].split('-')[0] * 3600
          const to = +params[key][0].split('-')[1] * 3600
          if (from >= 0 && to >= 0) {
            filter[key] = {
              $gte: from,
              $lte: to,
            }
          } else if (from >= 0) {
            filter[key] = {
              $gte: from,
            }
          } else if (to >= 0) {
            filter[key] = {
              $lte: to,
            }
          }
          continue
        }

        if (['sortPrice', 'sortDuration'].includes(key)) {
          const newKey = key.split('sort')[1].toLowerCase()
          sort[newKey] = params[key][0] === 'asc' ? 1 : -1
          continue
        }

        // Special Sort Cases ---------------------
        if (key === 'sort') {
          if (params[key][0] === 'popular') {
            sort.joined = -1
            continue
          }

          if (params[key][0] === 'newest') {
            sort.createdAt = -1
            continue
          }

          if (params[key][0] === 'oldest') {
            sort.createdAt = 1
            continue
          }

          if (params[key][0] === 'most-favorite') {
            sort.createdAt = -1
            sort = { likesCount: -1 }
            continue
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get subs categories,  get all courses of current categories, get chops
    const [subs, courses, amount, chops] = await Promise.all([
      // get all sub categories
      CategoryModel.find({ parentId: category._id }).lean(),

      // get all courses of current categories
      CourseModel.aggregate([
        { $match: filter },
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: sort },
        { $skip: skip },
        { $limit: itemPerPage },
      ]).exec(),

      // get amount of courses
      await CourseModel.countDocuments(filter),

      // get all order without filter
      CourseModel.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$Price' },
            maxPrice: { $max: '$Price' },
          },
        },
      ]),
    ])

    // return response
    return NextResponse.json({ category, subs, courses, amount, chops }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
