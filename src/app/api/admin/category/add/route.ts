import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [POST]: /admin/category/add
export async function POST(req: NextRequest) {
  console.log('- Add Category -')

  try {
    // connect to database
    await connectDatabase()

    // get data field to add new category
    const { parentId, title, description } = await req.json()

    console.log('parentId', parentId)
    console.log('title', title)
    console.log('description', description)

    // create new category
    const category: ICategory = await CategoryModel.create({
      parentId: parentId || null,
      title: title.trim(),
      description: description.trim(),
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
