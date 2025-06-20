import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import CourseModel from '@/models/CourseModel'
import TagModel from '@/models/TagModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category, Tag, Course, Flash Sale
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /course
export async function GET(req: NextRequest) {
  console.log('- Get All Courses -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 16
    const filter: { [key: string]: any } = { active: true }
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // get tags and categories
    const [tgs, cates] = await Promise.all([
      TagModel.find().select('title slug').lean(),
      CategoryModel.find().select('title slug').lean(),
    ])

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
          const searchFields = ['title', 'titleNoDiacritics', 'description', 'slug']

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

        if (['price', 'joined'].includes(key)) {
          filter[key] = { $lte: +params[key][0] }
          continue
        }

        if (key === 'flashSale') {
          filter[key] =
            params[key][0] === 'true' ? { $exists: true, $ne: null } : { $exists: false, $eq: null }
          continue
        }

        if (key === 'ctg') {
          // convert slugs to ids
          const cateIds = [params[key]][0]
            .map(item => cates.find(cate => cate.slug === item)?._id)
            .filter(item => item)

          filter['category'] = { $in: cateIds }
          continue
        }

        if (key === 'tag') {
          // convert slugs to ids
          const tgIds = [params[key]][0]
            .map(item => tgs.find(tag => tag.slug === item)?._id)
            .filter(item => item)

          filter['tags'] = { $in: tgIds }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of courses | get all courses from database
    const [amount, courses, chops] = await Promise.all([
      // get amount of courses
      CourseModel.countDocuments(filter),

      // get all courses from database
      CourseModel.find(filter)
        .populate('tags category flashSale')
        .sort(sort)
        .skip(skip)
        .limit(itemPerPage)
        .lean(),

      // get chops
      CourseModel.aggregate([
        { $match: { active: true } },
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
    return NextResponse.json({ courses, amount, tgs, cates, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
