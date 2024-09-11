import { ICourse } from '@/models/CourseModel'
import Image from 'next/image'
import { memo } from 'react'
import BestSellerCard from '../BestSellerCard'
import Divider from '../Divider'
import Heading from '../Heading'

interface BestSellerProps {
  courses: ICourse[]
  className?: string
}

function BestSeller({ courses, className = '' }: BestSellerProps) {
  return (
    <div className={`max-w-1200 mx-auto px-21 ${className}`}>
      <div className='flex items-center justify-center'>
        <Image
          className='object-cover'
          src='/icons/award.svg'
          width={200}
          height={200}
          alt='Best-Seller'
          loading='lazy'
        />
      </div>

      <Divider size={12} />

      <Heading title='Khóa học bán chạy' />

      <Divider size={16} />

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-start gap-21'>
        {courses.map((course, index) => (
          <BestSellerCard course={course} index={index} key={course._id} />
        ))}
      </div>
    </div>
  )
}

export default memo(BestSeller)
