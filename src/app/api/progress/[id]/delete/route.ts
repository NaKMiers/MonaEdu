import { connectDatabase } from '@/config/database'
import ProgressModel from '@/models/ProgressModel'
import { NextRequest, NextResponse } from 'next/server'

// models: Progress
import '@/models/ProgressModel'

// [DELETE]: /api/progress/[id]/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Delete Progress - ')

  try {
    // connect database
    await connectDatabase()

    // delete progress
    await ProgressModel.findByIdAndDelete(id)

    // return response
    return NextResponse.json({ message: 'Cập nhật tiến trình thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
