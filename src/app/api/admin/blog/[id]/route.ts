import { connectDatabase } from '@/config/database'
import BlogModel from '@/models/BlogModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Blog
import '@/models/BlogModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/blog/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Blog -')

  try {
    // connect to database
    await connectDatabase()

    // get blog from database
    const blog = await BlogModel.findById(id).lean()

    console.log('Blog:', blog)

    // return blog
    return NextResponse.json({ blog, message: 'Blog found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
