import { connectDatabase } from '@/config/database'
import PackageGroupModel, { IPackageGroup } from '@/models/PackageGroupModel'
import PackageModel from '@/models/PackageModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Package Group, Package
import '@/models/PackageGroupModel'
import '@/models/PackageModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/package/all
export async function GET(req: NextRequest) {
  console.log('- Get All Packages -')

  try {
    // connect to database
    await connectDatabase()

    // get all package groups
    let packageGroups: IPackageGroup[] = await PackageGroupModel.find().lean()

    // get all packages
    const packages = await PackageModel.find().lean()

    // group packages by package group
    packageGroups = packageGroups.map((pg: IPackageGroup) => {
      const pkgs = packages.filter(p => p.packageGroup.toString() === pg._id.toString())

      return {
        ...pg,
        packages: pkgs,
      }
    }) as IPackageGroup[]

    // return response
    return NextResponse.json({ packageGroups }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
