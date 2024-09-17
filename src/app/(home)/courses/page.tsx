import BeamsBackground from '@/components/backgrounds/BeamsBackground'
import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import FilterAndSearch from '@/components/FilterAndSearch'
import Pagination from '@/components/layouts/Pagination'
import ShortPagination from '@/components/layouts/ShortPagination'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { getCoursesPageApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { stripHTML } from '@/utils/string'
import moment from 'moment-timezone'
import { Metadata } from 'next'
import Link from 'next/link'
import { FaAngleRight } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Tất cả khóa học - Mona Edu',
  description: 'Mona Edu - Học trực tuyến mọi lúc, mọi nơi',
}

async function CoursesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // data
  let courses: ICourse[] = []
  let amount: number = 0
  let chops: any = null

  // get data
  try {
    const query = handleQuery(searchParams)

    // get data
    const data = await getCoursesPageApi(query, { next: { revalidate: 60 } })
    courses = data.courses
    amount = data.amount
    chops = data.chops
  } catch (err: any) {
    // return notFound()
  }

  // jsonLd
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: stripHTML(course.description),
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`,
        provider: {
          '@type': 'Organization',
          name: 'Mona Edu',
          sameAs: `${process.env.NEXT_PUBLIC_APP_URL}`,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'VND',
          price: course?.price,
          availability: 'https://schema.org/InStock',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/${course?.slug}`,
          seller: {
            '@type': 'Organization',
            name: 'Mona Edu',
          },
          category: (course?.category as ICategory)?.title,
        },
        hasCourseInstance: [
          {
            '@type': 'CourseInstance',
            courseMode: 'online',
            instructor: {
              '@type': 'Person',
              name: course.author,
            },
            startDate: moment(course.createdAt).toISOString(),
            location: {
              '@type': 'Place',
              name: 'Online',
            },
            url: `${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`,
            courseWorkload: `PT${course.duration % 3600}H${(course.duration % 3600) % 60}M`,
          },
        ],
      },
    })),
  }

  return (
    <div>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Banner */}
      <div className='relative flex flex-col justify-center items-center p-3 overflow-y-auto bg-neutral-950 bg-opacity-50 mx-auto overflow-hidden md:shadow-medium md:rounded-b-lg rounded-none h-[calc(300px+72px)] -mt-[72px] pt-[72px]'>
        <div className='absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />
        <BeamsBackground />

        <div className='flex items-center flex-wrap justify-center gap-x-3 gap-y-1 relative z-20 text-slate-400 text-nowrap'>
          <Link href='/' className='hover:text-primary trans-200 hover:drop-shadow-md'>
            trang-chu
          </Link>
          <FaAngleRight size={14} />
          <Link href='/courses' className='hover:text-primary trans-200 hover:drop-shadow-md'>
            tat-ca-khoa-hoc
          </Link>
        </div>

        <Divider size={3} />

        <h2 className='text-white text-2xl md:text-6xl font-bold text-center relative z-20'>
          Tất Cả Khóa Học
        </h2>
        <p className='text-white text-sm md:text-base max-w-xl mt-6 text-center relative z-20'>
          Mona Edu - Học trực tuyến mọi lúc, mọi nơi
        </p>
      </div>

      {/* Body */}
      <div className='md:px-21 md:mt-10'>
        <div className='flex flex-col md:flex-row bg-white rounded-b-lg md:rounded-lg gap-x-21 p-3 md:p-21 shadow-lg'>
          {/* Filter & Search */}
          <div className='flex justify-between md:max-w-[200px] lg:max-w-[250px] w-full flex-shrink-0'>
            <FilterAndSearch searchParams={searchParams} subs={[]} chops={chops} />
          </div>

          {/* Main */}
          <div className='flex-1 w-full'>
            <div className='flex flex-wrap gap-2 w-full'>
              {/* Mini Pagination */}
              <ShortPagination
                searchParams={searchParams}
                amount={amount}
                itemsPerPage={16}
                className='justify-end hidden md:flex flex-1'
              />
            </div>
            <Divider size={8} />

            {/* List */}
            {courses.length > 0 ? (
              <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:mx-0 flex-1 mb-8'>
                {courses.map(course => (
                  <CourseCard course={course} key={course._id} />
                ))}
              </div>
            ) : (
              <p className='font-body tracking-wider text-center text-slate-400 text-lg py-8'>
                Không có khóa học nào, hãy thử lại với từ khóa khác
              </p>
            )}

            {/* Pagination */}
            <Pagination dark searchParams={searchParams} amount={amount} itemsPerPage={16} />

            <Divider size={8} />
          </div>
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default CoursesPage
