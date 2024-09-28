import { ICourse } from "@/models/CourseModel";
import Link from "next/link";
import CourseCard from "./CourseCard";
import Divider from "./Divider";
import Heading from "./Heading";

interface AllCoursesInterface {
  courses: ICourse[];
  className?: string;
}

function AllCourses({ courses, className = "" }: AllCoursesInterface) {
  return (
    <div className={`mx-auto w-full max-w-1200 px-21 ${className}`}>
      <div className="flex items-center justify-between gap-21">
        <Heading title="Tất cả khóa học" align="left" />
        <Link
          href="/courses"
          className="text-nowrap rounded-3xl bg-primary px-2 py-1 text-center text-xs font-semibold xs:px-4 xs:text-xl"
        >
          Xem thêm
        </Link>
      </div>

      <Divider size={8} />

      <div className="w-full flex-1">
        {/* List */}
        {courses.length > 0 ? (
          <div className="mb-8 grid flex-1 grid-cols-1 gap-3 xs:grid-cols-2 md:mx-0 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard course={course} key={course._id} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center font-body text-lg tracking-wider text-slate-400">
            Không có khóa học nào, hãy thử lại với từ khóa khác
          </p>
        )}

        <Divider size={8} />
      </div>
    </div>
  );
}

export default AllCourses;
