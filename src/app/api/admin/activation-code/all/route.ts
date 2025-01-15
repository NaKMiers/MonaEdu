import { connectDatabase } from '@/config/database'
import ActivationCodeModel from '@/models/ActivationCodeModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Activation Code, Course, User
import '@/models/ActivationCodeModel'
import '@/models/CourseModel'
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/activation-code/all
export async function GET(req: NextRequest) {
  console.log('- Get All Activation Codes -')

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
        // Special Cases ---------------------
        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['code']

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

        // range fields
        if (key === 'timesLeft') {
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

        if (['begin', 'expire'].includes(key)) {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter[key] = {
              $gte: dates[0],
              $lt: dates[1],
            }
          } else if (dates[0]) {
            filter[key] = {
              $gte: dates[0],
            }
          } else if (dates[1]) {
            filter[key] = {
              $lt: dates[1],
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    console.log('Filter:', filter)

    // get amount, get all activationCodes, chops
    const [amount, activationCodes, chops] = await Promise.all([
      // get amount of lesson
      ActivationCodeModel.countDocuments(filter),

      // get all activation codes from database
      ActivationCodeModel.find(filter)
        .populate({
          path: 'usedUsers',
          select: 'email',
        })
        .populate({
          path: 'courses',
          select: 'title images',
        })
        .sort(sort)
        .skip(skip)
        .limit(itemPerPage)
        .lean(),

      // get all order without filter
      ActivationCodeModel.aggregate([
        {
          $group: {
            _id: null,
            minTimesLeft: { $min: '$timesLeft' },
            maxTimesLeft: { $max: '$timesLeft' },
          },
        },
      ]),
    ])

    // return response
    return NextResponse.json({ activationCodes, amount, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
