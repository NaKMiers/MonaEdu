import { connectDatabase } from "@/config/database";
import CategoryModel from "@/models/CategoryModel";
import { NextRequest, NextResponse } from "next/server";

// Models: Category
import "@/models/CategoryModel";

// [PATCH]: /admin/category/boot
export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  console.log("- Boot Category - ");

  try {
    // connect to database
    await connectDatabase();

    // get value to boot
    const { value } = await req.json();

    // update categories from database
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: { booted: value || false } },
      { new: true }
    );

    // check if category is not found
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // get sub categories
    const subCategories = await CategoryModel.find({ parentId: category._id });
    category.subs = subCategories;

    // return response
    return NextResponse.json(
      {
        category,
        message: `Category has been booted`,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
