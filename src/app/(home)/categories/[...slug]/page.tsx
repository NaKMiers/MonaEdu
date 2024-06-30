import BreadcrumbBanner from '@/components/BreadcrumbBanner'
import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import FilterAndSearch from '@/components/FilterAndSearch'
import Pagination from '@/components/layouts/Pagination'
import ShortPagination from '@/components/layouts/ShortPagination'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { getCategoryPageApi } from '@/requests'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

async function CategoriesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  const headerList = headers()
  const pathname = headerList.get('x-current-path')
  const slug = pathname?.split('/').pop()

  // data
  let category: ICategory | null = null
  let subs: ICategory[] = []
  let courses: ICourse[] = []

  // get data
  try {
    if (!slug) throw new Error('Không tìm thấy danh mục')

    const data = await getCategoryPageApi(slug)
    category = data.category
    subs = data.subs
    courses = data.courses
  } catch (err: any) {
    return redirect('/categories')
  }

  return (
    <div>
      {/* Banner */}
      <BreadcrumbBanner
        title={category?.title || 'Danh Mục'}
        description={category?.description || 'Danh sách các khóa học trong danh mục này'}
        className='md:shadow-medium md:rounded-b-lg rounded-none h-[calc(300px+72px)] -mt-[72px] pt-[72px]'
      />

      {/* Body */}
      <div className='md:px-21 md:mt-10'>
        <div className='flex flex-col md:flex-row bg-white rounded-b-lg md:rounded-lg gap-21 p-3 md:p-21 shadow-lg'>
          {/* Filter & Search */}
          <div className='flex justify-between max-w-[200px] lg:max-w-[250px] w-full flex-shrink-0'>
            <FilterAndSearch subs={subs} />
          </div>

          {/* Main */}
          <div className='flex-1 w-full'>
            {/* Top */}
            <div className='flex flex-wrap gap-2 w-full'>
              {['Liên quan', 'Phổ biến', 'Mới nhất', 'Cũ nhất', 'Yêu thích nhất'].map((item, index) => (
                <button
                  className='rounded-3xl text-nowrap shadow-md px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-lg font-semibold font-body tracking-wider border-2 border-secondary hover:border-secondary hover:bg-primary text-secondary hover:drop-shadow-lg hover:text-dark hover:shadow-lg trans-300'
                  key={index}
                >
                  {item}
                </button>
              ))}

              {/* Mini Pagination */}
              <ShortPagination
                searchParams={searchParams}
                amount={175}
                itemsPerPage={16}
                className='justify-end hidden md:flex flex-1'
              />
            </div>

            <Divider size={8} />

            {/* List */}
            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:mx-0 flex-1'>
              {courses.map(course => (
                <CourseCard course={course} key={course._id} />
              ))}
            </div>

            <Divider size={8} />

            {/* Pagination */}
            {/* <Pagination dark searchParams={searchParams} amount={175} itemsPerPage={16} /> */}

            <Divider size={8} />
          </div>
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default CategoriesPage
