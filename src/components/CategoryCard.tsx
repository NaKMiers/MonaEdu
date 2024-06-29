'use client'

import { CardBody, CardContainer, CardItem } from '@/components/3dCard'
import { ICategory } from '@/models/CategoryModel'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  category: ICategory
  className?: string
}

function CategoryCard({ category, className = '' }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className={`w-full ${className}`}>
      <CardContainer className={`inter-var w-full`}>
        <CardBody className='relative group/card hover:shadow-2xl w-full rounded-xl'>
          <CardItem translateZ={10} rotateX={10} className='w-full aspect-square rounded-xl'>
            <Image
              src={category.image || '/images/default-category.jpg'}
              height='1000'
              width='1000'
              className='h-full bg-white w-full object-cover rounded-xl group-hover/card:shadow-xl'
              alt='thumbnail'
            />
          </CardItem>

          <CardItem
            translateZ={60}
            className='absolute z-20 bottom-0 left-0 right-0 w-full border-t-3 p-1.5 rounded-xl border-t-2 border-white bg-neutral-950 bg-opacity-50 text-light'
          >
            <CardItem
              translateZ={80}
              as='h2'
              title={category.title}
              className='font-body tracking-wider font-bold text-2xl lg:text-3xl xl:text-4xl drop-shadow-lg text-ellipsis line-clamp-1'
            >
              {category.title}
            </CardItem>

            <CardItem
              translateZ={50}
              as='p'
              title={category.description}
              className='font-body tracking-wide text-sm text-ellipsis line-clamp-1 md:line-clamp-2'
            >
              {category.description}
            </CardItem>

            <CardItem translateZ={10} as='p' className='font-body tracking-wider font-semibold text-sm'>
              {category.courseQuantity} Khóa học
            </CardItem>
          </CardItem>
        </CardBody>
      </CardContainer>
    </Link>
  )
}

export default CategoryCard
