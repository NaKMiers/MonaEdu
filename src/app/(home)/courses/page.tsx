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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Banner */}
      <div className="relative mx-auto -mt-[72px] flex h-[calc(300px+72px)] flex-col items-center justify-center overflow-hidden overflow-y-auto rounded-none bg-neutral-950 bg-opacity-50 p-3 pt-[72px] md:rounded-b-lg md:shadow-medium">
        <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />
        <BeamsBackground />

        <div className="relative z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-nowrap text-slate-400">
          <Link
            href="/"
            className="trans-200 hover:text-primary hover:drop-shadow-md"
          >
            trang-chu
          </Link>
          <FaAngleRight size={14} />
          <Link
            href="/courses"
            className="trans-200 hover:text-primary hover:drop-shadow-md"
          >
            tat-ca-khoa-hoc
          </Link>
        </div>

        <Divider size={3} />

        <h2 className="relative z-20 text-center text-2xl font-bold text-light md:text-6xl">
          Tất Cả Khóa Học
        </h2>
        <p className="relative z-20 mt-6 max-w-xl text-center text-sm text-light md:text-base">
          Mona Edu - Học trực tuyến mọi lúc, mọi nơi
        </p>
      </div>

      {/* Body */}
      <div className="md:mt-10 md:px-21">
        <div className="flex flex-col gap-x-21 rounded-b-lg bg-white p-3 shadow-lg md:flex-row md:rounded-lg md:p-21">
          {/* Filter & Search */}
          <div className="flex w-full flex-shrink-0 justify-between md:max-w-[200px] lg:max-w-[250px]">
            <FilterAndSearch
              searchParams={searchParams}
              subs={[]}
              chops={chops}
            />
          </div>

          {/* Main */}
          <div className="w-full flex-1">
            <div className="flex w-full flex-wrap gap-2">
              {/* Mini Pagination */}
              <ShortPagination
                searchParams={searchParams}
                amount={amount}
                itemsPerPage={16}
                className="hidden flex-1 justify-end md:flex"
              />
            </div>
            <Divider size={8} />

            {/* List */}
            {courses.length > 0 ? (
              <div className="mb-8 grid flex-1 grid-cols-1 gap-3 xs:grid-cols-2 md:mx-0 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                {courses.map(course => (
                  <CourseCard
                    course={course}
                    key={course._id}
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center font-body text-lg tracking-wider text-slate-400">
                Không có khóa học nào, hãy thử lại với từ khóa khác
              </p>
            )}

            {/* Pagination */}
            <Pagination
              dark
              searchParams={searchParams}
              amount={amount}
              itemsPerPage={16}
            />

            <Divider size={8} />
          </div>
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default CoursesPage
