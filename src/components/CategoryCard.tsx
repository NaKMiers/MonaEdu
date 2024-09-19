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
      className={`hover:-translate-y-2 trans-300 shadow-medium-light rounded-xl overflow-hidden relative w-full ${className}`}
    >
      <Image
        src={category.image || '/images/default-category.jpg'}
        height='1000'
        width='1000'
        className='h-full bg-white w-full object-cover rounded-xl'
        loading='lazy'
        alt={category.title}
      />

      <div className='absolute z-20 bottom-0 left-0 right-0 w-full border-t-3 p-1.5 rounded-xl border-t-2 border-light bg-neutral-950 bg-opacity-50 text-light'>
        <h2
          title={category.title}
          className='font-body tracking-wider font-bold text-2xl lg:text-3xl xl:text-4xl drop-shadow-lg text-ellipsis line-clamp-1'
        >
          {category.title}
        </h2>

        <p
          title={category.description}
          className='font-body tracking-wide text-sm text-ellipsis line-clamp-1 md:line-clamp-2'
        >
          {category.description}
        </p>

        <p className='font-body tracking-wider font-semibold text-sm'>
          {category.courseQuantity} Khóa học
        </p>
      </div>
    </Link>
  )
}

export default memo(CategoryCard)
