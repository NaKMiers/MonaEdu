import { connectDatabase } from '@/config/database'
import BlogModel, { IBlog } from '@/models/BlogModel'
import { generateSlug, removeDiacritics } from '@/utils'
import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'
// Models: Blog, Category, Tag
import '@/models/BlogModel'
import '@/models/BlogModel'
// [PUT]: /admin/blog/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Blog -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create blog
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { title, content, author, summary, relatedBlogs, booted, status } = data
    const tags = JSON.parse(data.tags as string)
    const originalThumbnails = JSON.parse(data.originalThumbnails as string)
    let thumbnails = formData.getAll('thumbnails')

    // get blog from database to edit
    const blog: IBlog | null = await BlogModel.findById(id).lean()

    // blog does exist
    if (!blog) {
      return NextResponse.json({ message: 'Blog does not exist' }, { status: 404 })
    }

    // upload images to aws s3
    const thumbnailUrls: string[] = await Promise.all(thumbnails.map(file => uploadFile(file)))

    const stayThumbnails = blog.thumbnails.filter(img => originalThumbnails.includes(img))
    const needToRemovedThumbnails = blog.thumbnails.filter(img => !originalThumbnails.includes(img))

    // delete the images do not associated with the blog in aws s3
    if (needToRemovedThumbnails && !!needToRemovedThumbnails.length) {
      await Promise.all(needToRemovedThumbnails.map(image => deleteFile(image)))
    }

    // merge the available images and new upload images
    const newThumbnails = Array.from(new Set([...stayThumbnails, ...thumbnailUrls]))

    // update blog in database
    await BlogModel.findByIdAndUpdate(id, {
      $set: {
        title,
        titleNoDiacritics: removeDiacritics(title as string),
        content,
        author,
        summary,
        booted,
        tags,
        thumbnails: newThumbnails,
        status,
        slug: generateSlug(title as string),
      },
    })

    // return response
    return NextResponse.json({ message: `Blog ${blog.title} has been updated` }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
