import { connectDatabase } from '@/config/database'
import ActivationCodeModel from '@/models/ActivationCodeModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Activation Code, Course
import '@/models/ActivationCodeModel'
import '@/models/CourseModel'

// [PUT]: /admin/activation-code/code/edit
export async function PUT(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Add Activation Code -')

  try {
    // connect to database
    await connectDatabase()
    console.log('code:', code)

    // get data to create activation code
    const { code: newCode, courses, begin, expire, timesLeft, active } = await req.json()

    console.log('newCode:', newCode)
    console.log('courses:', courses)
    console.log('begin:', begin)
    console.log('expire:', expire)
    console.log('timesLeft:', timesLeft)
    console.log('active:', active)

    const isCourseExist = await CourseModel.exists({ _id: { $in: courses }, active: true })

    // return error if course does not exist
    if (!isCourseExist) {
      return NextResponse.json({ message: 'Some courses do not exist' }, { status: 400 })
    }

    // create new activationCode
    await ActivationCodeModel.findOneAndUpdate(
      { code },
      {
        code: newCode,
        courses,
        begin,
        expire,
        timesLeft,
        active,
      }
    )

    // return response
    return NextResponse.json({ message: `ActivationCode has been created` }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
