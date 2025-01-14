import { connectDatabase } from '@/config/database'
import ActivationCodeModel from '@/models/ActivationCodeModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel from '@/models/CourseModel'

// Models: Activation Code, Course
import '@/models/ActivationCodeModel'
import '@/models/CourseModel'

// [POST]: /admin/activation-code/add
export async function POST(req: NextRequest) {
  console.log('- Add Activation Code -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create activation code
    const { code, courseId, begin, expire, timesLeft, active } = await req.json()

    const [isActivationCodeExist, isCourseExist] = await Promise.all([
      // get activation code by code from database
      ActivationCodeModel.exists({ code }),
      CourseModel.exists({ _id: courseId, active: true }),
    ])

    // return error if activation code has already existed
    if (isActivationCodeExist) {
      return NextResponse.json({ message: 'Activation code has already existed' }, { status: 400 })
    }

    // return error if course does not exist
    if (!isCourseExist) {
      return NextResponse.json({ message: 'Course does not exist' }, { status: 400 })
    }

    // create new activationCode
    const newActivationCode = await ActivationCodeModel.create({
      code,
      courseId,
      begin,
      expire,
      timesLeft,
      active,
    })

    // return response
    return NextResponse.json(
      { newActivationCode, message: `ActivationCode "${newActivationCode.code}" has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
