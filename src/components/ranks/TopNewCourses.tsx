import { ICourse } from '@/models/CourseModel'
import { memo } from 'react'
import CourseCard from '../CourseCard'
import Divider from '../Divider'
import Heading from '../Heading'

interface TopNewCoursesProps {
  courses: ICourse[]
  className?: string
}

function TopNewCourses({ courses, className = '' }: TopNewCoursesProps) {
  return (
    <div className={`px-21 ${className}`}>
      <Heading title="Khóa học mới" />

      <Divider size={16} />

      <div className="mx-auto max-w-1200">
        <div className="mb-8 grid flex-1 grid-cols-1 gap-3 xs:grid-cols-2 md:mx-0 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {courses.map(course => (
            <CourseCard
              course={course}
              key={course._id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(TopNewCourses)
