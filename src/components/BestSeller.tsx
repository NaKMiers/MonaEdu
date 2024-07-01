import Image from 'next/image'
import React from 'react'
import Heading from './Heading'
import Divider from './Divider'
import { ICourse } from '@/models/CourseModel'
import Link from 'next/link'
import { CardBody, CardContainer, CardItem } from './3dCard'

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
          src='/images/award.svg'
          width={200}
          height={200}
          alt='thumbnail'
        />
      </div>

      <Divider size={12} />

      <Heading title='Best Seller' />

      <Divider size={12} />

      <div className='grid grid-cols-2 md:grid-cols-4 gap-21'>
        {courses.map((course, index) => (
          <CardContainer className='inter-var' key={course._id}>
            <CardBody className='flex flex-col relative group/card dark:hover:shadow-2xl rounded-xl'>
              <CardItem translateZ={100} rotateX={20} rotateZ={-10}>
                <Link
                  href={`/${course.slug}`}
                  className='block w-full aspect-video shadow-lg rounded-lg overflow-hidden'
                >
                  <Image
                    className='w-full h-full object-cover group-hover:scale-105 trans-500'
                    src={course.images[0]}
                    width={300}
                    height={300}
                    alt='thumbnail'
                  />
                </Link>
              </CardItem>

              <CardItem
                translateZ={120}
                className='relative w-full rounded-lg px-21 pt-4 pb-4 gap-21 bg-white'
              >
                <p className='text-sm text-slate-400'>Học viên {course.joined}</p>
                <p className='font-semibold text-lg text-ellipsis line-clamp-1'>{course.title}</p>

                {index <= 2 && (
                  <CardItem translateZ={50} className='absolute w-[60px] h-[60px] right-8 -top-5'>
                    <Image
                      className='w-full h-full object-cover'
                      src={`/images/top-${index + 1}-badge.png`}
                      fill
                      alt='badge'
                    />
                  </CardItem>
                )}
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  )
}

export default BestSeller
