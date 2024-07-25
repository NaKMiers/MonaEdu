import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import FlashSaleModel from '@/models/FlashSaleModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Flash Sale
import '@/models/CourseModel'
import '@/models/FlashSaleModel'

// [PUT]: /api/admin/flash-sale/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Flash sale -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create flash sale
    const { type, value, begin, timeType, duration, expire, appliedCourses } = await req.json()

    // update flash sale, get applied courses
    const [updatedFlashSale, originalAppliedCourses] = await Promise.all([
      // update flashSale
      FlashSaleModel.findByIdAndUpdate(id, {
        $set: {
          type,
          value,
          begin,
          timeType,
          duration: timeType === 'loop' ? duration : null,
          expire: timeType === 'once' ? expire : null,
        },
      }),

      // get courses that have been applied by the updated flash sale before
      CourseModel.find({ flashSale: id }).select('_id'),
    ])

    // get courses that have been removed from the updated flash sale
    const removedCourses = originalAppliedCourses.filter(id => !appliedCourses.includes(id))
    const setCourses = appliedCourses.filter((id: string) => !originalAppliedCourses.includes(id))

    const [courseQuantity] = await Promise.all([
      CourseModel.countDocuments({ flashSale: updatedFlashSale._id }),
      CourseModel.updateMany({ _id: { $in: removedCourses } }, { $set: { flashSale: null } }),
      CourseModel.updateMany(
        { _id: { $in: setCourses } },
        { $set: { flashSale: updatedFlashSale._id } }
      ),
    ])

    // update flash sale quantity
    await FlashSaleModel.findByIdAndUpdate(updatedFlashSale._id, { $set: { courseQuantity } })

    // return new flash sale
    return NextResponse.json(
      { message: `Flash sale (${updatedFlashSale.value}) has been updated` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
