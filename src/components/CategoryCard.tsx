'use client'

import { ICategory } from '@/models/CategoryModel'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

interface CategoryCardProps {
  category: ICategory
  className?: string
}

function CategoryCard({ category, className = '' }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`trans-300 relative w-full overflow-hidden rounded-xl shadow-medium-light hover:-translate-y-2 ${className}`}
    >
      <Image
        src={category.image || '/images/default-category.jpg'}
        height="1000"
        width="1000"
        className="h-full w-full rounded-xl bg-white object-cover"
        loading="lazy"
        alt={category.title}
      />

      <div className="border-t-3 absolute bottom-0 left-0 right-0 z-20 w-full rounded-xl border-t-2 border-light bg-neutral-950 bg-opacity-50 p-1.5 text-light">
        <h2
          title={category.title}
          className="line-clamp-1 text-ellipsis font-body text-2xl font-bold tracking-wider drop-shadow-lg lg:text-3xl xl:text-4xl"
        >
          {category.title}
        </h2>

        <p
          title={category.description}
          className="line-clamp-1 text-ellipsis font-body text-sm tracking-wide md:line-clamp-2"
        >
          {category.description}
        </p>

        <p className="font-body text-sm font-semibold tracking-wider">
          {category.courseQuantity} Khóa học
        </p>
      </div>
    </Link>
  )
}

export default memo(CategoryCard)
