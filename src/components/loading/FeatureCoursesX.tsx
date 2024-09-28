import Divider from '../Divider'
import CourseCardX from '../loading/CourseCardX'
import HeadingX from '../loading/HeadingX'

function FeatureCoursesX() {
  return (
    <div className="bg-dark-100">
      <Divider size={16} />

      <HeadingX />

      <Divider size={14} />

      {/* Select Tab */}
      <div className="flex justify-center border-b border-slate-300 bg-white">
        <div className="flex gap-1 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className="h-[52px] min-w-[100px] flex-shrink-0 animate-pulse bg-slate-300 px-3 py-3"
              key={index}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 overflow-x-auto bg-slate-200 px-2 py-21 md:gap-21 md:px-21/2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            className="flex"
            key={index}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                className="w-1/2 flex-shrink-0 px-2 md:w-1/3 md:px-21/2 lg:w-1/4 xl:w-1/5"
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
