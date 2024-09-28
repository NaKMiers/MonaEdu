import Divider from '../Divider'
import CourseCardX from './CourseCardX'
import HeadingX from './HeadingX'

function AllCoursesX() {
  return (
    <div className="mx-auto w-full max-w-1200 px-21">
      <div className="flex items-center justify-between gap-21">
        <HeadingX align="left" />
        <div className="h-9 w-[140px] animate-pulse rounded-3xl bg-slate-700" />
      </div>

      <Divider size={8} />

      <div className="w-full flex-1">
        {/* List */}
        <div className="mb-8 grid flex-1 grid-cols-1 gap-3 xs:grid-cols-2 md:mx-0 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <CourseCardX key={index} />
          ))}
        </div>

        <Divider size={8} />
      </div>
    </div>
  )
}

export default AllCoursesX
