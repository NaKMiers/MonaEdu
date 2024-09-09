import { connectDatabase } from '@/config/database'
import PackageModel from '@/models/PackageModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Package Group, Package
import '@/models/asdPackageGroupModel'
import PackageGroupModel from '@/models/asdPackageGroupModel'
import '@/models/PackageModel'

// [DELETE]: /admin/package-group/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Packages -')

  try {
    // connect to database
    await connectDatabase()

    // get package ids to delete
    const { ids } = await req.json()

    // only allow to delete package group if they have no package
    const packageExists = await PackageModel.exists({ packageGroup: { $in: ids } })

    if (packageExists) {
      return NextResponse.json(
        { message: 'Cannot delete package groups, please delete all packages first' },
        { status: 400 }
      )
    }

    // get deleted package groups
    const deletedPackageGroups = await PackageGroupModel.find({ _id: { $in: ids } }).lean()

    // delete package groups
    await PackageGroupModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedPackageGroups,
        message: `Package Group ${deletedPackageGroups
          .map(pG => `"${pG.title}"`)
          .reverse()
          .join(', ')} ${deletedPackageGroups.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
