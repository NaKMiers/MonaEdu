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
import { stripHTML } from '@/utils/string'
import moment from 'moment-timezone'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { BsSourceforge } from 'react-icons/bs'
import { FaAngleRight, FaStarOfLife } from 'react-icons/fa'
import { ImUser } from 'react-icons/im'
import { IoIosPhonePortrait } from 'react-icons/io'
import { IoTimer } from 'react-icons/io5'
import { MdLanguage, MdVideoLibrary } from 'react-icons/md'
import { PiStudentBold } from 'react-icons/pi'

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
    const data = await getCoursePageApi(slug, '', { next: { revalidate: 60 } })

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
    description: stripHTML(course?.description),
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
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${course?.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Mona Edu',
      },
      category: (course?.category as ICategory)?.title,
    },
    educationalCredentialAwarded: 'Certificate of Completion',
    courseMode: 'online',
    typicalAgeRange: 'Adult',
    timeRequired: `PT${totalTime.hours}H${totalTime.minutes}M`,
    numberOfCredits: '4',
    about: relatedCourses.map(course => ({
      '@type': 'Course',
      name: course.title,
      description: stripHTML(course.description),
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
        category: (course?.category as ICategory)?.title,
      },
      category: (course.category as ICategory)?.title,
      hasCourseInstance: [
        {
          '@type': 'CourseInstance',
          courseMode: 'online',
          instructor: {
            '@type': 'Person',
            name: course.author,
          },
          startDate: moment(course.createdAt).toISOString(),
          location: {
            '@type': 'Place',
            name: 'Online',
          },
          url: `${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`,
          courseWorkload: `PT${totalTime.hours}H${totalTime.minutes}M`,
        },
      ],
    })),
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'online',
        instructor: {
          '@type': 'Person',
          name: course?.author,
        },
        startDate: moment(course?.createdAt).toISOString(),
        location: {
          '@type': 'Place',
          name: 'Online',
        },
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${course?.slug}`,
        courseWorkload: `PT${totalTime.hours}H${totalTime.minutes}M`,
      },
    ],
  }

  return (
    <div className="-mb-28 bg-white pb-36 md:-mb-8 md:-mt-8 md:pt-8">
      {/* MARK: Add JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* MARK: Banner */}
      <div className="relative -mt-8 bg-neutral-800 pt-8 text-light">
        {/* <BeamsBackground /> */}

        {/* Container */}
        <div className="relative mx-auto max-w-1200 py-10">
          <div className="w-full overflow-hidden px-21 lg:max-w-[calc(100%-300px-32px)]">
            {/* Breadcrumb */}
            <div className="relative z-20 flex flex-wrap items-center gap-x-3 text-nowrap text-slate-400">
              <Link
                href="/categories"
                className="trans-200 hover:text-primary hover:drop-shadow-md"
              >
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
                    className="trans-200 hover:text-primary hover:drop-shadow-md"
                  >
                    {category}
                  </Link>
                  <FaAngleRight size={14} />
                </Fragment>
              ))}
              <Link
                href={`/${course?.slug}`}
                className="trans-200 hover:text-primary hover:drop-shadow-md"
              >
                {course?.slug}
              </Link>
            </div>

            {/* Thumbnails */}
            <div className="group relative mt-8 block aspect-video max-w-[500px] overflow-hidden rounded-lg shadow-lg lg:hidden">
              <div className="trans-500 flex w-full snap-x snap-mandatory overflow-x-scroll hover:scale-105">
                {course?.images.slice(0, course.images.length === 1 ? 1 : -1).map(src => (
                  <Image
                    className="h-full w-full flex-shrink-0 snap-start object-cover"
                    src={src}
                    width={500}
                    height={500}
                    alt={course?.title}
                    key={src}
                  />
                ))}
              </div>
            </div>

            <Divider size={8} />

            {/* Title */}
            <h1 className="text-3xl font-semibold md:tracking-wide">{course?.title}</h1>

            <Divider size={3} />

            {/* Hook */}
            <p>{course?.textHook}</p>

            <Divider size={3} />

            {/* Citing */}
            {course?.citing && (
              <p className="flex flex-wrap items-center gap-2 font-body tracking-wider">
                <BsSourceforge size={16} />
                Nguồn: <span className="text-sky-500">{course?.citing}</span>
              </p>
            )}

            {/* Author */}
            <p className="flex flex-wrap items-center gap-2 font-body tracking-wider">
              <ImUser size={16} />
              Giảng viên: <span className="text-primary">{course?.author}</span>
            </p>

            {/* Last Update*/}
            <p className="flex flex-wrap items-center gap-2 font-body tracking-wider">
              <FaStarOfLife size={16} />
              Lần cuối cập nhật: <span>{moment(course?.updatedAt).format('MM/YYYY')}</span>
            </p>

            {/* Language */}
            <p className="flex flex-wrap items-center gap-2 font-body tracking-wider">
              <MdLanguage size={16} />
              Ngôn ngữ:{' '}
              {course?.languages?.map((language, index) => (
                <span
                  className="text-slate-300"
                  key={index}
                >
                  {language}
                  {index < course?.languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            {/* Joined */}
            <p className="flex flex-wrap items-center gap-2 font-body tracking-wider">
              <PiStudentBold size={16} />
              Học viên: <span>{course?.joined}</span>
            </p>

            {/* Tags */}
            {course && (
              <p className="font-body">
                Thẻ:{' '}
                {(course.tags as ITag[]).map((tag, index) => (
                  <Fragment key={tag._id}>
                    <Link
                      href={`/tags/${tag.slug}`}
                      key={tag._id}
                      className="text-sky-300 underline-offset-1 hover:underline"
                    >
                      {tag.title}
                    </Link>
                    <span className="text-sky-300">{index !== course.tags.length - 1 ? ', ' : ''}</span>
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
                className="mt-5 border-2 lg:hidden"
              />
            )}
            <Divider size={4} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-1200 gap-8 px-21 py-8">
        {/* Main */}
        <div className="mb-8 flex-1">
          {/* MARK: Include */}
          <div className="mb-8 font-body tracking-wider lg:hidden">
            <h2 className="font-sans text-3xl font-semibold">Khóa Học Gồm Có:</h2>
            <Divider size={3} />

            <p className="flex flex-wrap items-center">
              <MdVideoLibrary
                size={16}
                className="mr-3"
              />
              <span>
                {chapters.length} chương,{' '}
                {chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)} bài
                giảng
              </span>
            </p>
            <p className="flex flex-wrap items-center">
              <IoTimer
                size={16}
                className="mr-3"
              />
              <span className="mr-1">Thời lượng:</span>
              <span>
                {totalTime.hours > 0 && `${totalTime.hours} giờ`}{' '}
                {totalTime.minutes > 0 && `${totalTime.minutes} phút`}
              </span>
            </p>
            <p className="flex flex-wrap items-center">
              <IoIosPhonePortrait
                size={16}
                className="mr-3"
              />
              <span>Có khả năng truy cập trên điện thoại và TV</span>
            </p>
          </div>

          {/* MARK: Content */}
          <h2 className="text-3xl font-semibold">Nội Dung Khóa Học</h2>
          <Divider size={4} />
          {course && (
            <CourseContent
              course={course}
              chapters={chapters}
            />
          )}

          <Divider
            size={10}
            border
          />

          {/* Description */}
          <h2 className="text-3xl font-semibold">Mô Tả</h2>
          <Divider size={2} />
          <div dangerouslySetInnerHTML={{ __html: course?.description || '' }} />
        </div>

        {/* MARK: Floating Box */}
        <div className="hidden w-full max-w-[300px] flex-shrink-0 items-start justify-end lg:flex">
          {course && (
            <FloatingSummary
              course={course}
              chapters={chapters}
              totalTime={totalTime}
              className="sticky right-0 top-[90px] -mt-[100%] w-full flex-shrink-0 rounded-xl bg-white shadow-md shadow-primary"
            />
          )}
        </div>
      </div>

      {/* MARK: Floating Action Buttons */}
      {course && (
        <FloatingActionButtons
          className="fixed bottom-[72px] left-0 right-0 z-20 flex w-full gap-2 rounded-t-xl border-t-2 border-primary bg-white px-3 py-1.5 shadow-md shadow-primary md:bottom-0 lg:hidden"
          course={course}
        />
      )}

      <Divider size={8} />

      {/* MARK: Related Courses */}
      <div className={`mx-auto w-full max-w-1200 px-21`}>
        <h2 className="font-sans text-3xl font-semibold">Các khóa học liên quan</h2>

        <GroupCourses
          className=""
          classChild="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
        >
          {relatedCourses.map(course => (
            <CourseCard
              course={course}
              key={course._id}
            />
          ))}
        </GroupCourses>
      </div>
    </div>
  )
}

export default CoursePage
