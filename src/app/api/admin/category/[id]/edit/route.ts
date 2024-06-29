import { EditingValues } from '@/app/(admin)/admin/category/all/page'
import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { generateSlug } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [PUT]: /api/admin/category/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Category -')

  try {
    // connect to database
    await connectDatabase()

    // get category values to edit
    const { title, description } = await req.json()

    // update category
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: title.trim(),
          slug: generateSlug(title),
          description: description.trim(),
        },
      },
      { new: true }
    )

    return NextResponse.json({
      category,
      message: `Edited Category: ${category.title}`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
