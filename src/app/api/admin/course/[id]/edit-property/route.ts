import { connectDatabase } from '@/config/database'
import CourseModel, { ICourse } from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course
import '@/models/CourseModel'

// [PATCH]: /admin/course/:id/edit-property
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Update Course Property -')

  try {
    // connect to database
    await connectDatabase()

    // get data to update course property
    const { property, value } = await req.json()

    // check if course exists
    const course: ICourse | null = await CourseModel.findById(id)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    let updatedCourse = null

    // update course property
    if (property === 'likes') {
      const realLikes = course.likes.filter(Boolean)
      const neededLikes = +value - realLikes.length
      const likes = [...realLikes, ...Array(neededLikes).fill(null)]

      // update likes
      updatedCourse = await CourseModel.findByIdAndUpdate(id, { $set: { likes } }, { new: true })
    } else {
      // update property
      updatedCourse = await CourseModel.findByIdAndUpdate(
        id,
        { $set: { [property]: value } },
        { new: true }
      )
    }

    // return updated course
    return NextResponse.json(
      { updatedCourse, message: `Updated "${property}" successfully` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
