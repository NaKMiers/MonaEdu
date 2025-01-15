import { connectDatabase } from '@/config/database'
import ActivationCodeModel from '@/models/ActivationCodeModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import NotificationModel from '@/models/NotificationModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Activation Code, Course, User, Notification
import '@/models/ActivationCodeModel'
import '@/models/CourseModel'
import '@/models/NotificationModel'
import '@/models/UserModel'
import mongoose from 'mongoose'

// [POST]: /course/activate/:code
export async function POST(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Active Course -')

  try {
    // connect to database
    await connectDatabase()

    code = code.toUpperCase().replace(/(.{4})(.{4})(.{4})/, '$1-$2-$3')

    console.log('Activation code:', code)

    /*
      Active course by using activation code when:
      - User has logged in
      - User exists
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

    console.log('User ID:', userId)

    // check if user has logged in
    if (!userId) {
      return NextResponse.json({ message: 'Bạn cần đăng nhập để sử dụng mã kích hoạt' }, { status: 401 })
    }

    // get activation code from database to active course
    const activationCode: any = await ActivationCodeModel.findOne({
      code,
      active: true,
    }).lean()

    console.log('activationCode:', activationCode)

    // if activation code does not exist
    if (!activationCode) {
      return NextResponse.json({ message: 'Mã kích hoạt không tồn tại' }, { status: 404 })
    }

    console.log('activationCode:', activationCode)

    // activation code has not begun yet
    if (!activationCode.begin || new Date() < new Date(activationCode.begin)) {
      return NextResponse.json({ message: 'Mã kích hoạt không tồn tại' }, { status: 404 })
    }

    console.log(
      'activationCode.usedUsers',
      activationCode.usedUsers.map((id: any) => id.toString())
    )

    // activation code has been used by the user
    if (activationCode.usedUsers.map((id: any) => id.toString()).includes(userId)) {
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

    // get user to check if user has used this activation code
    const user: IUser | null = await UserModel.findById(userId).select('courses').lean()

    console.log('user:', user)

    // check if user exists
    if (!user) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 })
    }

    // check if user has already enrolled all courses in activation code
    const userCourses = user.courses.map((course: any) => course.course.toString())
    console.log('userCourses:', userCourses)
    console.log(
      'activationCode.courses:',
      activationCode.courses.map((id: any) => id.toString())
    )
    if (
      userCourses.length > 0 &&
      userCourses.every(courseId =>
        activationCode.courses.map((id: any) => id.toString()).includes(courseId)
      )
    ) {
      return NextResponse.json({ message: 'Bạn đã tham gia khóa học' }, { status: 401 })
    }

    // get course to check if course is active
    const courses: ICourse[] = await CourseModel.find({
      _id: { $in: activationCode.courses },
      active: true,
    })
      .select('_id')
      .lean()

    // union user courses and activation code courses except (courses that user has already enrolled in user courses)
    const newCourses = [
      ...userCourses,
      ...courses
        .map((course: any) => course._id.toString())
        .filter((courseId: any) => !userCourses.includes(courseId))
        .map((courseId: any) => ({ course: new mongoose.Types.ObjectId(courseId), progress: 0 })),
    ]

    console.log('newCourses:', newCourses)

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
      UserModel.findByIdAndUpdate(user._id, {
        $set: { courses: newCourses },
      }),

      // notify user after activated course
      NotificationModel.create({
        userId,
        title: 'Kích hoạt khóa học thành công, học ngay thôi!',
        image: '/images/logo.png',
        link: '/my-courses',
        type: 'activate-course',
      }),
    ])

    // return response
    return NextResponse.json(
      { message: 'Chúc mừng bạn, khóa học học của bạn đã được kích hoạt' },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
