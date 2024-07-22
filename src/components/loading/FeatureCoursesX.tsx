import Divider from '../Divider'
import CourseCardX from '../loading/CourseCardX'
import HeadingX from '../loading/HeadingX'

function FeatureCoursesX() {
  return (
    <div className='bg-dark-100'>
      <Divider size={16} />

      <HeadingX />

      <Divider size={14} />

      {/* Select Tab */}
      <div className='flex justify-center bg-white border-b border-slate-300'>
        <div className='flex gap-1 overflow-x-auto'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className='min-w-[100px] h-[52px] flex-shrink-0 px-3 py-3 bg-slate-300 animate-pulse'
              key={index}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-2 md:gap-21 py-21 px-2 md:px-21/2 overflow-x-auto bg-slate-200'>
        {Array.from({ length: 2 }).map((_, index) => (
          <div className='flex' key={index}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                className='w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0 px-2 md:px-21/2'
                key={index}
              >
                <CourseCardX />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Divider size={16} />
    </div>
  )
}

export default FeatureCoursesX
