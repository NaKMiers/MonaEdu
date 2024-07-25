import { connectDatabase } from '@/config/database'
import OrderModel from '@/models/OrderModel'
import UserModel, { IUser } from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// models: User, Order
import '@/models/OrderModel'
import '@/models/UserModel'

// [GET]: /admin/user/rank-user
export async function GET() {
  console.log('- Rank User -')

  try {
    // connect to database
    await connectDatabase()

    // get all done orders
    const orders = await OrderModel.find({ status: 'done' }).lean()

    // create a map to store total spent amount of each customer
    const customerTotalSpentMap: { [key: string]: any[] } = {}

    // total spent amount of each customer
    orders.forEach(order => {
      const email = order.email
      const total = order.total
      if (!customerTotalSpentMap[email]) {
        customerTotalSpentMap[email] = total
      } else {
        customerTotalSpentMap[email] += total
      }
    })

    // convert object to array
    const customerTotalSpentArray: any[] = Object.entries(customerTotalSpentMap)

    // sort by spent amount (descending)
    customerTotalSpentArray.sort((a, b) => b[1] - a[1])

    // build results
    const spentUser = await Promise.all(
      customerTotalSpentArray
        .map(async ([email, spent]) => {
          // get user from database
          const user: IUser | null = await UserModel.findOne({ email }).lean()

          // check if user exists or not
          if (user) {
            return {
              ...user, // user info
              spent, // expensed amount
            }
          }
        })
        .filter(Boolean)
    )

    return NextResponse.json({ spentUser }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
