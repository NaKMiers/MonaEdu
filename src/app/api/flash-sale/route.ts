import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, FlashSale
import '@/models/CourseModel'
import '@/models/FlashSaleModel'

export const dynamic = 'force-dynamic'

// [GET]: /flash-sale
export async function GET(req: NextRequest) {
  console.log('- Get Flash Sale Courses -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 8
    const filter: { [key: string]: any } = {
      flashSale: { $exists: true, $ne: null },
      active: true,
    }
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

        if (key === 'search') {
          const searchFields = ['title', 'description', 'slug']

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

        if (key === 'price') {
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount, get all courses
    const [amount, courses] = await Promise.all([
      // get amount of account
      CourseModel.countDocuments(filter),

      // get all courses
      CourseModel.find(filter).populate('flashSale').sort(sort).skip(skip).limit(itemPerPage).lean(),
    ])

    // return flashSale courses
    return NextResponse.json({ courses, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
