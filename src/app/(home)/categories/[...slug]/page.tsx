import BreadcrumbBanner from '@/components/BreadcrumbBanner'
import Divider from '@/components/Divider'
import FilterAndSearch from '@/components/FilterAndSearch'
import Pagination from '@/components/layouts/Pagination'
import ShortPagination from '@/components/layouts/ShortPagination'
import { ICategory } from '@/models/CategoryModel'

function CategoriesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // data
  const category: ICategory | null = null

  return (
    <div>
      {/* Banner */}
      <BreadcrumbBanner
        title='English'
        description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, perspiciatis.'
        className='shadow-medium rounded-b-lg h-[calc(300px+72px)] -mt-[72px] pt-[72px]'
      />

      <Divider size={10} />

      {/* Body */}
      <div className='px-21'>
        <div className='grid grid-cols-12 bg-white rounded-lg gap-21 p-21 shadow-lg'>
          {/* Filter & Search */}
          <div className='col-span-3'>
            <FilterAndSearch />
          </div>

          {/* List */}
          <div className='col-span-9'>
            {/* Top */}
            <div className='flex justify-between'>
              <div className='flex gap-3 items-center'>
                {['Liên quan', 'Phổ biến', 'Mới nhất'].map((item, index) => (
                  <button
                    className='rounded-3xl text-nowrap shadow-md text-lg px-3 py-1.5 font-semibold font-body tracking-wider border-2 border-secondary hover:border-secondary hover:bg-primary text-secondary drop-shadow-md hover:text-dark hover:shadow-lg trans-300'
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Mini Pagination */}
              <ShortPagination
                searchParams={searchParams}
                amount={175}
                itemsPerPage={16}
                className='justify-end'
              />
            </div>

            {/* Pagination */}
            <Pagination dark searchParams={searchParams} amount={175} itemsPerPage={16} />
          </div>
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default CategoriesPage
