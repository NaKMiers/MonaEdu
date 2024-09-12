import Divider from '@/components/Divider'

function PackageItemX({ className = '' }: { className?: string }) {
  return (
    <div className={`relative xl:min-w-[400px] w-1/2 md:w-1/3 ${className}`}>
      <div className='flex flex-col min-h-[500px] w-full p-[40px] max-sm:p-21 bg-neutral-950 border rounded-none overflow-hidden'>
        <div className='bg-slate-300 animate-pulse w-32 h-6 rounded-lg' />

        <div className='text-neutral-200 mt-4 relative z-20'>
          <ul className='list-none mt-2 flex flex-col gap-[14px]'>
            {Array.from({ length: 6 }).map((_, index) => (
              <li className='flex gap-2 items-center' key={index}>
                <div className='w-3 h-3 rounded-md bg-slate-300 animate-pulse' />
                <div className='w-full h-5 rounded-md bg-slate-300 animate-pulse' />
              </li>
            ))}
          </ul>
        </div>

        <Divider className='relative z-20' size={3} border />

        <div className='flex gap-2 items-center'>
          <div className='w-20 h-2.5 rounded-lg animate-pulse bg-slate-300' />
          <div className='w-20 h-2.5 rounded-lg animate-pulse bg-slate-300' />
        </div>

        <div className='flex-1 flex items-end py-21'>
          <button className='flex items-center justify-between px-4 min-h-10 py-1 w-full rounded-3xl border border-neutral-700 bg-neutral-900 animate-pulse'>
            <div className='w-32 h-2.5 animate-pulse bg-slate-300 rounded-lg' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PackageItemX
