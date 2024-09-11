import { connectDatabase } from '@/config/database'
import PackageModel from '@/models/PackageModel'
import { NextRequest, NextResponse } from 'next/server'

// [PUT]: /admin/package/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Update Package -')

  try {
    // connect to database
    await connectDatabase()

    // get data to add package
    const { title, oldPrice, price, description, active, features, credit, days, maxPrice } =
      await req.json()

    console.log('maxPrice', maxPrice)

    // update package
    const updatedPackage = await PackageModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          oldPrice,
          price,
          description,
          active,
          features,
          credit,
          days,
          maxPrice,
        },
      },
      { new: true }
    )

    // return response
    return NextResponse.json({ updatedPackage, message: 'Package has been updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
