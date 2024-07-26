import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import CourseModel from '@/models/CourseModel'
import TagModel from '@/models/TagModel'
import { uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Tag, Category
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/TagModel'

// [POST]: /admin/course/add
export async function POST(req: NextRequest) {
  console.log('- Add Course -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create course
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { title, price, oldPrice, author, textHook, description, active, booted, category } = data
    const tags = JSON.parse(data.tags as string)
    const languages = JSON.parse(data.languages as string)
    let images = formData.getAll('images')

    // check images
    if (!images.length) {
      return NextResponse.json({ message: 'Images are required' }, { status: 400 })
    }

    if (!Array.isArray(images)) {
      images = [images]
    }

    // upload images to aws s3 bucket
    const imageUrls = await Promise.all(images.map(file => uploadFile(file)))

    // create new course
    const newCourse = await CourseModel.create({
      title,
      price,
      author,
      textHook,
      description,
      active,
      booted,
      tags,
      category,
      oldPrice,
      languages,
      images: imageUrls,
    })

    // increase related category and tags course quantity
    await Promise.all([
      TagModel.updateMany({ _id: { $in: tags } }, { $inc: { courseQuantity: 1 } }),
      CategoryModel.updateOne({ _id: category }, { $inc: { courseQuantity: 1 } }),
    ])

    // return new course
    return NextResponse.json(
      { message: `Course "${newCourse.title}" has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
