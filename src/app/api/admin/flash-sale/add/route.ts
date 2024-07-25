import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import FlashSaleModel from '@/models/FlashSaleModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Flash Sale, Course
import '@/models/CourseModel'
import '@/models/FlashSaleModel'

// [POST]: /admin/flash-sale/add
export async function POST(req: NextRequest) {
  console.log('- Add Flash Sale -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create flash sale
    const { type, value, begin, timeType, duration, expire, appliedCourses } = await req.json()

    // create new flash sale in databasee
    const newFlashSale = await FlashSaleModel.create({
      type,
      value,
      begin,
      timeType,
      duration: timeType === 'loop' ? duration : null,
      expire: timeType === 'once' ? expire : null,
    })

    const [courseQuantity] = await Promise.all([
      // get courseQuantity of the courses have just applied flash sale
      CourseModel.countDocuments({ flashSale: newFlashSale._id }),

      // update flashSale field for all courses in applyCourses
      CourseModel.updateMany(
        { _id: { $in: appliedCourses } },
        { $set: { flashSale: newFlashSale._id } }
      ),
    ])

    // update flash sale quantity
    await FlashSaleModel.findByIdAndUpdate(newFlashSale._id, { $set: { courseQuantity } })

    // return new flash sale
    return NextResponse.json(
      { message: `Flash sale (${newFlashSale.value}) has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
