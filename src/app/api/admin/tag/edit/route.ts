import { EditingValues } from '@/app/(admin)/admin/tag/all/page'
import { connectDatabase } from '@/config/database'
import TagModel from '@/models/TagModel'
import { generateSlug } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tag
import '@/models/TagModel'

// [PUT]: /api/admin/tag/edit
export async function PUT(req: NextRequest) {
  console.log('- Edit Tags -')

  try {
    // connect to database
    await connectDatabase()

    // get tag values to edit
    const { editingValues } = await req.json()

    // update tags
    const editedTags = await Promise.all(
      editingValues.map((editValue: EditingValues) =>
        TagModel.findByIdAndUpdate(
          editValue._id,
          {
            $set: {
              title: editValue.title.trim(),
              slug: generateSlug(editValue.title.trim()),
            },
          },
          { new: true }
        )
      )
    )

    return NextResponse.json({
      editedTags,
      message: `Edited Tags: ${editedTags.map(t => t.title).join(', ')}`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
