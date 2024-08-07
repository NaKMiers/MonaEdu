import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import FlashSaleModel from '@/models/FlashSaleModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Flash Sale
import '@/models/CourseModel'
import '@/models/FlashSaleModel'

// [PATCH]: /admin/course/activate
export async function PATCH(req: NextRequest) {
  console.log('- Activate Courses - ')

  try {
    // connect to database
    await connectDatabase()

    // get course ids to remove flash sales
    const { ids } = await req.json()

    // get update course, update courses
    const [updatedCourses] = await Promise.all([
      // get updated courses
      CourseModel.find({ _id: { $in: ids } }).lean(),

      // update courses from database
      CourseModel.updateMany({ _id: { $in: ids } }, { $set: { flashSale: null } }),
    ])

    if (!updatedCourses.length) {
      throw new Error('No course found')
    }

    // update flash sale course quantity
    await FlashSaleModel.updateMany(
      { _id: { $in: updatedCourses.map(course => course.flashSale) } },
      { $inc: { courseQuantity: -1 } }
    )

    // return response
    return NextResponse.json(
      {
        updatedCourses,
        message: `Flash sale of course ${updatedCourses
          .map(course => `"${course.title}"`)
          .reverse()
          .join(', ')} ${updatedCourses.length > 1 ? 'have' : 'has'} been removed`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
