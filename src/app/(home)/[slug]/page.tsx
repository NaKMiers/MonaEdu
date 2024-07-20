import CourseCard from '@/components/CourseCard'
import CourseContent from '@/components/CourseContent'
import Divider from '@/components/Divider'
import FloatingActionButtons from '@/components/floatings/FloatingActionButtons'
import FloatingSummary from '@/components/floatings/FloatingSummary'
import GroupCourses from '@/components/GroupCourses'
import Price from '@/components/Price'
import { ICategory } from '@/models/CategoryModel'
import { IChapter } from '@/models/ChapterModel'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { ITag } from '@/models/TagModel'
import { getCoursePageApi } from '@/requests'
import moment from 'moment-timezone'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { FaAngleRight, FaStarOfLife } from 'react-icons/fa'
import { ImUser } from 'react-icons/im'
import { IoIosPhonePortrait } from 'react-icons/io'
import { IoTimer } from 'react-icons/io5'
import { MdLanguage, MdVideoLibrary } from 'react-icons/md'

export const metadata: Metadata = {
  title: 'Khóa học - Mona Edu',
  description: 'Mona Edu - Học trực tuyến mọi lúc, mọi nơi',
}

async function CoursePage({ params: { slug } }: { params: { slug: string } }) {
  // Data
  let course: ICourse | null = null
  let chapters: IChapter[] = []
  let relatedCourses: ICourse[] = []
  let totalTime: {
    hours: number
    minutes: number
  } = {
    hours: 0,
    minutes: 0,
  }

  // MARK: Get Data
  try {
    // revalidate every 1 minute
    const data = await getCoursePageApi(slug)

    course = data.course
    chapters = data.chapters
    relatedCourses = data.relatedCourses

    // Calculate total time
    const totalDuration = chapters.reduce(
      (total, chapter) =>
        total + (chapter.lessons?.reduce((total, lesson) => total + lesson.duration, 0) || 0),
      0
    )
    totalTime.hours = Math.floor(totalDuration / 3600)
    totalTime.minutes = (totalDuration % 3600) % 60
  } catch (err: any) {
    return notFound()
  }

  // jsonLd
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Course',
    name: course?.title,
    description: course?.description,
    provider: {
      '@type': 'Organization',
      name: 'Mona Edu',
      sameAs: `${process.env.NEXT_PUBLIC_APP_URL}`,
    },
    author: {
      '@type': 'Person',
      name: course?.author,
    },
    datePublished: moment(course?.createdAt).toISOString(),
    dateModified: moment(course?.updatedAt).toISOString(),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: course?.price,
      priceValidUntil: moment().add(30, 'days').toISOString(),
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${course?.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Mona Edu',
      },
    },
    educationalCredentialAwarded: 'Certificate of Completion',
    courseMode: 'online',
    typicalAgeRange: 'Adult',
    timeRequired: `PT${totalTime.hours}H${totalTime.minutes}M`,
    numberOfCredits: '3',
    about: relatedCourses.map(course => ({
      '@type': 'Course',
      name: course.title,
      description: course.description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`,
      provider: {
        '@type': 'Organization',
        name: 'Mona Edu',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'VND',
        price: course.price,
        availability: 'https://schema.org/InStock',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`,
      },
    })),
  }

  return (
    <div className='bg-white md:-mt-8 -mb-28 md:-mb-8 md:pt-8 pb-36'>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* MARK: Banner */}
      <div className='relative bg-neutral-800 text-light -mt-8 pt-8'>
        {/* <BeamsBackground /> */}

        {/* Container */}
        <div className='relative max-w-1200 mx-auto py-10'>
          <div className='lg:max-w-[calc(100%-300px-32px)] w-full px-21 overflow-hidden'>
            {/* Breadcrumb */}
            <div className='flex flex-wrap items-center text-nowrap gap-x-3 relative z-20 text-slate-400'>
              <Link href='/categories' className='hover:text-primary trans-200 hover:drop-shadow-md'>
                danh-muc
              </Link>
              <FaAngleRight size={14} />
              {(course?.category as ICategory)?.slug.split('/').map((category, index) => (
                <Fragment key={index}>
                  <Link
                    href={`/categories/${(course?.category as ICategory).slug
                      .split('/')
                      .slice(0, index + 1)
                      .join('/')}`}
                    className='hover:text-primary trans-200 hover:drop-shadow-md'
                  >
                    {category}
                  </Link>
                  <FaAngleRight size={14} />
                </Fragment>
              ))}
              <Link
                href={`/${course?.slug}`}
                className='hover:text-primary trans-200 hover:drop-shadow-md'
              >
                {course?.slug}
              </Link>
            </div>

            {/* Thumbnails */}
            <div className='lg:hidden max-w-[500px] relative aspect-video rounded-lg overflow-hidden shadow-lg block group mt-8'>
              <div className='flex w-full overflow-x-scroll snap-x snap-mandatory hover:scale-105 trans-500'>
                {course?.images.map(src => (
                  <Image
                    className='flex-shrink-0 snap-start w-full h-full object-cover'
                    src={src}
                    width={500}
                    height={500}
                    alt='netflix'
                    key={src}
                  />
                ))}
              </div>
            </div>

            <Divider size={8} />

            {/* Title */}
            <h1 className='font-semibold text-3xl md:tracking-wide'>{course?.title}</h1>

            <Divider size={3} />

            {/* Hook */}
            <p>{course?.textHook}</p>

            <Divider size={3} />

            {/* Author */}
            <p className='flex flex-wrap items-center gap-2 font-body tracking-wider'>
              <ImUser size={16} />
              Giảng viên: <span className='text-primary'>{course?.author}</span>
            </p>

            {/* Last Update*/}
            <p className='flex flex-wrap items-center gap-2 font-body tracking-wider'>
              <FaStarOfLife size={16} />
              Lần cuối cập nhật: <span>{moment(course?.updatedAt).format('mm/YYYY')}</span>
            </p>

            {/* Language */}
            <p className='flex flex-wrap items-center gap-2 font-body tracking-wider'>
              <MdLanguage size={16} />
              Ngôn ngữ:{' '}
              {course?.languages?.map((language, index) => (
                <span className='text-slate-600' key={index}>
                  {language}
                  {index < course?.languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            {/* Tags */}
            {course && (
              <p className='font-body'>
                Thẻ:{' '}
                {(course.tags as ITag[]).map((tag, index) => (
                  <Fragment key={tag._id}>
                    <Link
                      href={`/tags?tag=${tag.slug}`}
                      key={tag._id}
                      className='text-sky-300 hover:underline underline-offset-1'
                    >
                      {tag.title}
                    </Link>
                    <span className='text-sky-300'>{index !== course.tags.length - 1 ? ', ' : ''}</span>
                  </Fragment>
                ))}
              </p>
            )}

            {/* Price */}
            {course && (
              <Price
                price={course.price}
                oldPrice={course.oldPrice}
                flashSale={course.flashSale as IFlashSale}
                className='border-2 mt-5 lg:hidden'
              />
            )}
            <Divider size={4} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='flex max-w-1200 mx-auto py-8 gap-8 px-21'>
        {/* Main */}
        <div className='mb-8 flex-1'>
          {/* MARK: Include */}
          <div className='lg:hidden font-body tracking-wider mb-8'>
            <h2 className='font-semibold font-sans text-3xl'>Khóa Học Gồm Có:</h2>
            <Divider size={3} />

            <p className='flex items-center flex-wrap'>
              <MdVideoLibrary size={16} className='mr-3' />
              <span>
                {chapters.length} chương,{' '}
                {chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)} bài
                giảng
              </span>
            </p>
            <p className='flex items-center flex-wrap'>
              <IoTimer size={16} className='mr-3' />
              <span className='mr-1'>Thời lượng:</span>
              <span>
                {totalTime.hours > 0 && `${totalTime.hours} giờ`}{' '}
                {totalTime.minutes > 0 && `${totalTime.minutes} phút`}
              </span>
            </p>
            <p className='flex items-center flex-wrap'>
              <IoIosPhonePortrait size={16} className='mr-3' />
              <span>Có khả năng truy cập trên điện thoại và TV</span>
            </p>
          </div>

          {/* Content */}
          <h2 className='font-semibold text-3xl'>Nội Dung Khóa Học</h2>
          <Divider size={4} />
          {course && <CourseContent course={course} chapters={chapters} />}

          <Divider size={10} border />

          {/* Description */}
          <h2 className='font-semibold text-3xl'>Mô Tả</h2>
          <Divider size={2} />
          <p className='font-body tracking-wider'>{course?.description}</p>
        </div>

        {/* MARK: Floating Box */}
        <div className='hidden lg:flex flex-shrink-0 w-full max-w-[300px] justify-end items-start'>
          {course && (
            <FloatingSummary
              course={course}
              className='sticky top-[90px] -mt-[100%] right-0 flex-shrink-0 w-full bg-white rounded-xl shadow-md shadow-primary'
            />
          )}
        </div>
      </div>

      {/* MARK: Floating Action Buttons */}
      {course && (
        <FloatingActionButtons
          className='lg:hidden fixed bottom-[72px] md:bottom-0 left-0 w-full right-0 flex px-3 py-1.5 rounded-t-xl border-t-2 border-primary gap-2 bg-white shadow-md shadow-primary z-20'
          course={course}
        />
      )}

      <Divider size={8} />

      {/* MARK: Related Courses */}
      <div className={`max-w-1200 w-full mx-auto px-21`}>
        <h2 className='font-semibold font-sans text-3xl'>Các khóa học liên quan</h2>

        <GroupCourses className='' classChild='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
          {relatedCourses.map(course => (
            <CourseCard course={course} key={course._id} />
          ))}
        </GroupCourses>
      </div>
    </div>
  )
}

export default CoursePage
