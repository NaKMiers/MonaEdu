import Divider from '@/components/Divider'
import CourseCardX from '@/components/loading/CourseCardX'
import QuestionItemX from '@/components/loading/QuestionItemX'

async function ProfilePage() {
  return (
    <div>
      {/* Head */}
      <div className='bg-neutral-800 md:-mt-[72px] md:pt-[72px]'>
        {/* Container */}
        <div className='max-w-1200 mx-auto md:pt-21'>
          {/* Banner */}
          <div className='w-full aspect-[7/3] md:aspect-[3/1] lg:aspect-[9/2] rounded-b-3xl md:rounded-t-3xl bg-slate-700 animate-pulse' />

          <div className='relative -mt-[84px] md:mt-0 md:h-[104px]'>
            <div className='md:absolute sm:right-6 md:right-12 md:top-0 z-10 flex flex-col-reverse md:flex-row justify-center items-center md:items-end md:justify-end gap-3'>
              <div className='flex flex-col items-center md:items-end justify-end pb-4 gap-1.5'>
                <div className='h-8 max-w-full w-[300px] rounded-md bg-slate-300 animate-pulse' />
                <div className='h-5 max-w-full w-[100px] rounded-md bg-slate-500 animate-pulse' />
              </div>

              <div className='w-full rounded-full aspect-square overflow-hidden flex-shrink-0 max-w-[168px] border-[4px] border-slate-700 bg-slate-300' />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='bg-neutral-700 -mb-36 pb-48'>
        <div className='max-w-1200 mx-auto grid grid-cols-12 gap-x-21 gap-y-12 px-21 pt-12'>
          {/* Courses */}
          <div className='col-span-12 md:col-span-8 order-2 md:order-1'>
            <div className='flex items-center flex-wrap gap-2.5'>
              <div className='h-8 my-0.5 max-w-full w-[300px] rounded-md bg-slate-300 animate-pulse' />
              <div className='h-6 my-0.5 max-w-full w-[80px] rounded-md bg-slate-300 animate-pulse' />
            </div>

            <Divider size={8} />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-21'>
              {Array.from({ length: 6 }).map((_, index) => (
                <CourseCardX key={index} />
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className='relative col-span-12 md:col-span-4 order-1 md:order-2'>
            <div className='sticky top-[93px] left-0 right-0 w-full rounded-medium p-4 bg-white'>
              {/* Achievements */}

              {/* Info */}
              <div className='h-5 mx-auto max-w-full w-[200px] rounded-md bg-slate-300 animate-pulse' />

              {/* Email */}
              <div className='flex gap-2 mt-3'>
                <div className='h-4 max-w-full w-[60px] rounded-md bg-slate-300 animate-pulse' />
                <div className='h-4 max-w-full w-[200px] rounded-md bg-slate-300 animate-pulse' />
              </div>

              {/* Gender */}
              <div className='flex gap-2 mt-1.5'>
                <div className='h-4 max-w-full w-[100px] rounded-md bg-slate-300 animate-pulse' />
                <div className='h-4 max-w-full w-[50px] rounded-md bg-slate-300 animate-pulse' />
              </div>

              {/* Job */}
              <div className='flex gap-2 mt-1.5'>
                <div className='h-4 max-w-full w-[80px] rounded-md bg-slate-300 animate-pulse' />
                <div className='h-4 max-w-full w-[60px] rounded-md bg-slate-300 animate-pulse' />
              </div>

              {/* Bio */}
              <div className='flex flex-col gap-1.5 mt-1.5'>
                <div className='h-4 max-w-full w-[40px] rounded-md bg-slate-300 animate-pulse' />

                <div className='h-4 max-w-full w-[200px] rounded-md bg-slate-300 animate-pulse' />
                <div className='h-4 max-w-full rounded-md bg-slate-300 animate-pulse' />
                <div className='h-4 max-w-full w-[200px] rounded-md bg-slate-300 animate-pulse' />
                <div className='h-4 max-w-full rounded-md bg-slate-300 animate-pulse' />
              </div>
            </div>
          </div>
        </div>

        <Divider size={18} />

        {/* Questions */}
        <div className='max-w-1200 mx-auto px-21'>
          <div className='h-8 my-0.5 max-w-full w-[300px] rounded-md bg-slate-300 animate-pulse' />

          <Divider size={8} />

          <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-21'>
            {Array.from({ length: 6 }).map((_, index) => (
              <QuestionItemX key={index} />
            ))}
          </ul>
        </div>

        <Divider size={28} />
      </div>
    </div>
  )
}

export default ProfilePage
