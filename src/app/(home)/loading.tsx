import Divider from '@/components/Divider'
import AllCoursesX from '@/components/loading/AllCoursesX'
import BannerX from '@/components/loading/BannerX'
import BestSellerX from '@/components/loading/BestSellerX'
import FeatureCoursesX from '@/components/loading/FeatureCoursesX'
import PaginationX from '@/components/loading/PaginationX'
import TopCategoriesX from '@/components/loading/TopCategoriesX'
import TopNewCoursesX from '@/components/loading/TopNewCoursesX'
import RecentlyVisit from '@/components/ranks/RecentlyVisit'

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

      <Divider size={40} />

      {/* All Courses */}
      <AllCoursesX />
      <PaginationX />

      <Divider size={30} />

      {/* Recently Visit */}
      <RecentlyVisit />
      <Divider size={40} />

      <Divider size={54} />
    </div>
  )
}

export default HomeX
