import { connectDatabase } from "@/config/database";
import ChapterModel, { IChapter } from "@/models/ChapterModel";
import CourseModel, { ICourse } from "@/models/CourseModel";
import LessonModel, { ILesson } from "@/models/LessonModel";
import { NextRequest, NextResponse } from "next/server";

// Models: Course, Tag, Category, FlashSale, Chapter, Lesson,
import "@/models/CategoryModel";
import "@/models/ChapterModel";
import "@/models/CourseModel";
import "@/models/FlashSaleModel";
import "@/models/LessonModel";
import "@/models/TagModel";

export const dynamic = "force-dynamic";

// [GET]: /course/:slug
export async function GET(
  req: NextRequest,
  { params: { slug } }: { params: { slug: string } }
) {
  console.log("- Get Course Page -");

  try {
    // connect to database
    await connectDatabase();

    // get course from database
    const course: ICourse | null = await CourseModel.findOne({
      slug: encodeURIComponent(slug),
      active: true,
    })
      .populate("tags category flashSale")
      .lean();

    // check if course is not found
    if (!course) {
      return NextResponse.json(
        { message: "Không tìm thấy khóa học" },
        { status: 404 }
      );
    }

    // get all chapters and lessons of course
    const chapters: IChapter[] = await ChapterModel.find({
      courseId: course._id,
    }).lean();
    const lessons: ILesson[] = await LessonModel.find({
      courseId: course._id,
    }).lean();

    // add lessons to each chapter
    const chaptersWithLessons = chapters.map((chapter) => {
      const chapterLessons = lessons.filter(
        (lesson) => lesson.chapterId.toString() === chapter._id.toString()
      );
      return { ...chapter, lessons: chapterLessons };
    });

    // return course with chapters and lessons
    return NextResponse.json(
      { course, chapters: chaptersWithLessons },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
