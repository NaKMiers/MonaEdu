import { connectDatabase } from '@/config/database'
import PackageGroupModel from '@/models/asdPackageGroupModel'
import { NextRequest, NextResponse } from 'next/server'

// [PUT]: /admin/package-group/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Update Package Group -')

  try {
    // connect to database
    await connectDatabase()

    // get data from request
    const { title, description } = await req.json()

    // update package group
    const packageGroup = await PackageGroupModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )

    // return response
    return NextResponse.json({ packageGroup, message: 'Package group updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
