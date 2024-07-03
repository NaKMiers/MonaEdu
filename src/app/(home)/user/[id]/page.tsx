import Avatar from '@/components/Avatar'
import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import MyLink from '@/components/MyLink'
import QuestionItem from '@/components/QuestionItem'
import UserBanner from '@/components/UserBanner'
import { ICourse } from '@/models/CourseModel'
import { IQuestion } from '@/models/QuestionModel'
import { IUser } from '@/models/UserModel'
import { getUsersApi } from '@/requests'
import { getUserName } from '@/utils/string'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function ProfilePage({ params: { id } }: { params: { id: string } }) {
  let user: IUser | null = null
  let courses: ICourse[] = []
  let questions: IQuestion[] = []

  try {
    // get user profile
    const data = await getUsersApi(id)

    user = data.user
    courses = data.user.courses.map((course: any) => course.course)
    questions = data.questions.map((question: any) => ({ ...question, userId: user }))
  } catch (err: any) {
    console.error(err)
    return notFound()
  }

  return (
    <div>
      {/* Head */}
      <div className='bg-neutral-800 md:-mt-[72px] md:pt-[72px]'>
        {/* Container */}
        <div className='max-w-1200 mx-auto md:pt-21'>
          {/* Banner */}
          {user && (
            <UserBanner
              user={user}
              className='w-full aspect-[7/3] md:aspect-[3/1] lg:aspect-[9/2] overflow-hidden rounded-b-3xl md:rounded-t-3xl border-b-2 border-primary shadow-lg'
            />
          )}
          {user && (
            <div className='relative -mt-[84px] md:mt-0 md:h-[104px]'>
              <div className='md:absolute sm:right-6 md:right-12 md:top-0 z-10 flex flex-col-reverse md:flex-row justify-center items-center md:items-end md:justify-end gap-3 md:-translate-y-1/2'>
                <div className='flex flex-col justify-end text-light pb-4'>
                  <h1 className='font-bold text-nowrap text-ellipsis line-clamp-1 text-3xl text-center'>
                    {getUserName(user, 'nickname')}
                  </h1>
                  {!user.nickname && (
                    <p className='font-semibold font-body tracking-wider text-center md:text-right'>
                      {user.nickname || 'nakmiers'}
                    </p>
                  )}
                </div>

                <Avatar
                  user={user}
                  className='flex-shrink-0 max-w-[168px] border-[4px] border-neutral-800 shadow-lg '
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className='bg-neutral-700 text-white -mb-36 pb-48'>
        <div className='max-w-1200 mx-auto grid grid-cols-12 gap-x-21 gap-y-12 px-21 pt-12'>
          {/* Courses */}
          <div className='col-span-12 md:col-span-8 order-2 md:order-1'>
            <h2 className='font-semibold text-3xl flex gap-3 justify-between items-end'>
              Các khóa học đã tham gia
            </h2>

            <Divider size={8} />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-21'>
              {courses.map(course => (
                <CourseCard course={course} key={course._id} />
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className='relative col-span-12 md:col-span-4 order-1 md:order-2 font-body tracking-wider'>
            <div className='sticky top-[93px] left-0 right-0 w-full rounded-medium shadow-lg p-4 bg-white'>
              {/* Achievements */}
              <div>
                <h4 className='font-semibold text-slate-700 font-body tracking-wider drop-shadow-md text-center mb-3'>
                  Các danh hiệu đạt được (3)
                </h4>
                <div className='flex snap-mandatory snap-x overflow-x-auto -mx-2'>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      className='flex flex-col items-center w-1/5 flex-shrink-0 snap-start px-2'
                      key={index}
                    >
                      <div className='rounded-lg aspect-square w-full overflow-hidden'>
                        <Image
                          className='w-full h-full object-cover shadow-md'
                          src='/images/logo.png'
                          width={80}
                          height={80}
                          alt='achievement'
                        />
                      </div>
                      <p className='text-xs mt-1 text-ellipsis line-clamp-1' title={`Title ${index}`}>
                        Title {index}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email */}
              <p className='flex gap-2 text-slate-500 text-sm'>
                Email:{' '}
                <Link
                  href={`mailto:${user?.email}`}
                  className='underline underline-offset-1 text-sky-800'
                >
                  {user?.email}
                </Link>
              </p>

              {/* Gender */}
              <p className='flex gap-2 text-slate-500 text-sm'>
                Giới tính: <span className='text-dark'>{user?.gender}</span>
              </p>

              {/* Job */}
              <p className='flex gap-2 text-slate-500 text-sm'>
                Công việc: <span className='text-dark'>{user?.job}</span>
              </p>

              {/* Bio */}
              <div className='text-slate-500 text-sm'>
                <span>Bio</span>

                <p className='text-dark'>
                  {/* {user?.bio} */}
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis dicta, assumenda
                  ducimus, amet sed vel nesciunt consequatur et ad sunt quibusdam culpa cumque aut
                  veritatis impedit provident, mollitia non adipisci autem in nemo. Magni dolor eos
                  voluptatibus, earum quod ad!
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider size={18} />

        {/* Questions */}
        <div className='max-w-1200 mx-auto px-21'>
          <h2 className='font-semibold text-3xl flex gap-3 justify-between items-end'>
            Các câu hỏi gần đây của {user && getUserName(user)}
            <MyLink user={user}>
              <Link
                href='/my-questions'
                className='font-normal underline underline-offset-1 text-sky-500 text-base'
              >
                (Tất cả câu hỏi của tôi)
              </Link>
            </MyLink>
          </h2>

          <Divider size={8} />

          <ul className='grid grid-cols-1 md:grid-cols-3 gap-21 text-dark'>
            {questions.map(question => (
              <QuestionItem question={question} key={question._id} />
            ))}
          </ul>
        </div>

        <Divider size={28} />
      </div>
    </div>
  )
}

export default ProfilePage
