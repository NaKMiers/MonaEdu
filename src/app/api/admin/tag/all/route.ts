import { connectDatabase } from '@/config/database'
import TagModel from '@/models/TagModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tag
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/tag/all
export async function GET(req: NextRequest) {
  console.log('- Get All Tags -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 10
    const filter: { [key: string]: any } = {}
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        // Special Cases ---------------------
        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        // range fields
        if (key === 'courseQuantity') {
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

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of lesson
    const amount = await TagModel.countDocuments(filter)

    // get all tags from database
    const tags = await TagModel.find(filter).sort(sort).skip(skip).limit(itemPerPage).lean()

    // get all order without filter
    const chops = await TagModel.aggregate([
      {
        $group: {
          _id: null,
          minCourseQuantity: { $min: '$courseQuantity' },
          maxCourseQuantity: { $max: '$courseQuantity' },
        },
      },
    ])

    return NextResponse.json({ tags, amount, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
