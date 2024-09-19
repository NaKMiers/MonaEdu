import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Flash Sale
import '@/models/CourseModel'
import '@/models/FlashSaleModel'

export const dynamic = 'force-dynamic'

// [GET]: /embed/course/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Embed Course - ')

  try {
    // connect to database
    await connectDatabase()

    // get course
    const course = await CourseModel.findOne({ slug })
      .select('title textHook images price oldPrice flashSale likes duration slug joined')
      .populate('flashSale')
      .lean()

    console.log('Course:', course)

    // return response
    return NextResponse.json({ course }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
