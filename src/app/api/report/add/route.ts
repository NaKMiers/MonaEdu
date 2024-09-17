// Models: Report

import { connectDatabase } from '@/config/database'
import ReportModel from '@/models/ReportModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Report
import '@/models/ReportModel'

// [POST]: /report/add
export async function POST(req: NextRequest) {
  console.log('- Add Report - ')

  try {
    // connect to database
    await connectDatabase()

    // get user id
    const token = await getToken({ req })
    const userId = token?._id

    // check user id
    if (!userId) {
      return NextResponse.json({ message: 'Xác thực thất bại' }, { status: 404 })
    }

    // get data from request
    const { type, content, link } = await req.json()

    // create report
    await ReportModel.create({
      userId,
      type,
      content,
      link,
    })

    // return response
    return NextResponse.json({ message: 'Báo cáo thành công' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
