import { connectDatabase } from '@/config/database'
import PackageGroupModel from '@/models/PackageGroupModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Package Group
import '@/models/PackageGroupModel'

// [POST]: /admin/package-group/add
export async function POST(req: NextRequest) {
  console.log('- Add Package Group -')

  try {
    // connect to database
    await connectDatabase()

    // get data from request
    const { title, description } = await req.json()

    // add new package group to database
    const packageGroup = await PackageGroupModel.create({ title, description })

    // return response
    return NextResponse.json(
      { packageGroup, message: 'Add Package Group Successfully' },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
