import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import NotificationModel from '@/models/NotificationModel'
import UserModel from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Course, Notification
import '@/models/CourseModel'
import '@/models/NotificationModel'
import '@/models/UserModel'

// [POST]: /course/:slug/join-on-subscription
export async function POST(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Join Course On Subscription -')

  try {
    // connect to database
    await connectDatabase()

    // get user id and user package from token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id
    const userPackage: any = token?.package

    // check if user is logged in
    if (!userId) {
      return NextResponse.json({ message: 'Vui lòng đăng nhập để tham gia khóa học' }, { status: 400 })
    }

    // check if user is on subscription or not
    if (!userPackage) {
      return NextResponse.json(
        { message: 'Bạn cần mua gói học viên để tham gia khóa học này' },
        { status: 400 }
      )
    }

    // get package type from user package
    let packageType: 'lifetime' | 'credit' | 'monthly' | '' = ''
    if (userPackage) {
      const { credit, expire } = userPackage

      if (credit === null && expire === null) {
        packageType = 'lifetime'
      } else if (typeof credit === 'number' && credit > 0 && expire === null) {
        packageType = 'credit'
      } else if (credit === null && expire !== null && new Date(expire) > new Date()) {
        packageType = 'monthly'
      }
    }

    // get package type from request
    const { type } = await req.json()

    // check package type from user package and package type from request
    if (packageType !== type) {
      return NextResponse.json({ message: 'Gói học viên không hợp lệ' }, { status: 400 })
    }

    // get course by slug
    const course: any = await CourseModel.findOne({ slug }).select('_id')

    // check if course exists
    if (!course) {
      return NextResponse.json({ message: 'Khóa học không tồn tại' }, { status: 404 })
    }

    // build user update data
    const newCourseSet: any = {
      course: course._id,
      progress: 0,
    }

    if (packageType === 'monthly') {
      newCourseSet.expire = userPackage.expire
    }

    const userUpdateData: any = {
      $push: {
        courses: newCourseSet,
      },
    }

    if (packageType === 'credit') {
      userUpdateData.$inc = {
        'package.credit': -1,
      }
    }

    // update user courses & package, update course joined, notify buyer after buying course
    await Promise.all([
      // update user courses & package
      UserModel.findByIdAndUpdate(userId, userUpdateData),

      // update course joined
      CourseModel.findByIdAndUpdate(course._id, { $inc: { joined: 1 } }),

      // notify buyer after buying course
      NotificationModel.create({
        userId: userId,
        title: 'Tham gia khóa học thành công, học ngay thôi!',
        image: '/images/logo.png',
        link: '/my-courses',
        type: 'delivered-order',
      }),
    ])

    // return response
    return NextResponse.json({ message: 'Tham gia khóa học thành công!' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
