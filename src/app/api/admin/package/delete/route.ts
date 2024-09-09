import { connectDatabase } from '@/config/database'
import PackageGroupModel from '@/models/asdPackageGroupModel'
import PackageModel from '@/models/PackageModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Package Group, Package
import '@/models/asdPackageGroupModel'
import '@/models/PackageModel'

// [DELETE]: /admin/package/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Packages -')

  try {
    // connect to database
    await connectDatabase()

    // get package ids to delete
    const { ids } = await req.json()

    // delete packages
    const deletedPackages = await PackageModel.find({ _id: { $in: ids } })

    // delete packages
    await PackageModel.deleteMany({ _id: { $in: ids } })

    // decrease package mount in package group
    await Promise.all(
      deletedPackages.map(async (p: any) => {
        await PackageGroupModel.findByIdAndUpdate(p.packageGroup, { $inc: { packageAmount: -1 } })
      })
    )

    // return response
    return NextResponse.json(
      {
        message: `${deletedPackages.length} package${deletedPackages.length != 1 ? 's' : ''} ${
          deletedPackages.length != 1 ? 'have' : 'has'
        } been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
