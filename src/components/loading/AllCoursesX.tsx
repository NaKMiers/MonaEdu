import Divider from '../Divider'
import CourseCardX from './CourseCardX'
import HeadingX from './HeadingX'

function AllCoursesX() {
  return (
    <div className='max-w-1200 w-full mx-auto px-21'>
      <div className='flex gap-21 items-center justify-between'>
        <HeadingX align='left' />
        <div className='w-[140px] h-9 bg-slate-700 animate-pulse rounded-3xl' />
      </div>

      <Divider size={8} />

      <div className='flex-1 w-full'>
        {/* List */}
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 md:mx-0 flex-1 mb-8'>
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
