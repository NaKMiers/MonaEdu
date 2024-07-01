import Chapter from '@/components/Chapter'
import Divider from '@/components/Divider'
import FloatingSummary from '@/components/FloatingSummary'
import BeamsBackground from '@/components/backgrounds/BeamsBackground'
import { IChapter } from '@/models/ChapterModel'
import { IComment } from '@/models/CommentModel'
import { ICourse } from '@/models/CourseModel'
import { getCoursePageApi } from '@/requests'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaAngleRight, FaStarOfLife } from 'react-icons/fa'
import { ImUser } from 'react-icons/im'
import { MdLanguage } from 'react-icons/md'

export const metadata: Metadata = {
  title: 'Course',
}

async function CoursePage({ params: { slug } }: { params: { slug: string } }) {
  // Data
  let course: ICourse | null = null
  let chapters: IChapter[] = []
  let comments: IComment[] = []
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
    comments = data.comments
  } catch (err: any) {
    return notFound()
  }

  return (
    <div className='bg-white'>
      {/* Banner */}
      <div className='relative bg-neutral-800 text-light'>
        <BeamsBackground />

        {/* Container */}
        <div className='relative max-w-1200 mx-auto py-8'>
          <div className='max-w-[700px] w-full px-21'>
            {/* Breadcrumb */}
            <div className='flex flex-wrap items-center text-nowrap gap-x-3 relative z-20 text-slate-400'>
              <Link href='/' className='hover:text-primary trans-200 hover:drop-shadow-md'>
                trang-chu
              </Link>
              <FaAngleRight size={14} />
              <Link href='/categories' className='hover:text-primary trans-200 hover:drop-shadow-md'>
                tieng-anh
              </Link>
              <FaAngleRight size={14} />
              <Link href='/categories' className='hover:text-primary trans-200 hover:drop-shadow-md'>
                tieng-anh-theo-chu-de
              </Link>
              <FaAngleRight size={14} />
              <Link href='/categories' className='hover:text-primary trans-200 hover:drop-shadow-md'>
                IELTS
              </Link>
              <FaAngleRight size={14} />
              <Link href='/categories' className='hover:text-primary trans-200 hover:drop-shadow-md'>
                khoa-hoc-ielts-cho-nguoi-mat-goc
              </Link>
              <FaAngleRight size={14} />
            </div>

            <Divider size={8} />

            {/* Title */}
            <h1 className='font-semibold text-3xl md:tracking-wide'>
              100 Days of Code: The Complete Python Pro Bootcamp
            </h1>

            <Divider size={3} />

            {/* Hook */}
            <p>
              Master Python by building 100 projects in 100 days. Learn data science, automation, build
              websites, games and apps!
            </p>

            <Divider size={3} />

            {/* Author */}
            <p className='flex items-center gap-2 font-body tracking-wider'>
              <ImUser size={16} />
              Giảng viên: <span className='text-primary'>Dr. Angela Yu</span>
            </p>

            {/* Last Update*/}
            <p className='flex items-center gap-2 font-body tracking-wider'>
              <FaStarOfLife size={16} />
              Lần cuối cập nhật: <span>8/2023</span>
            </p>

            {/* Language */}
            <p className='flex items-center gap-2 font-body tracking-wider'>
              <MdLanguage size={16} />
              Ngôn ngữ: <span>Tiếng Anh, Tiếng Việt</span>
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='relative max-w-1200 mx-auto py-8'>
        {/* Floating Box */}
        {course && (
          <FloatingSummary
            course={course}
            className='absolute top-0 -translate-y-[50%] right-0 max-w-[350px] w-full bg-white rounded-xl shadow-md shadow-primary'
          />
        )}

        <div className='max-w-[700px] px-21'>
          {/* Chapters & Lessons */}
          {course && (
            <div className='col-span-12 lg:col-span-8 order-2 lg:order-1'>
              <h1 className='font-semibold text-3xl'>Nội Dung Khóa Học</h1>

              <Divider size={8} />

              <div className='flex justify-between tracking-wider text-sm'>
                <div>12 Chương - 52 Bài giảng - 12h:48p thời lượng</div>
                <button className='font-semibold text-secondary drop-shadow-md underline underline-offset-1'>
                  Mở rộng tất cả
                </button>
              </div>

              <Divider size={3} />

              <ul className='flex flex-col gap-2'>
                {chapters.map(chapter => (
                  <Chapter chapter={chapter} courseSlug={course.slug} key={chapter._id} />
                ))}
              </ul>
            </div>
          )}

          <Divider size={6} border />

          {/* Description */}
          <p className='font-body tracking-wider'>{course?.description}</p>
        </div>
      </div>
    </div>
  )
}

export default CoursePage
