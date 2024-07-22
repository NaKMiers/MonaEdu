import Divider from '../Divider'
import HeadingX from '../loading/HeadingX'
import CourseCardX from './CourseCardX'

function TopNewCoursesX() {
  return (
    <div className='px-21'>
      <HeadingX />

      <Divider size={16} />

      <div className='max-w-1200 mx-auto'>
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:mx-0 flex-1 mb-8'>
          {Array.from({ length: 8 }).map((_, index) => (
            <CourseCardX key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopNewCoursesX
