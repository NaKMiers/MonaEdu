import { connectDatabase } from '@/config/database'
import OrderModel from '@/models/OrderModel'
import UserModel from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Order, User
import '@/models/OrderModel'
import '@/models/UserModel'
import { ICourse } from '@/models/CourseModel'
import mongoose from 'mongoose'

// [DELETE]: /admin/order/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Orders - ')

  try {
    // connect to database
    await connectDatabase()

    // get order ids to delete
    const { ids } = await req.json()

    const [deletedOrders] = await Promise.all([
      // get deleted orders
      OrderModel.find({ _id: { $in: ids } }).lean(),

      // delete orders
      OrderModel.deleteMany({ _id: { $in: ids } }),
    ])

    // if order is not package -> take the courses out of the user's course list
    const deletedOrderOfCourses = deletedOrders.filter(order => !order.isPackage)
    await Promise.all(
      deletedOrderOfCourses.map(order =>
        UserModel.updateOne(
          { email: order.email },
          {
            $pull: {
              courses: {
                course: {
                  $in: order.items.map((course: ICourse) => new mongoose.Types.ObjectId(course._id)),
                },
              },
            },
          }
        )
      )
    )

    return NextResponse.json(
      {
        deletedOrders,
        message: `Order "${deletedOrders.map(order => order.code).join(', ')}" ${
          deletedOrders.length > 1 ? 'have' : 'has'
        } been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
