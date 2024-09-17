import AllCourses from '@/components/AllCourses'
import Banner from '@/components/Banner'
import Divider from '@/components/Divider'
import Heading from '@/components/Heading'
import Pagination from '@/components/layouts/Pagination'
import BestSeller from '@/components/ranks/BestSeller'
import FeatureCourses from '@/components/ranks/FeatureCourses'
import RecentlyVisit from '@/components/ranks/RecentlyVisit'
import TopCategories from '@/components/ranks/TopCategories'
import TopNewCourses from '@/components/ranks/TopNewCourses'
import Subscriptions from '@/components/Subscriptions'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { IPackageGroup } from '@/models/PackageGroupModel'
import { getHomePageApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { stripHTML } from '@/utils/string'
import moment from 'moment-timezone'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Trang chủ - Mona Edu',
  description: 'Mona Edu - Học trực tuyến mọi lúc, mọi nơi',
}

async function Home({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let bannerCourses: ICourse[] = []
  let bestSellers: ICourse[] = []
  let newCourses: ICourse[] = []
  let bootedCourses: {
    category: ICategory
    courses: ICourse[]
  }[] = []
  let packageGroups: IPackageGroup[] = []
  let courses: ICourse[] = []
  let amount: number = 0

  try {
    const query = handleQuery(searchParams)
    const data = await getHomePageApi(query, { next: { revalidate: 60 } })

    bannerCourses = data.bannerCourses
    bestSellers = data.bestSellers
    newCourses = data.newCourses
    bootedCourses = data.groupedBootedCourses
    courses = data.courses
    packageGroups = data.packageGroups
    amount = data.amount
  } catch (err: any) {
    console.log(err)
  }

  const courseList = (courses: ICourse[]) => {
    return courses.map(course => ({
      '@type': 'Course',
      name: course.title,
      description: stripHTML(course.description),
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`,
      provider: {
        '@type': 'Organization',
        name: 'Mona Edu',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
        },
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
    }))
  }

  // jsonLD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mona Edu',
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    inLanguage: 'vi',
    description:
      'Mona Edu - Nền tảng học trực tuyến và hàng đầu với nhiều khóa học đa dạng và chất lượng.',
    publisher: {
      '@type': 'Organization',
      name: 'Mona Edu',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
      },
    },
    sameAs: [
      'https://www.facebook.com/mona.education',
      'https://www.instagram.com/mona.education',
      'https://www.messenger.com/t/337011316169917',
    ],
    hasPart: {
      ...courseList(bannerCourses),
      ...courseList(bestSellers),
      ...courseList(newCourses),
      ...bootedCourses.map(group => ({
        '@type': 'ItemList',
        name: group.category.title,
        itemListElement: courseList(group.courses),
      })),
      ...courseList(courses),
    },
  }

  return (
    <div className='min-h-screen'>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Banner */}
      <Banner courses={bannerCourses} />

      <Divider size={40} />

      {/* Top 8 Courses */}
      <BestSeller courses={bestSellers} />

      <Divider size={40} />

      {/* Top 8 (max) New Courses */}
      <TopNewCourses courses={newCourses} />

      <Divider size={30} />

      {/* Feature Courses */}
      <FeatureCourses courses={bootedCourses} />

      <Divider size={40} />

      {/* Top 8 Categories */}
      <TopCategories />

      <Divider size={40} />

      {/* All Courses */}
      <AllCourses courses={courses} />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={12} />

      <Divider size={40} />

      {/* Recently Visit */}
      {/* <RecentlyVisit /> */}

      {/* <Divider size={30} /> */}

      <div className='max-w-1200 mx-auto w-full px-21'>
        <Heading className='text-dark' title='Gói học viên' />
        <p className='text-center text-[18px] text-neutral-300 mt-8'>
          Chọn cơ hội để tối ưu hiệu quả học tập của bạn
        </p>
      </div>

      <Divider size={10} />

      {/* Subscription */}
      <Subscriptions packageGroups={packageGroups} />

      <Divider size={30} />

      <Divider size={40} />

      {/* Let Buy Courses Of Author Banner */}
      <Image
        className='w-full h-full object-contain'
        src='/images/let-buy-courses-of-authors.png'
        width={1920}
        height={960}
        alt='let-buy-courses-of-authors'
        draggable={false}
      />

      <Divider size={54} />
    </div>
  )
}

export default Home
