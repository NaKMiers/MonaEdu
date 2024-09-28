import CourseCardX from './CourseCardX'
import GroupCoursesX from './GroupCoursesX'

function SuggestedListX() {
  return (
    <div className="w-full px-21">
      <div className="mb-2 h-5 w-full max-w-[275px] animate-pulse rounded-md bg-slate-300" />

      <GroupCoursesX
        className="-mx-21/2"
        classChild="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardX key={index} />
        ))}
      </GroupCoursesX>
    </div>
  )
}

export default SuggestedListX
