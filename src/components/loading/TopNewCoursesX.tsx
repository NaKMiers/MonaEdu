import Divider from '../Divider'
import HeadingX from '../loading/HeadingX'
import CourseCardX from './CourseCardX'

function TopNewCoursesX() {
  return (
    <div className="px-21">
      <HeadingX />

      <Divider size={16} />

      <div className="mx-auto max-w-1200">
        <div className="mb-8 grid flex-1 grid-cols-1 gap-3 xs:grid-cols-2 md:mx-0 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <CourseCardX key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopNewCoursesX
