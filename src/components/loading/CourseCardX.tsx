import Divider from '../Divider'

function CourseCardX() {
  return (
    <div className='w-full'>
      <div className='flex flex-col h-full rounded-xl p-2.5 md:p-4 bg-slate-500'>
        <Divider size={2} />

        <div className='h-12 w-full mb-1 md:mb-2 animate-pulse bg-slate-700 rounded-md' />
        <div className='h-10 w-full mb-1 md:mb-2 animate-pulse bg-slate-700 rounded-md' />

        <div className='aspect-video shadow-lg rounded-lg bg-slate-300 animate-pulse' />

        <Divider size={4} />

        <div className='flex items-center gap-1 w-full'>
          <div className='font-semibold h-[42px] w-full rounded-lg shadow-lg bg-slate-700 animate-pulse' />
          <div className={`h-[42px] w-12 px-3 flex rounded-lg shadow-lg bg-slate-300 animate-pulse`} />
        </div>
      </div>
    </div>
  )
}

export default CourseCardX
