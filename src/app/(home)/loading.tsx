import Divider from '@/components/Divider'
import BannerX from '@/components/loading/BannerX'
import BestSellerX from '@/components/loading/BestSellerX'
import FeatureCoursesX from '@/components/loading/FeatureCoursesX'
import TopCategoriesX from '@/components/loading/TopCategoriesX'
import TopNewCoursesX from '@/components/loading/TopNewCoursesX'

async function HomeX() {
  return (
    <div className='min-h-screen'>
      {/* Banner */}
      <BannerX />

      <Divider size={36} />

      {/* Top 8 Courses */}
      <BestSellerX />

      <Divider size={36} />

      {/* Top 8 (max) New Courses */}
      <TopNewCoursesX />

      <Divider size={24} />

      {/* Feature Courses */}
      <FeatureCoursesX />

      <Divider size={36} />

      {/* Top 8 Categories */}
      <TopCategoriesX />

      <Divider size={54} />
    </div>
  )
}

export default HomeX
