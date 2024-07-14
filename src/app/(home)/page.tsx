import Banner from '@/components/Banner'
import Divider from '@/components/Divider'
import BestSeller from '@/components/ranks/BestSeller'
import FeatureCourses from '@/components/ranks/FeatureCourses'
import TopCategories from '@/components/ranks/TopCategories'
import TopNewCourses from '@/components/ranks/TopNewCourses'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { getHomePageApi } from '@/requests'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trang chủ - Mona Edu',
  description: 'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam',
}

async function Home() {
  let courses: ICourse[] = []
  let bestSellers: ICourse[] = []
  let newCourses: ICourse[] = []
  let bootedCourses: {
    category: ICategory
    courses: ICourse[]
  }[] = []

  // try {
  //   const data = await getHomePageApi();

  //   courses = data.courses;
  //   bestSellers = data.bestSellers;
  //   newCourses = data.newCourses;
  //   bootedCourses = data.groupedBootedCourses;
  // } catch (err: any) {
  //   console.log(err);
  // }

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
      'https://www.facebook.com/anphashop',
      'https://www.twitter.com/anphashop',
      'https://www.twitter.com/anphashop',
    ],
  }

  return (
    <div className='min-h-screen'>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Banner */}
      {/* <Banner courses={courses} /> */}

      <Divider size={36} />

      {/* Top 8 Courses */}
      {/* <BestSeller courses={bestSellers} /> */}

      <Divider size={36} />

      {/* Top 8 (max) New Courses */}
      {/* <TopNewCourses courses={newCourses} /> */}

      <Divider size={24} />

      {/* Feature Courses */}
      {/* <FeatureCourses courses={bootedCourses} /> */}

      <Divider size={36} />

      {/* Top 8 Categories */}
      {/* <TopCategories /> */}

      <Divider size={54} />
    </div>
  )
}

export default Home
