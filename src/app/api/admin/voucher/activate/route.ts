import { connectDatabase } from '@/config/database'
import VoucherModel from '@/models/VoucherModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher
import '@/models/VoucherModel'

// [PATCH]: /admin/voucher/feature
export async function PATCH(req: NextRequest) {
  console.log('- Activate Vouchers - ')

  try {
    // connect to database
    await connectDatabase()

    // get voucher id to delete
    const { ids, value } = await req.json()

    const [updatedVouchers] = await Promise.all([
      // get updated vouchers
      VoucherModel.find({ _id: { $in: ids } }).lean(),

      // update vouchers from database
      VoucherModel.updateMany({ _id: { $in: ids } }, { $set: { active: value || false } }),
    ])

    if (!updatedVouchers.length) {
      throw new Error('No voucher found')
    }

    // return response
    return NextResponse.json(
      {
        updatedVouchers,
        message: `Voucher ${updatedVouchers
          .map(voucher => `"${voucher.code}"`)
          .reverse()
          .join(', ')} ${updatedVouchers.length > 1 ? 'have' : 'has'} been ${
          value ? 'activated' : 'deactivated'
        }`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
