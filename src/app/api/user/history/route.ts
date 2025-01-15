import { connectDatabase } from '@/config/database'
import OrderModel from '@/models/OrderModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import momentTZ from 'moment-timezone'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Order, Voucher
import '@/models/OrderModel'
import '@/models/VoucherModel'
import { toUTC } from '@/utils/time'

export const dynamic = 'force-dynamic'

// [GET]: /user/history
export async function GET(req: NextRequest) {
  console.log('- Get User Order History -')

  try {
    // connect database
    await connectDatabase()

    // get user id to get order history
    const token = await getToken({ req })
    const userId = token?._id

    // check if user id is not found
    if (!userId) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 })
    }

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 9
    const filter: { [key: string]: any } = { userId }
    let sort: { [key: string]: any } = { createdAt: -1 }

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
          const searchFields = ['code', 'email', 'status', 'paymentMethod']

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
        if (key === 'total') {
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

        if (['userId', 'voucher'].includes(key)) {
          filter[key] =
            params[key][0] === 'true' ? { $exists: true, $ne: null } : { $exists: false, $eq: null }
          continue
        }

        if (key === 'from-to') {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter.createdAt = {
              $gte: toUTC(dates[0]),
              $lt: toUTC(dates[1]),
            }
          } else if (dates[0]) {
            filter.createdAt = {
              $gte: toUTC(dates[0]),
            }
          } else if (dates[1]) {
            filter.createdAt = {
              $lt: toUTC(dates[1]),
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount, get all orders, get chops
    const [amount, orders, chops] = await Promise.all([
      // get amount of lesson
      OrderModel.countDocuments(filter),

      // get all orders from database
      OrderModel.find(filter)
        .populate({
          path: 'voucher',
          select: 'code',
        })
        .sort(sort)
        .skip(skip)
        .limit(itemPerPage)
        .lean(),

      // get all order without filter
      OrderModel.aggregate([
        {
          $group: {
            _id: null,
            minTotal: { $min: '$total' },
            maxTotal: { $max: '$total' },
          },
        },
      ]),
    ])

    // return response
    return NextResponse.json({ orders, amount, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
