import { connectDatabase } from '@/config/database'
import BlogModel from '@/models/BlogModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Blog
import '@/models/BlogModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/blog/all
export async function GET(req: NextRequest) {
  console.log('- Get All Blogs -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 9
    const filter: { [key: string]: any } = {}
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

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

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // count amount, get all blogs, get all tags and categories, get all order
    const [amount, blogs] = await Promise.all([
      // get amount of blog
      BlogModel.countDocuments(filter),

      // get all blogs from database
      BlogModel.find(filter).populate('relatedBlogs').sort(sort).skip(skip).limit(itemPerPage).lean(),
    ])

    // return all blogs
    return NextResponse.json({ blogs, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
