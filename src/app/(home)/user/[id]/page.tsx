import Avatar from '@/components/Avatar'
import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import UserBanner from '@/components/UserBanner'
import { ICourse } from '@/models/CourseModel'
import { IUser } from '@/models/UserModel'
import { getUsersApi } from '@/requests'
import { getUserName, stripHTML } from '@/utils/string'
import moment from 'moment-timezone'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const generateMetadata = ({ params }: any): Metadata => {
  return {
    title: `${params.id} - Thông tin cá nhân - Mona Edu`,
    description: 'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam',
  }
}

async function ProfilePage({ params: { id } }: { params: { id: string } }) {
  let user: IUser | null = null
  let courses: ICourse[] = []

  try {
    // get user profile
    const data = await getUsersApi(id, '', { next: { revalidate: 60 } })

    user = data.user
    courses = data.user.courses.map((course: any) => course.course)
  } catch (err: any) {
    console.error(err)
    return notFound()
  }

  // jsonLD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user && getUserName(user),
    url: `${process.env.NEXT_PUBLIC_APP_URL}/user/${id}`,
    image: user?.avatar,
    jobTitle: user?.job,
    gender: user?.gender,
    email: user?.email,
    description: user?.bio,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/users/${id}`,
    },
    memberOf: [
      {
        '@type': 'Organization',
        name: 'Mona Edu',
        url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Courses',
      itemListElement: courses.map(course => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: course.title,
          description: stripHTML(course.description),
          provider: {
            '@type': 'Organization',
            name: 'Mona Edu',
          },
        },
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`,
        priceCurrency: 'VND',
        price: course.price,
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
            courseWorkload: `PT${course.duration % 3600}H${(course.duration % 3600) % 60}M`,
          },
        ],
      })),
    },
  }

  return (
    <div>
      {/* MARK: Add JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Head */}
      <div className="bg-neutral-800 md:-mt-[72px] md:pt-[72px]">
        {/* Container */}
        <div className="mx-auto max-w-1200 md:pt-21">
          {/* Banner */}
          {user && (
            <UserBanner
              user={user}
              className="aspect-[7/3] w-full overflow-hidden rounded-b-3xl border-b-2 border-primary shadow-lg md:aspect-[3/1] md:rounded-t-3xl lg:aspect-[9/2]"
            />
          )}
          {user && (
            <div className="relative -mt-[84px] md:mt-0 md:h-[104px]">
              <div className="z-10 flex flex-col-reverse items-center justify-center gap-3 sm:right-6 md:absolute md:right-12 md:top-0 md:-translate-y-1/2 md:flex-row md:items-end md:justify-end">
                <div className="flex flex-col justify-end pb-4 text-light">
                  <h1 className="line-clamp-1 text-ellipsis text-nowrap text-center text-3xl font-bold">
                    {getUserName(user, 'nickname')}
                  </h1>
                  {!user.nickname && (
                    <p className="text-center font-body font-semibold tracking-wider md:text-right">
                      {user.nickname}
                    </p>
                  )}
                </div>

                <Avatar
                  user={user}
                  className="max-w-[168px] flex-shrink-0 border-[4px] border-neutral-800 shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="-mb-36 bg-neutral-700 pb-48 text-light">
        <div className="mx-auto grid max-w-1200 grid-cols-12 gap-x-21 gap-y-12 px-21 pt-12">
          {/* Courses */}
          <div className="order-2 col-span-12 md:order-1 md:col-span-8">
            <h2 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-3xl font-semibold">
              Các khóa học đã tham gia
              {courses.length > 0 && (
                <span className="-mb-1 flex items-center justify-center text-nowrap rounded-full bg-primary px-2 py-1 text-xs font-semibold text-dark shadow-md">
                  {courses.length} khóa học
                </span>
              )}
            </h2>

            <Divider size={8} />

            <div className="grid grid-cols-1 gap-21 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map(course => (
                <CourseCard
                  course={course}
                  key={course._id}
                />
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="relative order-1 col-span-12 font-body tracking-wider md:order-2 md:col-span-4">
            <div className="sticky left-0 right-0 top-[93px] w-full rounded-medium bg-white p-4 shadow-lg">
              {/* Email */}
              <h4 className="mb-2 text-center font-body font-semibold tracking-wider text-slate-700 drop-shadow-md">
                Thông tin cá nhân
              </h4>
              {/* <p className="flex gap-2 text-sm text-slate-500">
                Email:{' '}
                <Link
                  href={`mailto:${user?.email}`}
                  className="text-sky-800 underline underline-offset-1"
                >
                  {user?.email}
                </Link>
              </p> */}

              {/* Gender */}
              {user?.gender && (
                <p className="flex gap-2 text-sm text-slate-500">
                  Giới tính:{' '}
                  <span className="text-dark">
                    {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
                  </span>
                </p>
              )}

              {/* Job */}
              {user?.job && (
                <p className="flex gap-2 text-sm text-slate-500">
                  Công việc: <span className="text-dark">{user.job}</span>
                </p>
              )}

              {/* Bio */}
              {user?.bio && (
                <div className="text-sm text-slate-500">
                  <span>Bio: </span>

                  <p className="text-dark">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Divider size={28} />
      </div>
    </div>
  )
}

export default ProfilePage
