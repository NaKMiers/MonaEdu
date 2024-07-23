import BreadcrumbBanner from '@/components/BreadcrumbBanner'
import Divider from '@/components/Divider'
import CategoryCardX from '@/components/loading/CategoryCardX'

async function Loading() {
  return (
    <div>
      {/* Banner */}
      <BreadcrumbBanner
        title='Danh Mục Khóa Học'
        description='Với hơn 14+ danh mục và 100+ danh mục con, bạn có thể dễ dàng chọn lựa khóa học phù hợp với mình.'
        className='shadow-lg rounded-b-lg h-[200px] md:h-[calc(280px+72px)] md:-mt-[72px] px-21 md:pt-[50px]'
      />

      <Divider size={10} />

      {/* Body */}
      <div className='px-21'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-21 sm:gap-8'>
          {Array.from({ length: 10 }).map((_, index) => (
            <CategoryCardX key={index} />
          ))}
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default Loading
