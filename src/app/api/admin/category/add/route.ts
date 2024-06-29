import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'
import { uploadFile } from '@/utils/uploadFile'

// [POST]: /admin/category/add
export async function POST(req: NextRequest) {
  console.log('- Add Category -')

  try {
    // connect to database
    await connectDatabase()

    // get data to add category
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { parentId, title, description } = data
    let image = formData.get('image')

    // check if image is required
    if (!image) {
      return NextResponse.json({ message: 'Image is required' }, { status: 400 })
    }

    // upload image storage
    const imageUrl = await uploadFile(image, '1:1')

    // create new category
    const category: ICategory = await CategoryModel.create({
      parentId: parentId || null,
      title: (title as string).trim(),
      description: (description as string).trim(),
      image: imageUrl,
    })

    // stay current page
    return NextResponse.json(
      { category, message: `Category "${category.title}" has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
