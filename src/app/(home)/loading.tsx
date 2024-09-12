import Divider from '@/components/Divider'
import AllCoursesX from '@/components/loading/AllCoursesX'
import BannerX from '@/components/loading/BannerX'
import BestSellerX from '@/components/loading/BestSellerX'
import FeatureCoursesX from '@/components/loading/FeatureCoursesX'
import HeadingX from '@/components/loading/HeadingX'
import PaginationX from '@/components/loading/PaginationX'
import SubscriptionsX from '@/components/loading/SubscriptionX'
import TopCategoriesX from '@/components/loading/TopCategoriesX'
import TopNewCoursesX from '@/components/loading/TopNewCoursesX'
import RecentlyVisit from '@/components/ranks/RecentlyVisit'
import Image from 'next/image'

async function Loading() {
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

      <Divider size={30} />

      <div className='max-w-1200 mx-auto w-full px-21 flex flex-col items-center'>
        <HeadingX />
        <p className='bg-slate-300 animate-pulse rounded-lg w-full h-4 max-w-[450px] mt-8' />
      </div>

      <Divider size={10} />

      {/* Subscription */}
      <SubscriptionsX />

      <Divider size={70} />

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

export default Loading
