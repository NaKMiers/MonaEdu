import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import TagModel from '@/models/TagModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category, Tag, Course
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/course/all
export async function GET(req: NextRequest) {
  console.log('- Get All Courses -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 9
    const filter: { [key: string]: any } = {}
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (key === 'limit') {
          if (params[key][0] === 'no-limit') {
            itemPerPage = Number.MAX_SAFE_INTEGER
            skip = 0
          } else {
            itemPerPage = +params[key][0]
          }
          continue
        }

        // Special Cases ---------------------
        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['title', 'author', 'citing', 'slug']

          filter.$or = searchFields.map(field => ({
            [field]: { $regex: params[key][0], $options: 'i' },
          }))
          continue
        }

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        if (key === 'price' || key === 'joined') {
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

        if (key === 'flashSale') {
          filter[key] =
            params[key][0] === 'true' ? { $exists: true, $ne: null } : { $exists: false, $eq: null }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // count amount, get all courses, get all tags and categories, get all order
    const [amount, courses, tgs, chops] = await Promise.all([
      // get amount of course
      CourseModel.countDocuments(filter),

      // get all courses from database
      CourseModel.find(filter).populate('tags category').sort(sort).skip(skip).limit(itemPerPage).lean(),

      // get tags and categories
      TagModel.find().select('title').lean(),

      // get all order without filter
      CourseModel.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            minJoined: { $min: '$joined' },
            maxJoined: { $max: '$joined' },
          },
        },
      ]),
    ])

    // return all courses
    return NextResponse.json({ courses, amount, tgs, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
