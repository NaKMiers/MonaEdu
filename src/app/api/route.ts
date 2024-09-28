import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import CourseModel from '@/models/CourseModel'
import PackageGroupModel, { IPackageGroup } from '@/models/PackageGroupModel'
import PackageModel from '@/models/PackageModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category, Package Group, Package, Flash Sale
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'
import '@/models/PackageGroupModel'
import '@/models/PackageModel'

export const dynamic = 'force-dynamic'

// [GET]: /
export async function GET(req: NextRequest) {
  console.log(' - Get Home Page - ')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 12
    const filter: { [key: string]: any } = { active: true }
    let sort: { [key: string]: any } = { updatedAt: -1 }

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (key === 'limit') {
          if (params[key][0] === 'no-limit') {
            itemPerPage = Number.MAX_SAFE_INTEGER
            skip = 0
          } else {
            itemPerPage = +params[key][0]
          }
          continue
        }

        // Special Cases ---------------------
        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['title', 'titleNoDiacritics', 'author', 'citing', 'slug']

          filter.$or = searchFields.map(field => ({
            [field]: { $regex: params[key][0], $options: 'i' },
          }))
          continue
        }

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        if (key === 'price' || key === 'joined') {
          const from = +params[key][0].split('-')[0]
          const to = +params[key][0].split('-')[1]
          if (from >= 0 && to >= 0) {
            filter[key] = {
              $gte: from,
              $lte: to,
            }
          } else if (from >= 0) {
            filter[key] = {
              $gte: from,
            }
          } else if (to >= 0) {
            filter[key] = {
              $lte: to,
            }
          }
          continue
        }

        if (key === 'flashSale') {
          filter[key] =
            params[key][0] === 'true' ? { $exists: true, $ne: null } : { $exists: false, $eq: null }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    let [
      bannerCourses,
      bestSellers,
      newCourses,
      bootedCourses,
      courses,
      amount,
      packageGroups,
      packages,
    ] = await Promise.all([
      // get banner courses
      CourseModel.find({
        active: true,
      })
        .populate({
          path: 'category',
          select: 'title slug',
        })
        .sort({ joined: -1 })
        // Math.floor(Math.random() * (40 - 8 + 1)) + 8
        .skip(0)
        .limit(8)
        .lean(),

      // get best sellers
      CourseModel.find({ active: true })
        .populate({
          path: 'category',
          select: 'title slug',
        })
        .sort({ joined: -1 })
        .limit(8)
        .lean(),

      // get new courses
      CourseModel.find({ active: true })
        .populate({
          path: 'category',
          select: 'title slug',
        })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),

      // get booted courses
      CourseModel.find({ booted: true, active: true })
        .populate({
          path: 'category',
          select: 'title slug',
        })
        .lean(),

      // get some courses
      CourseModel.find(filter)
        .populate({
          path: 'category',
          select: 'title slug',
        })
        .sort(sort)
        .skip(skip)
        .limit(itemPerPage)
        .lean(),

      // count total courses
      CourseModel.countDocuments(filter),

      // get all package groups
      PackageGroupModel.find().lean(),

      // get all packages
      PackageModel.find({ active: true }).populate('flashSale').sort({ createdAt: 1 }).lean(),
    ])

    // categories's slugs from booted courses
    const categoriesFromBootedCourses = bootedCourses
      .filter(course => course.category?.slug)
      .map(course => course.category.slug.split('/')[0])

    // get categories from booted courses
    const categories = await CategoryModel.find({
      slug: { $in: categoriesFromBootedCourses },
      parentId: null,
    })
      .select('title slug')
      .lean()

    // group booted courses by category
    const groupedBootedCourses = categories.map(category => {
      const courses = bootedCourses.filter(course => course.category.slug.includes(category.slug))

      return {
        category,
        courses,
      }
    })

    // group packages by package group
    packageGroups = packageGroups
      .map((pg: any) => {
        const pkgs = packages.filter(p => p.packageGroup.toString() === pg._id.toString())

        return {
          ...pg,
          packages: pkgs,
        }
      })
      .filter((pg: any) => pg.packages.length > 0) as IPackageGroup[]

    // return response
    return NextResponse.json(
      { bannerCourses, bestSellers, newCourses, groupedBootedCourses, packageGroups, courses, amount },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
