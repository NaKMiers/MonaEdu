import Divider from '@/components/Divider'
import CourseCardX from '@/components/loading/CourseCardX'
import PaginationX from '@/components/loading/PaginationX'

async function Loading() {
  return (
    <div className='px-21 pt-12 md:pt-16'>
      {/* Heading */}
      <div className='flex items-center justify-center flex-wrap gap-3 mb-1'>
        <div className='w-full max-w-[400px] h-9 rounded-md bg-slate-700 animate-pulse' />
        <div className='w-10 h-9 rounded-md bg-slate-700 animate-pulse' />
      </div>

      <Divider size={18} />

      {/* MAIN List */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-21'>
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
