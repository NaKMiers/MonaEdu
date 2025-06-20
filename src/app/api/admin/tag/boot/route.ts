import { connectDatabase } from '@/config/database'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tag
import '@/models/TagModel'

// [PATCH]: /admin/tag/boot
export async function PATCH(req: NextRequest) {
  console.log('- Boot Tags - ')

  try {
    // connect to database
    await connectDatabase()

    // get tag id to delete
    const { ids, value } = await req.json()

    const [updatedTags] = await Promise.all([
      // get updated tags
      TagModel.find({ _id: { $in: ids } }).lean(),

      // update tags from database
      TagModel.updateMany({ _id: { $in: ids } }, { $set: { boot: value || false } }),
    ])

    if (!updatedTags.length) {
      throw new Error('No tag found')
    }

    // return response
    return NextResponse.json(
      {
        updatedTags,
        message: `Tag ${updatedTags
          .map(tag => `"${tag.title}"`)
          .reverse()
          .join(', ')} ${updatedTags.length > 1 ? 'have' : 'has'} been booted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
