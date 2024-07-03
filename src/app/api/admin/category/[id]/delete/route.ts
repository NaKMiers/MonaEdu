import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel from '@/models/CourseModel'

// Models: Category, Course
import '@/models/CategoryModel'
import '@/models/CourseModel'
import { deleteFile } from '@/utils/uploadFile'

// [DELETE]: /admin/category/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Delete Category - ')

  try {
    // connect to database
    await connectDatabase()

    // only allow delete category when:
    // - no sub categories
    // - no courses

    // check if category is a parent of any category
    const isParent = await CategoryModel.exists({ parentId: id })
    if (isParent) {
      return NextResponse.json(
        { message: `Cannot delete this category, please delete category children first!` },
        { status: 400 }
      )
    }

    // check if category is a parent of any course
    const isParentCourse = await CourseModel.exists({ categoryId: id })
    if (isParentCourse) {
      return NextResponse.json(
        { message: `Cannot delete this category, please delete courses first!` },
        { status: 400 }
      )
    }

    // delete category
    const category = await CategoryModel.findByIdAndDelete(id)

    // delete category image from storage
    if (category.image) {
      await deleteFile(category.image)
    }

    // return response
    return NextResponse.json({ category, message: `Category has been deleted` }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
