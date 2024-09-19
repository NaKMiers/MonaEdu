import { connectDatabase } from '@/config/database'
import BlogModel, { IBlog } from '@/models/BlogModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Blog
import '@/models/BlogModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/blog/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Blog Page -')

  try {
    // connect to database
    await connectDatabase()

    // get blog
    const blog: IBlog | null = await BlogModel.findOne({ slug, status: 'published' }).lean()

    if (!blog) {
      return NextResponse.json({ message: 'Không tìm thấy bài viết' }, { status: 404 })
    }

    // get suggested blogs
    const suggestedBlogs = await BlogModel.aggregate([
      { $match: { status: 'published', _id: { $ne: blog._id } } },
      { $sample: { size: 8 } },
    ])

    // return response
    return NextResponse.json({ blog, suggestedBlogs }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
