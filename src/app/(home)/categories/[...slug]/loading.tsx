import Divider from '@/components/Divider'
import BreadcrumbBannerX from '@/components/loading/BreadcrumbBannerX'
import CourseCardX from '@/components/loading/CourseCardX'
import FilterAndSearchX from '@/components/loading/FilterAndSearchX'
import PaginationX from '@/components/loading/PaginationX'
import ShortPaginationX from '@/components/loading/ShortPaginationX'

async function Loading() {
  return (
    <div>
      {/* Banner */}
      <BreadcrumbBannerX className='md:shadow-medium md:rounded-b-lg rounded-none h-[calc(300px+72px)] -mt-[72px] pt-[72px]' />

      {/* Body */}
      <div className='md:px-21 md:mt-10'>
        <div className='flex flex-col md:flex-row bg-white rounded-b-lg md:rounded-lg gap-21 p-3 md:p-21 shadow-lg'>
          {/* Filter & Search */}
          <div className='flex justify-between md:max-w-[200px] lg:max-w-[250px] w-full flex-shrink-0'>
            <FilterAndSearchX />
          </div>

          {/* Main */}
          <div className='flex-1 w-full'>
            {/* Top */}
            <div className='flex flex-wrap gap-2 w-full'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className='rounded-3xl h-[42px] w-full max-w-[100px] bg-slate-700 animate-pulse'
                  key={index}
                />
              ))}

              {/* Mini Pagination */}
              <ShortPaginationX className='justify-end hidden md:flex flex-1' />
            </div>

            <Divider size={8} />

            {/* List */}
            <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:mx-0 flex-1 mb-8'>
              {Array.from({ length: 8 }).map((_, index) => (
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

export default Loading
