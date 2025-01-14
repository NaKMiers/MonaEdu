import { connectDatabase } from '@/config/database'
import ActivationCodeModel from '@/models/ActivationCodeModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Activation Code
import '@/models/ActivationCodeModel'

// [PATCH]: /admin/activation-code/feature
export async function PATCH(req: NextRequest) {
  console.log('- Activate Activation Codes - ')

  try {
    // connect to database
    await connectDatabase()

    // get activationCode id to delete
    const { ids, value } = await req.json()

    const [updatedActivationCodes] = await Promise.all([
      // get updated activationCodes
      ActivationCodeModel.find({ _id: { $in: ids } }).lean(),

      // update activationCodes from database
      ActivationCodeModel.updateMany({ _id: { $in: ids } }, { $set: { active: value || false } }),
    ])

    if (!updatedActivationCodes.length) {
      throw new Error('No activation code found')
    }

    // return response
    return NextResponse.json(
      {
        updatedActivationCodes,
        message: `Activation Code ${updatedActivationCodes
          .map(activationCode => `"${activationCode.code}"`)
          .reverse()
          .join(', ')} ${updatedActivationCodes.length > 1 ? 'have' : 'has'} been ${
          value ? 'activated' : 'deactivated'
        }`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
