import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import Pagination from '@/components/layouts/Pagination'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { getFlashSalePageApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { stripHTML } from '@/utils/string'
import moment from 'moment-timezone'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Đang giảm giá - Mona Edu',
  description: 'Mona Edu - Học trực tuyến mọi lúc, mọi nơi',
}

async function FlashSalePage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let courses: ICourse[] = []
  let query: string = ''
  let amount: number = 0
  let itemPerPage = 8

  try {
    // get query
    query = handleQuery(searchParams)

    // cache: no-store for filter
    const data = await getFlashSalePageApi(query, { next: { revalidate: 60 } })

    // destructure
    courses = data.courses

    amount = data.amount
  } catch (err: any) {
    console.log(err)
  }

  // jsonLd
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Flash Sale Courses',
    description: 'Danh sách các khóa học đang giảm giá',
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: stripHTML(course.description),
        provider: {
          '@type': 'Organization',
          name: 'Mona Edu',
          url: `${process.env.NEXT_PUBLIC_APP_URL}`,
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
    <div className="px-21 pt-12 md:pt-16">
      {/* MARK: Add JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Heading */}
      <h1 className="px-21 text-center text-4xl font-semibold text-light">Đang Giảm Giá ({amount})</h1>

      <Divider size={18} />

      {/* MAIN List */}
      {!!courses.length ? (
        <div className="grid grid-cols-2 gap-21 md:grid-cols-4">
          {courses.map(course => (
            <CourseCard
              course={course}
              key={course._id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center font-body tracking-wider text-light">
          <p className="italic">Hiện không có khóa học nào đang giảm giá, vui lòng quay lại sau.</p>
          <Link
            href="/"
            className="trans-200 text-sky-500 underline underline-offset-2 hover:text-sky-700"
          >
            Về trang chủ
          </Link>
        </div>
      )}

      <Divider size={10} />

      {/* Pagination */}
      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
      />

      <Divider size={20} />
    </div>
  )
}

export default FlashSalePage
