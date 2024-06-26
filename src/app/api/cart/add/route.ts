import { connectDatabase } from '@/config/database'
import CartItemModel, { ICartItem } from '@/models/CartItemModel'
import CourseModel from '@/models/CourseModel'
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
  console.log(' - Add Courses To Cart - ')

  try {
    // Connect to database
    await connectDatabase()

    // Get course data to add to cart
    const { courses }: { courses: CartItemToAdd[] } = await req.json()
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId: any = token?._id

    // Check if user logged in
    if (!userId) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 401 })
    }

    // Fetch all courses from database
    const courseData = await CourseModel.find({
      _id: { $in: courses.map((course: any) => course.courseId) },
      active: true,
    })
      .populate('flashSale')
      .lean()

    // no course to add
    if (!courseData.length) {
      return NextResponse.json({ message: 'Khóa học không tồn tại' }, { status: 404 })
    }

    // errors
    const errors: any = {
      notFound: [],
      notEnough: [],
    }

    // Create an array to store promises for adding courses to cart
    const promises = courses.map(async (course: any) => {
      const { courseId, quantity } = course

      // Find the course in fetched data
      const foundCourse = courseData.find((p: any) => p._id.toString() === courseId)

      // not found course
      if (!foundCourse) {
        errors.notFound.push('Khóa học không tồn tại')
        return null
      }

      // Find existing cart item for the course
      let existingCartItem: ICartItem | null = await CartItemModel.findOne({ userId, courseId }).lean()

      if (!existingCartItem) {
        // If course does not exist in cart, create new cart item
        const newCartItem = new CartItemModel({
          userId,
          courseId,
        })
        await newCartItem.save()

        return {
          ...newCartItem._doc,
          course: foundCourse,
        }
      }
    })

    // execute all promises in parallel and remove null course
    let addedItems: any[] = (await Promise.all(promises.filter(Boolean))).filter(item => item)

    // Calculate total cart length
    const cartLength = addedItems.reduce((total, item) => total + (item?.quantity || 0), 0)

    // Return response with errors, if any
    return NextResponse.json(
      {
        cartItems: addedItems,
        cartLength,
        message: !!addedItems.length
          ? 'Đã thêm vào giỏ hàng:\n' + addedItems.map(item => item.course.title).join(',\n')
          : null,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
