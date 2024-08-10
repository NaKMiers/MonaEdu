import { connectDatabase } from '@/config/database'
import CartItemModel, { ICartItem } from '@/models/CartItemModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: CartItem, Course, Flash Sale
import '@/models/CartItemModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'

export type CartItemToAdd = {
  courseId: string
}

// [POST]: /cart/add
export async function POST(req: NextRequest) {
  console.log(' - Add Course To Cart - ')

  try {
    // Connect to database
    await connectDatabase()

    // Get course data to add to cart
    const { courseId } = await req.json()
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId: any = token?._id

    // Check if user logged in
    if (!userId) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 401 })
    }

    // Fetch all courses from database
    const course: ICourse | null = await CourseModel.findOne({
      _id: courseId,
      active: true,
    })
      .populate('flashSale')
      .lean()

    // no course to add
    if (!course) {
      return NextResponse.json({ message: 'Khóa học không tồn tại' }, { status: 404 })
    }

    // find existing cart item for the course
    let existingCartItem: ICartItem | null = await CartItemModel.findOne({ userId, courseId }).lean()

    // if course already exists in cart
    if (existingCartItem) {
      return NextResponse.json({ message: 'Khóa học đã có trong giỏ hàng' }, { status: 400 })
    }

    // add new cart item
    const newCartItem = await CartItemModel.create({
      userId,
      courseId,
    })

    // save new cart item, populate course, and count cart length
    const [cartItem, cartLength] = await Promise.all([
      CartItemModel.findById(newCartItem._id).populate('courseId').lean(),
      CartItemModel.countDocuments({ userId }),
    ])

    // Return response with errors, if any
    return NextResponse.json(
      {
        cartItem,
        cartLength,
        message: 'Đã thêm vào giỏ hàng:\n' + course.title,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
