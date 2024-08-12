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
      <Heading title='Khóa học mới' />

      <Divider size={16} />

      <div className='max-w-1200 mx-auto'>
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 md:mx-0 flex-1 mb-8'>
          {courses.map(course => (
            <CourseCard course={course} key={course._id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(TopNewCourses)
