import Divider from '../Divider'
import HeadingX from '../loading/HeadingX'
import CategoryCardX from './CategoryCardX'

function TopCategoriesX() {
  return (
    <div className='max-w-1200 mx-auto px-21'>
      <HeadingX />

      <Divider size={16} />

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-21 sm:gap-8'>
        {Array.from({ length: 8 }).map((_, index) => (
          <CategoryCardX key={index} />
        ))}
      </div>
    </div>
  )
}

export default TopCategoriesX
