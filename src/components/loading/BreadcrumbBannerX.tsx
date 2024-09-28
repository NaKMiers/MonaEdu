import { Fragment } from 'react'
import { FaAngleRight } from 'react-icons/fa'
import Divider from '../Divider'
import BeamsBackground from '../backgrounds/BeamsBackground'

function BreadcrumbBannerX({ className = '' }: { className?: string }) {
  // hooks
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-neutral-950 bg-opacity-50 px-21 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />
      <BeamsBackground />

      <div className="relative z-20 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-slate-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <Fragment key={index}>
            <div className="h-5 w-[80px] animate-pulse rounded-md bg-slate-300" />
            {index < 4 && <FaAngleRight size={14} />}
          </Fragment>
        ))}
      </div>

      <Divider size={3} />

      <div className="mt-6 h-[52px] w-full max-w-[450px] animate-pulse rounded-md bg-slate-500" />

      <div className="mt-7 flex w-full flex-col items-center gap-1.5">
        <div className="h-4 w-full max-w-[300px] animate-pulse rounded-md bg-slate-500" />
        <div className="h-4 w-full max-w-[300px] animate-pulse rounded-md bg-slate-500" />
        <div className="h-4 w-full max-w-[300px] animate-pulse rounded-md bg-slate-500" />
      </div>
    </div>
  )
}

export default BreadcrumbBannerX
