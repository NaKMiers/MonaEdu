import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import TagModel, { ITag } from '@/models/TagModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tag, Course, Category
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /tag/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Tag By Slug -')

  try {
    // connect database
    await connectDatabase()

    // get tag by slug
    const tag: ITag | null = await TagModel.findOne({ slug }).lean()

    // check if tag not found
    if (!tag) {
      return NextResponse.json({ message: 'Không tìm thấy thẻ' }, { status: 404 })
    }

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 16
    const filter: { [key: string]: any } = {
      tags: { $in: tag._id },
      active: true,
    }
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

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
          const searchFields = ['title', 'author', 'citing', 'slug']

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
          // remove updatedAt sort then add again to reduce priority
          delete sort.updatedAt

          const newKey = key.split('sort')[1].toLowerCase()
          sort[newKey] = params[key][0] === 'asc' ? 1 : -1

          // sort by updatedAt - default sort
          sort.updatedAt = -1

          continue
        }

        // Special Sort Cases ---------------------
        if (key === 'sort') {
          delete sort.updatedAt

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
            sort = { likesCount: -1 }
            continue
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    console.log('Filter:', filter)
    console.log('Sort:', sort)

    // get, get all courses of current tag, get chops
    const [courses, amount, chops] = await Promise.all([
      // get all courses of current categories
      CourseModel.aggregate([
        { $match: filter },
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: sort },
        { $skip: skip },
        { $limit: itemPerPage },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: '$category' },
        {
          $project: {
            _id: 1,
            title: 1,
            oldPrice: 1,
            price: 1,
            textHook: 1,
            flashSale: 1,
            tags: 1,
            images: 1,
            joined: 1,
            slug: 1,
            likes: 1,
            duration: 1,
            createdAt: 1,
            updatedAt: 1,
            category: {
              slug: 1,
              title: 1,
            },
          },
        },
      ]).exec(),

      // get amount of courses
      await CourseModel.countDocuments(filter),

      // get chops
      CourseModel.aggregate([
        {
          $match: {
            active: true,
          },
        },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]),
    ])

    // return response
    return NextResponse.json({ tag, courses, amount, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
