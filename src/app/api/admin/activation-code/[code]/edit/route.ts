import { connectDatabase } from '@/config/database'
import ActivationCodeModel from '@/models/ActivationCodeModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel from '@/models/CourseModel'

// Models: Activation Code, Course
import '@/models/ActivationCodeModel'
import '@/models/CourseModel'

// [PUT]: /api/admin/activation-code/:code/edit
export async function PUT(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Edit Activation Code -')

  try {
    // connect to database
    await connectDatabase()

    // get data to edit
    const { code: newCode, courseId, begin, expire, timesLeft, active } = await req.json()

    const [isActivationCodeExist, isCourseExist] = await Promise.all([
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

    // update activation code
    await ActivationCodeModel.findOneAndUpdate(
      { code },
      {
        $set: {
          code: newCode,
          courseId,
          begin,
          expire,
          timesLeft,
          active,
        },
      }
    )

    // return response
    return NextResponse.json({ message: 'Activation code has been updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
