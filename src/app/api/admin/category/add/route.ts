import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'
import { uploadFile } from '@/utils/uploadFile'
import { generateSlug } from '@/utils'

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

    // build slug
    let slug = generateSlug((title as string).trim())

    if (parentId) {
      const parent: ICategory | null = await CategoryModel.findById(parentId).lean()
      if (!parent) {
        return NextResponse.json({ message: 'Parent category not found' }, { status: 404 })
      }

      slug = `${parent.slug}/${slug}`
    }

    const set: any = {
      parentId: parentId || null,
      title: (title as string).trim(),
      description: (description as string).trim(),
      slug,
    }

    console.log('set', set)

    // check if image is required
    if (image) {
      // upload image storage
      const imageUrl = await uploadFile(image, '1:1')
      set.image = imageUrl
    }

    // create new category
    const category: ICategory = await CategoryModel.create(set)

    // stay current page
    return NextResponse.json(
      { category, message: `Category "${category.title}" has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
