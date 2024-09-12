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
import { formatPrice } from '@/utils/number'
import { checkPackageType } from '@/utils/string'

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
    let userCourses: any = token?.courses

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
    let packageType: 'lifetime' | 'credit' | 'monthly' | '' = checkPackageType(
      userPackage.credit,
      userPackage.expire
    ) as any

    // get package type from request
    const { type } = await req.json()

    // check package type from user package and package type from request
    if (packageType !== type) {
      return NextResponse.json({ message: 'Gói học viên không hợp lệ' }, { status: 400 })
    }

    // get course by slug
    const course: any = await CourseModel.findOne({ slug }).select('_id price')

    // check if course exists
    if (!course) {
      return NextResponse.json({ message: 'Khóa học không tồn tại' }, { status: 404 })
    }

    // build user update data
    const newCourseSet: any = {
      course: course._id,
      progress: 0,
    }

    // check monthly package
    if (packageType === 'monthly') {
      // user package expired
      if (new Date(userPackage.expire) < new Date()) {
        return NextResponse.json({ message: 'Gói học viên đã hết hạn' }, { status: 400 })
      }

      // add expire date to new course set
      newCourseSet.expire = userPackage.expire
    }

    // check lifetime package
    if (packageType === 'lifetime') {
      // check max price of package lifetime
      if (course.price >= userPackage.maxPrice) {
        return NextResponse.json(
          {
            message: `Gói học viên của bạn chỉ cho phép tham gia khóa học dưới ${formatPrice(
              userPackage.maxPrice
            )}`,
          },
          { status: 400 }
        )
      }
    }

    // merge new course to old course in case that user has already joined this course
    let isDuplicate = false
    let updatedUserCourses = userCourses.map((course: any) => {
      // duplicate
      if (course.course.toString() === newCourseSet.course.toString()) {
        isDuplicate = true

        return {
          ...newCourseSet,
          progress: course.progress,
        }
      }
      // not duplicate
      return course
    })

    // add new course to user courses in case that user has not joined this course
    if (!isDuplicate) {
      updatedUserCourses.push(newCourseSet)
    }

    const userUpdateData: any = {
      $set: {
        courses: updatedUserCourses,
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
