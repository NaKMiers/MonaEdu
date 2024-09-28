import Divider from '@/components/Divider'
import BreadcrumbBannerX from '@/components/loading/BreadcrumbBannerX'
import CourseCardX from '@/components/loading/CourseCardX'
import FilterAndSearchX from '@/components/loading/FilterAndSearchX'
import PaginationX from '@/components/loading/PaginationX'
import ShortPaginationX from '@/components/loading/ShortPaginationX'

async function CoursesPageX() {
  return (
    <div>
      {/* Banner */}
      <BreadcrumbBannerX className="-mt-[72px] h-[calc(300px+72px)] rounded-none pt-[72px] md:rounded-b-lg md:shadow-medium" />

      {/* Body */}
      <div className="md:mt-10 md:px-21">
        <div className="flex flex-col gap-x-21 rounded-b-lg bg-white p-3 shadow-lg md:flex-row md:rounded-lg md:p-21">
          {/* Filter & Search */}
          <div className="flex w-full flex-shrink-0 justify-between md:max-w-[200px] lg:max-w-[250px]">
            <FilterAndSearchX />
          </div>

          {/* Main */}
          <div className="w-full flex-1">
            <div className="flex w-full flex-wrap gap-2">
              {/* Mini Pagination */}
              <ShortPaginationX className="hidden flex-1 justify-end md:flex" />
            </div>
            <Divider size={8} />

            {/* List */}
            <div className="mb-8 grid flex-1 grid-cols-1 gap-3 xs:grid-cols-2 md:mx-0 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <CourseCardX key={index} />
              ))}
            </div>

            {/* Pagination */}
            <PaginationX />

            <Divider size={8} />
          </div>
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default CoursesPageX
