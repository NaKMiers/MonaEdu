import BreadcrumbBanner from '@/components/BreadcrumbBanner'
import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import FilterAndSearch from '@/components/FilterAndSearch'
import Pagination from '@/components/layouts/Pagination'
import QuickSortTabs from '@/components/QuickSortTabs'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { ITag } from '@/models/TagModel'
import { getTagPageApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { stripHTML } from '@/utils/string'
import moment from 'moment-timezone'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh mục khóa học - Mona Edu',
  description: 'Mona Edu - Học trực tuyến mọi lúc, mọi nơi',
}

async function TagPage({
  searchParams,
  params: { slug },
}: {
  searchParams?: { [key: string]: string[] }
  params: { slug: string }
}) {
  // data
  let tag: ITag | null = null
  let courses: ICourse[] = []
  let amount: number = 0
  let chops: any = null

  // get data
  try {
    if (!slug) throw new Error('Không tìm thấy thẻ')

    const query = handleQuery(searchParams)

    // get data
    const data = await getTagPageApi(slug, query, { next: { revalidate: 60 } })
    tag = data.tag
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
    about: {
      '@type': 'Tag',
      name: tag?.title,
      description: 'No description for this tag',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tags/${tag?.slug}`,
    },
  }

  return (
    <div>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Banner */}
      <BreadcrumbBanner
        title={tag?.title || 'Tag'}
        description=''
        className='md:shadow-medium md:rounded-b-lg rounded-none h-[calc(300px+72px)] -mt-[72px] pt-[72px]'
        preLink={[
          { label: 'trang-chu', href: '/' },
          { label: 'tags', href: '' },
        ]}
      />

      {/* Body */}
      <div className='md:px-21 md:mt-10'>
        <div className='flex flex-col md:flex-row bg-white rounded-b-lg md:rounded-lg gap-x-21 p-3 md:p-21 shadow-lg'>
          {/* Filter & Search */}
          <div className='flex justify-between md:max-w-[200px] lg:max-w-[250px] w-full flex-shrink-0'>
            <FilterAndSearch searchParams={searchParams} subs={[]} chops={chops} />
          </div>

          {/* Main */}
          <div className='flex-1 w-full mt-4 md:mt-0'>
            {/* Top */}
            <QuickSortTabs searchParams={searchParams} amount={amount} />

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

export default TagPage
