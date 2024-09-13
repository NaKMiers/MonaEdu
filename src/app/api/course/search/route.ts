import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category
import '@/models/CourseModel'
import '@/models/CategoryModel'

// [GET]: /course/search?search=...
export async function GET(req: NextRequest) {
  console.log('- Search -')

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

    // create $or array for text fields
    const orArray: any[] = ['title', 'titleNoDiacritics', 'citing', 'author', 'slug'].map(field => ({
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
    const categoryFields = ['title', 'slug'].map(field => ({
      [field]: { $regex: search, $options: 'i' },
    }))

    const categories = await CategoryModel.find({
      $or: categoryFields,
    }).distinct('_id')

    orArray.push({ category: { $in: categories } })
    filter.$or = orArray

    // find courses by category base on search params
    let courses: ICourse[] = await CourseModel.find(filter).sort(sort).lean()

    // return response
    return NextResponse.json({ courses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
