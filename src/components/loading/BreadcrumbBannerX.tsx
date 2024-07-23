import { Fragment } from 'react'
import { FaAngleRight } from 'react-icons/fa'
import Divider from '../Divider'
import BeamsBackground from '../backgrounds/BeamsBackground'

function BreadcrumbBannerX({ className = '' }: { className?: string }) {
  // hooks
  return (
    <div
      className={`relative flex flex-col justify-center bg-neutral-950 bg-opacity-50 items-center px-21 ${className}`}
    >
      <div className='absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />
      <BeamsBackground />

      <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5 relative z-20 text-slate-400'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Fragment key={index}>
            <div className='h-5 w-[80px] rounded-md bg-slate-300 animate-pulse' />
            {index < 4 && <FaAngleRight size={14} />}
          </Fragment>
        ))}
      </div>

      <Divider size={3} />

      <div className='w-full max-w-[450px] h-[52px] mt-6 rounded-md bg-slate-500 animate-pulse' />

      <div className='flex flex-col gap-1.5 w-full items-center mt-7'>
        <div className='h-4 w-full max-w-[300px] bg-slate-500 animate-pulse rounded-md' />
        <div className='h-4 w-full max-w-[300px] bg-slate-500 animate-pulse rounded-md' />
        <div className='h-4 w-full max-w-[300px] bg-slate-500 animate-pulse rounded-md' />
      </div>
    </div>
  )
}

export default BreadcrumbBannerX
