import { topCategories } from '@/constants/categories'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import Divider from '../Divider'
import Heading from '../Heading'

interface TopCategoriesProps {
  className?: string
}

function TopCategories({ className }: TopCategoriesProps) {
  const categories: any[] = topCategories

  return (
    <div className={`max-w-1200 mx-auto px-21 ${className}`}>
      <Heading title='Danh mục phổ biến' />

      <Divider size={16} />

      <div className='grid grid-cols-2 md:grid-cols-4 gap-21 sm:gap-8'>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className={`hover:-translate-y-2 trans-300 shadow-sm shadow-lime-50 rounded-xl overflow-hidden relative w-full ${className}`}
          >
            <Image
              src={category.image || '/images/default-category.jpg'}
              height='1000'
              width='1000'
              className='h-full bg-white w-full object-cover rounded-xl'
              alt='thumbnail'
            />

            <div className='absolute z-20 bottom-0 left-0 right-0 w-full p-1.5 bg-neutral-950 bg-opacity-50 text-light'>
              <h2
                title={category.title}
                className='font-body tracking-wider font-bold text-2xl drop-shadow-lg text-ellipsis line-clamp-2 mb-1'
              >
                {category.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default memo(TopCategories)
