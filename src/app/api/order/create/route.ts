import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import NotificationModel from '@/models/NotificationModel'
import OrderModel from '@/models/OrderModel'
import PackageModel from '@/models/PackageModel'
import UserModel, { IUser } from '@/models/UserModel'
import { generateOrderCode } from '@/utils'
import handleDeliverOrder from '@/utils/handleDeliverOrder'
import { notifyNewOrderToAdmin } from '@/utils/sendMail'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { blackDomains, blackEmails } from '@/constants/blackList'
import { checkPackageType } from '@/utils/string'

// Models: User, Order, Course, Category, Tag, Notification, Package
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/NotificationModel'
import '@/models/OrderModel'
import '@/models/PackageModel'
import '@/models/TagModel'
import '@/models/UserModel'

// [POST]: /order/create
export async function POST(req: NextRequest) {
  console.log('- Create Order -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create order
    const { total, receivedUser, voucher, discount, items, paymentMethod, isPackage } = await req.json()

    // get user id
    const token = await getToken({ req })
    const userId = token?._id
    const email = token?.email

    // check if user exists or not
    if (!userId || !email) {
      return NextResponse.json({ message: 'Người dùng không hợp lệ' }, { status: 404 })
    }

    // check if email is blacklist or black domains
    if (blackEmails.includes(email) || blackDomains.some(domain => email.endsWith(domain))) {
      return NextResponse.json({ message: 'Không thể thực hiện giao dịch này' }, { status: 400 })
    }

    const newOrderSet: any = {
      // code: string
      userId,
      email,
      receivedUser,
      voucher,
      discount,
      total,
      paymentMethod,
      isPackage,
      // items: any[]
    }

    // Buying Courses
    if (!isPackage) {
      let userCourses: any = []

      // buy as a gift
      if (receivedUser) {
        userCourses = await UserModel.findOne({ email: receivedUser }).select('courses').lean()
        userCourses = userCourses?.courses
      }
      // buy for themselves
      else {
        userCourses = await UserModel.findById(userId).select('courses').lean()
        userCourses = userCourses?.courses
      }

      // list of duplicates courses that user has joined - forever (expire !== null)
      let duplicateCourseIds: any = []
      userCourses.forEach((course: any) => {
        items.forEach((item: any) => {
          if (
            course.course.toString() === item.courseId._id.toString() &&
            (!course.expire || course.expire === null) // expire undefined or null -> forever
          ) {
            duplicateCourseIds.push(course.course.toString())
          }
        })
      })

      if (duplicateCourseIds.length > 0) {
        const joinedCoursesTitles = await CourseModel.find({
          _id: { $in: duplicateCourseIds },
        }).distinct('title')

        return NextResponse.json(
          { message: `Học viên đã tham gia khóa học "${joinedCoursesTitles.join(', ')}"` },
          { status: 400 }
        )
      }

      // get courses to create order
      const courses = await CourseModel.find({
        _id: { $in: items.map((item: any) => item.courseId._id.toString()) },
      })
        .populate('tags category')
        .lean()

      // check if courses exist or not
      if (courses.length !== items.length) {
        return NextResponse.json({ message: 'Khóa học không hợp lệ' }, { status: 404 })
      }

      // add courses to new order set
      newOrderSet.items = courses
    }
    // Buying Package
    else {
      // get package to create order
      const pkg = await PackageModel.findById(items[0].packageId._id.toString()).lean()

      // check if packages exist or not
      if (!pkg) {
        return NextResponse.json({ message: 'Gói học viên không hợp lệ' }, { status: 404 })
      }

      // get buyer to check if user has already joined package
      const buyer: IUser | null = await UserModel.findById(userId).select('package').lean()

      // check if user exists or not
      if (!buyer) {
        return NextResponse.json({ message: 'Người dùng không hợp lệ' }, { status: 404 })
      }

      // prevent downgrade with lifetime advanced
      if (
        checkPackageType(buyer?.package?.credit, buyer?.package?.expire) === 'lifetime' &&
        !buyer?.package.maxPrice
      ) {
        return NextResponse.json(
          { message: 'Không thể thay đổi gói học viên hiện tại của bạn' },
          { status: 400 }
        )
      }

      // add packages to new order set
      newOrderSet.items = [pkg]
    }

    // generate new code
    const code = await generateOrderCode(5)

    // create new order
    const [newOrder] = await Promise.all([
      // save new order
      OrderModel.create({
        code,
        ...newOrderSet,
      }),

      // notify buyer
      NotificationModel.create({
        userId,
        title: `Cảm ơn bạn đã ${
          isPackage
            ? 'đăng ký gói học viên của chúng tôi, yêu của bạn đang được xử lí!'
            : 'mua khóa học của chúng tôi, đơn hàng của bạn đang được xử lí!'
        }`,
        image: '/images/logo.png',
        link: '/user/history',
        type: 'create-order',
      }),
    ])

    // auto deliver order
    let response: any = null

    // auto deliver order when: payment method is momo / banking, and is auto deliver
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
