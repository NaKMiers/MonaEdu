import { connectDatabase } from '@/config/database'
import CartItemModel from '@/models/CartItemModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: CartItem, Course, FlashSale
import '@/models/CartItemModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'

export const dynamic = 'force-dynamic'

// [GET]: /cart
export async function GET(req: NextRequest) {
  console.log('- Get Cart - ')

  try {
    // connect to database
    await connectDatabase()

    // get userId to get user's cart
    const token = await getToken({ req })
    let userId = token?._id

    // check if user logged in
    if (!userId) {
      return NextResponse.json({ message: 'Xác thực thất bại' }, { status: 401 })
    }

    // get userId from query to get user cart
    const uId = req.nextUrl.searchParams.get('userId')
    if (uId) {
      userId = uId
    }

    // get cart from database
    let cart: any[] = await CartItemModel.find({ userId })
      .populate({
        path: 'courseId',
        populate: {
          path: 'flashSale',
          model: 'flashSale',
        },
      })
      .sort({ createdAt: -1 })
      .lean()

    // return user's cart
    return NextResponse.json({ cart }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
