import { connectDatabase } from '@/config/database'
import PackageModel from '@/models/PackageModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Package
import '@/models/PackageModel'

// [POST]: /admin/package/add
export async function POST(req: NextRequest) {
  console.log('- Add Package -')

  try {
    // connectDatabase
    await connectDatabase()

    // get data to add package
    const { title, oldPrice, price, description, packageGroup, active, features } = await req.json()

    const set: any = {
      title,
      oldPrice,
      price,
      description,
      active,
      features,
    }

    if (packageGroup) {
      set.packageGroup = packageGroup
    }

    // create new package
    const newPackage = await PackageModel.create(set)

    // increase package amount
    await PackageModel.updateOne({ _id: packageGroup }, { $inc: { amount: 1 } })

    // return new package
    return NextResponse.json(
      { package: newPackage, message: 'Add Package Successfully' },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
