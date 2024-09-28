import Divider from '@/components/Divider'
import CourseCardX from '@/components/loading/CourseCardX'

async function ProfilePageX() {
  return (
    <div>
      {/* Head */}
      <div className="bg-neutral-800 md:-mt-[72px] md:pt-[72px]">
        {/* Container */}
        <div className="mx-auto max-w-1200 md:pt-21">
          {/* Banner */}
          <div className="aspect-[7/3] w-full animate-pulse rounded-b-3xl bg-slate-700 md:aspect-[3/1] md:rounded-t-3xl lg:aspect-[9/2]" />

          <div className="relative -mt-[84px] md:mt-0 md:h-[104px]">
            <div className="z-10 flex flex-col-reverse items-center justify-center gap-3 sm:right-6 md:absolute md:right-12 md:top-0 md:-translate-y-1/2 md:flex-row md:items-end md:justify-end">
              <div className="flex flex-col items-center justify-end gap-1.5 pb-4 md:items-end">
                <div className="h-8 w-[300px] max-w-full animate-pulse rounded-md bg-slate-300" />
                <div className="h-5 w-[100px] max-w-full animate-pulse rounded-md bg-slate-500" />
              </div>

              <div className="aspect-square w-full max-w-[168px] flex-shrink-0 overflow-hidden rounded-full border-[4px] border-slate-700 bg-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="-mb-36 bg-neutral-700 pb-48">
        <div className="mx-auto grid max-w-1200 grid-cols-12 gap-x-21 gap-y-12 px-21 pt-12">
          {/* Courses */}
          <div className="order-2 col-span-12 md:order-1 md:col-span-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="my-0.5 h-8 w-[300px] max-w-full animate-pulse rounded-md bg-slate-300" />
              <div className="my-0.5 h-6 w-[80px] max-w-full animate-pulse rounded-md bg-slate-300" />
            </div>

            <Divider size={8} />

            <div className="grid grid-cols-1 gap-21 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <CourseCardX key={index} />
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="relative order-1 col-span-12 md:order-2 md:col-span-4">
            <div className="sticky left-0 right-0 top-[93px] w-full rounded-medium bg-white p-4">
              {/* Achievements */}

              {/* Info */}
              <div className="mx-auto h-5 w-[200px] max-w-full animate-pulse rounded-md bg-slate-300" />

              {/* Email */}
              <div className="mt-3 flex gap-2">
                <div className="h-4 w-[60px] max-w-full animate-pulse rounded-md bg-slate-300" />
                <div className="h-4 w-[200px] max-w-full animate-pulse rounded-md bg-slate-300" />
              </div>

              {/* Gender */}
              <div className="mt-1.5 flex gap-2">
                <div className="h-4 w-[100px] max-w-full animate-pulse rounded-md bg-slate-300" />
                <div className="h-4 w-[50px] max-w-full animate-pulse rounded-md bg-slate-300" />
              </div>

              {/* Job */}
              <div className="mt-1.5 flex gap-2">
                <div className="h-4 w-[80px] max-w-full animate-pulse rounded-md bg-slate-300" />
                <div className="h-4 w-[60px] max-w-full animate-pulse rounded-md bg-slate-300" />
              </div>

              {/* Bio */}
              <div className="mt-1.5 flex flex-col gap-1.5">
                <div className="h-4 w-[40px] max-w-full animate-pulse rounded-md bg-slate-300" />

                <div className="h-4 w-[200px] max-w-full animate-pulse rounded-md bg-slate-300" />
                <div className="h-4 max-w-full animate-pulse rounded-md bg-slate-300" />
                <div className="h-4 w-[200px] max-w-full animate-pulse rounded-md bg-slate-300" />
                <div className="h-4 max-w-full animate-pulse rounded-md bg-slate-300" />
              </div>
            </div>
          </div>
        </div>

        <Divider size={28} />
      </div>
    </div>
  )
}

export default ProfilePageX
