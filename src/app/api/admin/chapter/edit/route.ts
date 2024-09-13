import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import { removeDiacritics } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

// Models: Chapter
import '@/models/ChapterModel'

// [PUT]: /api/admin/chapter/edit
export async function PUT(req: NextRequest) {
  console.log('- Edit Chapter -')

  try {
    // connect to database
    await connectDatabase()

    // get chapter values to edit
    const { id, title, content, order } = await req.json()

    // update chapter
    const updatedChapter = await ChapterModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          titleNoDiacritics: removeDiacritics(title),
          content,
          order,
        },
      },
      { new: true }
    )

    // return response
    return NextResponse.json({
      updatedChapter,
      message: `Edited Chapter: ${updatedChapter.title} has been updated`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
