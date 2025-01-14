import { connectDatabase } from '@/config/database'
import ActivationCodeModel from '@/models/ActivationCodeModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import NotificationModel from '@/models/NotificationModel'
import UserModel from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Activation Code, Course, User, Notification
import '@/models/ActivationCodeModel'
import '@/models/CourseModel'
import '@/models/NotificationModel'
import '@/models/UserModel'

// [POST]: /activation-code/:code/apply
export async function POST(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Active Course -')

  try {
    // connect to database
    await connectDatabase()

    /*
      Active course by using activation code when:
      - User has logged in
      - Activation code exists and is active
      - Activation code has not been used by the user before
      - Activation code has not expired
      - Activation code has not been overused
      - User has not enrolled in this course before
      - Course is active
    */

    // get user id to check if user has used this activation code
    const token = await getToken({ req })
    const userId = token?._id
    const userCourses: string[] = token?.courses as string[]

    // check if user has logged in
    if (!userId) {
      return NextResponse.json({ message: 'Bạn cần đăng nhập để sử dụng mã kích hoạt' }, { status: 401 })
    }

    // get activation code from database to active course
    const activationCode: any = await ActivationCodeModel.findOne({
      code,
      active: true,
    }).lean()

    // if activation code does not exist
    if (!activationCode) {
      return NextResponse.json({ message: 'Mã kích hoạt không tồn tại' }, { status: 404 })
    }

    // activation code has been used by the user
    if (activationCode.usedUsers.includes(userId)) {
      return NextResponse.json(
        {
          message: 'Bạn đã dùng mã kích hoạt này rồi, vui lòng thử một mã khác!',
        },
        { status: 401 }
      )
    }

    // activation code has expired => activation code never be expired if expire = null
    if (activationCode.expire && new Date() > new Date(activationCode.expire)) {
      return NextResponse.json({ message: 'Mã kích hoạt của bạn đã hết hạn' }, { status: 401 })
    }

    // activation code has over used => * activation code can be used infinite times if timesLeft = null
    if ((activationCode.timesLeft || 0) <= 0) {
      return NextResponse.json({ message: 'Mã kích hoạt của bạn đã hết lượt dùng' }, { status: 401 })
    }

    // check if user has already enrolled in this course
    if (userCourses.includes(activationCode.courseId)) {
      return NextResponse.json({ message: 'Bạn đã tham gia khóa học này rồi' }, { status: 401 })
    }

    // get course to check if course is active
    const course: ICourse | null = await CourseModel.findOne({
      _id: activationCode.courseId,
      active: true,
    }).lean()

    // if course does not exist or course is not active
    if (!course || course.active === false) {
      return NextResponse.json(
        { message: 'Khóa học không tồn tại hoặc không hoạt động' },
        { status: 404 }
      )
    }

    // activate course
    await Promise.all([
      // update activation code
      ActivationCodeModel.updateOne(
        { code },
        {
          $push: { usedUsers: userId },
          $inc: { timesLeft: -1 },
        }
      ),

      // update user
      UserModel.findByIdAndUpdate(userId, {
        $push: {
          courses: {
            course: course._id,
            progress: 0,
          },
        },
      }),
    ])

    // notify user after activated course
    await NotificationModel.create({
      userId,
      title: 'Kích hoạt khóa học thành công, học ngay thôi!',
      image: '/images/logo.png',
      link: '/my-courses',
      type: 'activate-course',
    })

    // return response
    return NextResponse.json(
      { message: 'Chúc mừng bạn, khóa học học của bạn đã được kích hoạt' },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
