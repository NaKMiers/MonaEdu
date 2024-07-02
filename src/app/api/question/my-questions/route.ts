// Models:

import { connectDatabase } from '@/config/database'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import QuestionModel from '@/models/QuestionModel'
import momentTZ from 'moment-timezone'
import { searchParamsToObject } from '@/utils/handleQuery'

// Models: Question, User
import '@/models/QuestionModel'
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /question/my-questions
export async function GET(req: NextRequest) {
  console.log('- Get My Questions -')

  try {
    // connect to database
    await connectDatabase()

    // get user to check authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // check if user is logged in
    if (!userId) {
      return NextResponse.json({ message: 'Người dùng không hợp lệ' }, { status: 404 })
    }

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 16
    const filter: { [key: string]: any } = { userId }
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

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

        if (key === 'from-to') {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter.createdAt = {
              $gte: momentTZ.tz(dates[0], 'Asia/Ho_Chi_Minh').toDate(),
              $lt: momentTZ.tz(dates[1], 'Asia/Ho_Chi_Minh').toDate(),
            }
          } else if (dates[0]) {
            filter.createdAt = {
              $gte: momentTZ.tz(dates[0], 'Asia/Ho_Chi_Minh').toDate(),
            }
          } else if (dates[1]) {
            filter.createdAt = {
              $lt: momentTZ.tz(dates[1], 'Asia/Ho_Chi_Minh').toDate(),
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of lesson
    const amount = await QuestionModel.countDocuments(filter)

    // get user's questions
    const questions = await QuestionModel.find(filter)
      .populate('userId')
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // return user's questions
    return NextResponse.json({ questions, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
