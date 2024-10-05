import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { generateSlug, removeDiacritics } from '@/utils'
import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

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

    // build slug
    let slug = generateSlug((title as string).trim())

    // check if category exists
    const category: ICategory | null = await CategoryModel.findById(id).lean()
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 })
    }

    // cannot edit parent category
    const isParent = await CategoryModel.exists({ parentId: id })
    if (isParent) {
      return NextResponse.json({ message: 'Cannot edit parent category' }, { status: 400 })
    }

    // check if parent category exists
    const parent: ICategory | null = await CategoryModel.findById(category.parentId).lean()
    if (parent) {
      slug = `${parent.slug}/${slug}`
    }

    // update category
    const set: any = {
      title: (title as string).trim(),
      titleNoDiacritics: removeDiacritics(title as string),
      description: (description as string).trim(),
      slug,
    }

    // check if new image is uploaded
    if (image) {
      const [imageUrl] = await Promise.all([
        // upload new image
        uploadFile(image, '1:1'),
        // delete old image
        await deleteFile(originalImage as string),
      ])

      set.image = imageUrl
    }

    // update category
    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { $set: set }, { new: true })

    // return updated category
    return NextResponse.json({
      category: updatedCategory,
      message: `Edited Category: ${category.title}`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
