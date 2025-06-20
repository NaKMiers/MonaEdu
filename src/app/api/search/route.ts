import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category
import '@/models/CategoryModel'
import '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /search?key=value&...
export async function GET(req: NextRequest) {
  console.log('- Get Search Page -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    // get email and token from query
    const searchParams = req.nextUrl.searchParams
    const search: string = searchParams.get('search') || ''

    // options
    const filter: { [key: string]: any } = { active: true }
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // build filter
    const searchFields = ['title', 'titleNoDiacritics', 'citing', 'author', 'slug']

    // create $or array for text fields
    const orArray: any[] = searchFields.map(field => ({
      [field]: { $regex: search, $options: 'i' },
    }))

    // Try to convert search query to number for price and oldPrice and joined fields
    const num = Number(search)
    if (!isNaN(num)) {
      orArray.push({ price: num })
      orArray.push({ oldPrice: num })
      orArray.push({ joined: num })
    }

    // search by category
    const categoryFields = ['title', 'titleNoDiacritics', 'slug'].map(field => ({
      [field]: { $regex: search, $options: 'i' },
    }))

    const categories = await CategoryModel.find({
      $or: categoryFields,
    }).distinct('_id')

    orArray.push({ category: { $in: categories } })
    filter.$or = orArray

    // get amount, get courses
    const [amount, courses] = await Promise.all([
      // get amount of courses
      CourseModel.countDocuments(filter),

      // find courses by category base on search params
      CourseModel.find(filter).sort(sort).lean(),
    ])

    // return response
    return NextResponse.json({ courses, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
