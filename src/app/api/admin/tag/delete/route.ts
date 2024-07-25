import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tag, Course
import '@/models/CourseModel'
import '@/models/TagModel'

// [DELETE]: /admin/tag/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Tags - ')

  try {
    // connect to database
    await connectDatabase()

    // get tag ids to delete
    const { ids } = await req.json()

    // only allow to delete tags that are no courses related to
    const courseExists = await CourseModel.exists({ tags: { $in: ids } })
    if (courseExists) {
      return NextResponse.json(
        { message: 'Cannot delete tags, please delete all related courses first' },
        { status: 400 }
      )
    }

    const [deletedTags] = await Promise.all([
      // get deleted tags
      TagModel.find({ _id: { $in: ids } }).lean(),

      // delete tags from database
      TagModel.deleteMany({ _id: { $in: ids } }),
    ])

    // return response
    return NextResponse.json(
      {
        deletedTags,
        message: `Tag ${deletedTags
          .map(tag => `"${tag.title}"`)
          .reverse()
          .join(', ')} ${deletedTags.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
