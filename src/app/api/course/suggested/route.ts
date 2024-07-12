import { connectDatabase } from "@/config/database";
import CategoryModel from "@/models/CategoryModel";
import CourseModel from "@/models/CourseModel";
import { searchParamsToObject } from "@/utils/handleQuery";
import { NextRequest, NextResponse } from "next/server";

// Models: Course, Category
import "@/models/CategoryModel";
import "@/models/CourseModel";

// [GET]: /course/suggested
export async function GET(req: NextRequest) {
  console.log("- Get Suggested Courses - ");

  try {
    // connect to database
    await connectDatabase();

    // get search params
    const params: { [key: string]: string[] } = searchParamsToObject(
      req.nextUrl.searchParams
    );
    const coursesInCart = params["courses"];

    // get coursesInCart
    const baseCourses = await CourseModel.find({ _id: { $in: coursesInCart } })
      .populate({
        path: "category",
        select: "slug",
      })
      .lean();

    const cates = baseCourses
      .map((course) => course.category && course.category.slug.split("/")[0])
      .filter((cat) => cat);

    // Check if 'cates' is not empty
    if (cates.length <= 0) {
      return NextResponse.json({ courses: [] }, { status: 200 });
    }

    const categoryIds: any = await CategoryModel.find({
      $or: cates.map((cat) => ({ slug: { $regex: cat, $options: "i" } })),
    }).distinct("_id");

    // get suggested courses
    const suggestedCourses = await CourseModel.find({
      category: { $in: categoryIds },
      _id: { $nin: coursesInCart },
    })
      .limit(6)
      .lean();

    // check if suggestedCourses less than 6
    if (suggestedCourses.length < 6) {
      const moreCourses = await CourseModel.find({
        _id: {
          $nin: [
            ...coursesInCart,
            ...suggestedCourses.map((course) => course._id),
          ],
        },
      })
        .limit(6 - suggestedCourses.length)
        .sort({ joined: -1 })
        .lean();

      suggestedCourses.push(...moreCourses);
    }

    // return response
    return NextResponse.json({ courses: suggestedCourses }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
