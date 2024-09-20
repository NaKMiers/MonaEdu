import { connectDatabase } from '@/config/database'
import BlogModel from '@/models/BlogModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Blog
import '@/models/BlogModel'

// [PATCH]: /admin/blog/change-status
export async function PATCH(req: NextRequest) {
  console.log('- Change Blogs Status - ')

  try {
    // connect to database
    await connectDatabase()

    // get blog id to delete
    const { ids, value } = await req.json()

    const updateSet: any = {
      $set: { status: value || 'draft' },
    }

    if (value === 'published') {
      updateSet.$set.publishedAt = new Date()
    }

    // update blogs, get updated blogs
    const [updatedBlogs] = await Promise.all([
      // get updated blogs
      BlogModel.find({ _id: { $in: ids } }).lean(),

      // update blogs from database
      BlogModel.updateMany({ _id: { $in: ids } }, updateSet),
    ])

    if (!updatedBlogs.length) {
      throw new Error('No blog found')
    }

    // return response
    return NextResponse.json(
      {
        updatedBlogs,
        message: `Blog ${updatedBlogs
          .map(blog => `"${blog.title}"`)
          .reverse()
          .join(', ')} ${updatedBlogs.length > 1 ? 'have' : 'has'} been changed status to "${value}"`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
