import { connectDatabase } from '@/config/database'
import ActivationCodeModel, { IActivationCode } from '@/models/ActivationCodeModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel from '@/models/CourseModel'

// Models: ActivationCode, Course
import '@/models/ActivationCodeModel'
import '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/activation-code/:code
export async function GET(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Get ActivationCode -')

  try {
    // connect to database
    await connectDatabase()

    // get activation code from database
    const activationCode: any = await ActivationCodeModel.findOne({ code }).lean()

    // check activationCode
    if (!activationCode) {
      return NextResponse.json({ message: 'Activation code not found' }, { status: 404 })
    }

    // get all courses in activation code
    const courses = await CourseModel.find({ _id: { $in: activationCode.courses } })
      .select('title')
      .lean()
    activationCode.courses = courses

    // return activationCode
    return NextResponse.json({ activationCode, message: 'Activation code found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
