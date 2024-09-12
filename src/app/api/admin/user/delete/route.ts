import { connectDatabase } from '@/config/database'
import OrderModel from '@/models/OrderModel'
import UserModel from '@/models/UserModel'
import { NextResponse } from 'next/server'

// Models: User, Order
import '@/models/OrderModel'
import '@/models/UserModel'

// [DELETE]: /admin/user/delete
export async function DELETE(req: Request) {
  console.log('- Delete Users - ')

  try {
    // connect to database
    await connectDatabase()

    // get user ids to delete
    const { ids } = await req.json()

    // only allow to delete user if user has not buy any orders
    const orderExists = await OrderModel.exists({ userId: { $in: ids } })

    // check if user has bought any orders
    if (orderExists) {
      return NextResponse.json({ message: 'Không thể xóa người dùng đã mua khóa học' }, { status: 400 })
    }

    // get deleted users and delete users from database
    const [deletedUsers] = await Promise.all([
      // get deleted users
      UserModel.find({ _id: { $in: ids } }).lean(),

      // delete users from database
      UserModel.deleteMany({ _id: { $in: ids } }),
    ])

    // return response
    return NextResponse.json({
      deletedUsers,
      message: `Users "${deletedUsers
        .map(user => user.email)
        .reverse()
        .join(', ')}" ${deletedUsers.length > 1 ? 'have' : 'has'} been deleted`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
