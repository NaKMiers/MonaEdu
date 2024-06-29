import { EditingValues } from '@/app/(admin)/admin/category/all/page'
import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { generateSlug } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'
import { deleteFile, uploadFile } from '@/utils/uploadFile'

// [PUT]: /api/admin/category/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Category -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create course
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { title, description, originalImage } = data
    let image = formData.get('image')

    console.log('image', image)

    // update category
    const set: any = {
      title: (title as string).trim(),
      slug: generateSlug(title as string),
      description: (description as string).trim(),
    }

    // check if new image is uploaded
    if (image) {
      const imageUrl = await uploadFile(image, '1:1')
      set.image = imageUrl

      // delete old image
      await deleteFile(originalImage as string)
    }

    console.log('set', set)

    // update category
    const category = await CategoryModel.findByIdAndUpdate(id, { $set: set }, { new: true })

    // check if category exists
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 })
    }

    // return updated category
    return NextResponse.json({
      category,
      message: `Edited Category: ${category.title}`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
