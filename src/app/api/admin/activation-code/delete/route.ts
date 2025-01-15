import { connectDatabase } from '@/config/database'
import ActivationCodeModel from '@/models/ActivationCodeModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: ActivationCode
import '@/models/ActivationCodeModel'

// [DELETE]: /admin/activation-code/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Activation Codes - ')

  try {
    // connect to database
    await connectDatabase()

    // get activation code ids to delete
    const { ids } = await req.json()

    // get deleted activation codes
    const deletedActivationCodes = await ActivationCodeModel.find({ _id: { $in: ids } }).lean()

    // delete activationCodes from database
    await ActivationCodeModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedActivationCodes,
        message: `Activation code ${deletedActivationCodes
          .map(activationCode => `"${activationCode.code}"`)
          .reverse()
          .join(', ')} ${deletedActivationCodes.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
