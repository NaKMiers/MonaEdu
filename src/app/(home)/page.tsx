import Banner from '@/components/Banner';
import Divider from '@/components/Divider';
import BestSeller from '@/components/ranks/BestSeller';
import FeatureCourses from '@/components/ranks/FeatureCourses';
import TopCategories from '@/components/ranks/TopCategories';
import TopNewCourses from '@/components/ranks/TopNewCourses';
import TopKeywords from '@/components/ranks/TopTags';
import { ICategory } from '@/models/CategoryModel';
import { ICourse } from '@/models/CourseModel';
import { getHomePageApi } from '@/requests';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang Chủ - MonaEdu',
};

async function Home() {
  let courses: ICourse[] = [];
  let bestSellers: ICourse[] = [];
  let newCourses: ICourse[] = [];
  let bootedCourses: {
    category: ICategory;
    courses: ICourse[];
  }[] = [];

  try {
    const data = await getHomePageApi();

    courses = data.courses;
    bestSellers = data.bestSellers;
    newCourses = data.newCourses;
    bootedCourses = data.groupedBootedCourses;
  } catch (err: any) {
    console.log(err);
  }

  return (
    <div className='min-h-screen'>
      {/* Banner */}
      <Banner courses={courses} />

      <Divider size={32} />

      {/* Top 8 Courses */}
      <BestSeller courses={bestSellers} />

      <Divider size={24} />

      {/* Top 8 Features Keywords */}
      <TopKeywords />

      <Divider size={24} />

      {/* Feature Courses */}
      <FeatureCourses courses={bootedCourses} />

      <Divider size={32} />

      {/* Top 8 Categories */}
      <TopCategories />

      <Divider size={32} />

      {/* Top 8 (max) New Courses */}
      <TopNewCourses courses={newCourses} />

      <Divider size={54} />
    </div>
  );
}

export default Home;
