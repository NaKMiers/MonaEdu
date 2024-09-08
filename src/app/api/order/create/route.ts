import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import NotificationModel from '@/models/NotificationModel'
import OrderModel from '@/models/OrderModel'
import UserModel from '@/models/UserModel'
import { generateOrderCode } from '@/utils'
import handleDeliverOrder from '@/utils/handleDeliverOrder'
import { notifyNewOrderToAdmin } from '@/utils/sendMail'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Order, Course, Category, Tag, Notification
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/NotificationModel'
import '@/models/OrderModel'
import '@/models/TagModel'
import '@/models/UserModel'

// [POST]: /order/create
export async function POST(req: NextRequest) {
  console.log('- Create Order -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create order
    const { total, receivedUser, voucher, discount, items, paymentMethod } = await req.json()

    // get user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id
    const email = token?.email

    // check if user exists or not
    if (!userId) {
      return NextResponse.json({ message: 'Người dùng không hợp lệ' }, { status: 404 })
    }

    // check if user has already joined course
    let userCourses: any = []

    if (receivedUser) {
      userCourses = await UserModel.findOne({ email: receivedUser }).select('courses').lean()
    } else {
      userCourses = await UserModel.findById(userId).select('courses').lean()
    }

    let joinedCourses: any = []
    const userCoursesIds = userCourses?.courses.map((course: any) => course.course.toString())

    const itemsIds = items.map((item: any) => item.courseId._id.toString())

    const isUserJoinedCourse = itemsIds.some((id: any) => {
      if (userCoursesIds.includes(id)) {
        joinedCourses.push(id)
        return true
      }
      return false
    })

    if (isUserJoinedCourse) {
      const joinedCoursesTitles = await CourseModel.find({
        _id: { $in: joinedCourses },
      }).distinct('title')
      return NextResponse.json(
        { message: `Học viên đã tham gia khóa học "${joinedCoursesTitles.join(', ')}"` },
        { status: 400 }
      )
    }

    // get courses to create order
    const courses = await CourseModel.find({ _id: { $in: itemsIds } })
      .populate('tags category')
      .lean()
    const code = await generateOrderCode(5)

    // create new order
    const [newOrder] = await Promise.all([
      // save new order
      OrderModel.create({
        code,
        userId,
        email,
        receivedUser,
        voucher,
        discount,
        total,
        items: courses,
        paymentMethod,
      }),

      // notify buyer
      NotificationModel.create({
        userId,
        title: 'Cảm ơn bạn đã mua khóa học của chúng tôi, đơn hàng của bạn đang được xử lí!',
        image: '/images/logo.png',
        link: '/user/history',
        type: 'create-order',
      }),
    ])

    // auto deliver order
    let response: any = null
    if (process.env.IS_AUTO_DELIVER === 'YES') {
      handleDeliverOrder(newOrder._id)
    }

    // return new order
    const message =
      response && response.isError
        ? 'Đơn hàng của bạn đang được sử lý, xin vui lòng đợi'
        : 'Đơn hàng của bạn đã được gửi đến email ' + email

    // notify new order to admin
    await notifyNewOrderToAdmin(newOrder)

    // return code
    return NextResponse.json({ code, message }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
