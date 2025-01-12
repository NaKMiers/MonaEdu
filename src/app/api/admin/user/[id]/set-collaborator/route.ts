import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { formatPrice } from '@/utils/number'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PATCH]: /admin/user/:id/set-collaborator
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Set Collaborator - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to set collaborator
    const { type, value } = await req.json()

    // set collaborator
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          role: 'collaborator',
          commission: { type, value: value.trim() },
        },
      },
      { new: true }
    )

    // check user
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // return response
    return NextResponse.json(
      {
        updatedUser,
        message: `User ${
          updatedUser.username || updatedUser.email
        } has been set as a collaborator with a commission of ${formatPrice(updatedUser.commission.value)}`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
