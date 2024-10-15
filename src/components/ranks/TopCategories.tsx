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

  console.log(topCategories)

  return (
    <div className={`mx-auto max-w-1200 px-21 ${className}`}>
      <Heading title="Danh mục phổ biến" />

      <Divider size={16} />

      <div className="grid grid-cols-2 gap-3 sm:gap-8 md:grid-cols-4 md:gap-21">
        {categories.map(category => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className={`trans-300 relative w-full overflow-hidden rounded-xl shadow-sm shadow-lime-50 hover:-translate-y-2 ${className}`}
          >
            <Image
              src={category.image || '/images/default-category.jpg'}
              height="1000"
              width="1000"
              className="h-full w-full rounded-xl bg-white object-cover"
              alt={category.title}
              loading="lazy"
            />

            <div className="absolute bottom-0 left-0 right-0 z-20 w-full bg-neutral-950 bg-opacity-50 p-1.5 text-light">
              <h2
                title={category.title}
                className="mb-1 line-clamp-2 text-ellipsis font-body text-2xl font-bold tracking-wider drop-shadow-lg"
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
