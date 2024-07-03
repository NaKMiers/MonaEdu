import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/category/all
export async function GET(req: NextRequest) {
  console.log('- Get All Categories -')

  try {
    // connect to database
    await connectDatabase()

    // get all categories from database
    const categories = await CategoryModel.find({}).sort({ courseQuantity: -1 }).lean()

    // Function to build the tree
    const buildTree = (categories: any[], parentId: string | null = null): any[] => {
      return categories
        .filter(
          (category: any) =>
            (category.parentId ? category.parentId.toString() : null) ===
            (parentId ? parentId.toString() : null)
        )
        .map(category => ({
          ...category,
          subs: {
            ref: category._id,
            data: buildTree(categories, category._id),
          },
        }))
    }

    // Build and return the tree
    const tree = buildTree(categories)

    return NextResponse.json({ categories: tree }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
