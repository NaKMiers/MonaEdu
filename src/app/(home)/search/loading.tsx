import Divider from '@/components/Divider'
import CourseCardX from '@/components/loading/CourseCardX'
import PaginationX from '@/components/loading/PaginationX'

async function Loading() {
  return (
    <div className="px-21 pt-12 md:pt-16">
      {/* Heading */}
      <div className="mb-1 flex flex-wrap items-center justify-center gap-3">
        <div className="h-9 w-full max-w-[400px] animate-pulse rounded-md bg-slate-700" />
        <div className="h-9 w-10 animate-pulse rounded-md bg-slate-700" />
      </div>

      <Divider size={18} />

      {/* MAIN List */}
      <div className="grid grid-cols-2 gap-21 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseCardX key={index} />
        ))}
      </div>

      <Divider size={10} />

      {/* Pagination */}
      <PaginationX />

      <Divider size={20} />
    </div>
  )
}

export default Loading
