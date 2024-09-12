import { connectDatabase } from '@/config/database'
import PackageGroupModel from '@/models/PackageGroupModel'
import PackageModel from '@/models/PackageModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Package, Package Group
import '@/models/PackageGroupModel'
import '@/models/PackageModel'

// [POST]: /admin/package/add
export async function POST(req: NextRequest) {
  console.log('- Add Package -')

  try {
    // connectDatabase
    await connectDatabase()

    // get data to add package
    const {
      title,
      oldPrice,
      price,
      description,
      packageGroup,
      active,
      features,
      credit,
      days,
      maxPrice,
    } = await req.json()

    // create new package
    const newPackage = await PackageModel.create({
      title,
      oldPrice,
      price,
      description,
      packageGroup,
      active,
      features,
      credit,
      days,
      maxPrice,
    })

    // increase package group - package amount
    await PackageGroupModel.updateOne({ _id: packageGroup }, { $inc: { packageAmount: 1 } })

    // return new package
    return NextResponse.json(
      { package: newPackage, message: 'Add Package Successfully' },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
