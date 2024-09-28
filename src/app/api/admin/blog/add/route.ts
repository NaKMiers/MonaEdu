import { connectDatabase } from '@/config/database'
import { uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'
import BlogModel from '@/models/BlogModel'

// Models: Blog
import '@/models/BlogModel'

// [POST]: /admin/blog/add
export async function POST(req: NextRequest) {
  console.log('- Add Blog -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create course
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { title, content, author, summary, relatedBlogs, booted } = data
    const tags = JSON.parse(data.tags as string)

    let thumbnails = formData.getAll('thumbnails')

    // check images
    if (!thumbnails.length) {
      return NextResponse.json({ message: 'Images are required' }, { status: 400 })
    }

    if (!Array.isArray(thumbnails)) {
      thumbnails = [thumbnails]
    }

    // upload images to aws s3 bucket
    const thumbnailUrls = await Promise.all(thumbnails.map(file => uploadFile(file)))

    // create new course
    const newBlog = await BlogModel.create({
      title,
      content,
      author,
      summary,
      booted,
      tags,
      thumbnails: thumbnailUrls,
    })

    // return new course
    return NextResponse.json({ message: `Blog "${newBlog.title}" has been created` }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
