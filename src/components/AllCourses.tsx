import { ICourse } from '@/models/CourseModel'
import Link from 'next/link'
import CourseCard from './CourseCard'
import Divider from './Divider'
import Heading from './Heading'

interface AllCoursesInterface {
  courses: ICourse[]
  className?: string
}

function AllCourses({ courses, className = '' }: AllCoursesInterface) {
  return (
    <div className={`max-w-1200 w-full mx-auto px-21 ${className}`}>
      <div className='flex gap-21 items-center justify-between'>
        <Heading title='Tất cả khóa học' align='left' />
        <Link
          href='/courses'
          className='text-nowrap text-xs xs:text-xl font-semibold bg-primary px-2 xs:px-4 py-1 rounded-3xl text-center'
        >
          Xem thêm
        </Link>
      </div>

      <Divider size={8} />

      <div className='flex-1 w-full'>
        {/* List */}
        {courses.length > 0 ? (
          <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 md:mx-0 flex-1 mb-8'>
            {courses.map(course => (
              <CourseCard course={course} key={course._id} />
            ))}
          </div>
        ) : (
          <p className='font-body tracking-wider text-center text-slate-400 text-lg py-8'>
            Không có khóa học nào, hãy thử lại với từ khóa khác
          </p>
        )}

        <Divider size={8} />
      </div>
    </div>
  )
}

export default AllCourses
