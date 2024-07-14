'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, memo } from 'react'
import { FaAngleRight } from 'react-icons/fa'
import Divider from './Divider'
import BeamsBackground from './backgrounds/BeamsBackground'

interface BreadcrumbBannerProps {
  title: string
  description: string
  background?: string
  className?: string
}

function BreadcrumbBanner({ title, description, background, className = '' }: BreadcrumbBannerProps) {
  // hooks
  const pathname = usePathname()
  const breadcrumbs = pathname
    .split('/')
    .slice(2)
    .filter((path) => path)

  return (
    <div
      className={`relative flex flex-col justify-center bg-neutral-950 bg-opacity-50 items-center mx-auto overflow-hidden ${className}`}
    >
      <div className='absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />
      <BeamsBackground />

      <div className='flex items-center gap-3 relative z-20 text-slate-400'>
        <Link href='/' className='hover:text-primary trans-200 hover:drop-shadow-md'>
          trang-chu
        </Link>
        <FaAngleRight size={14} />
        <Link href='/categories' className='hover:text-primary trans-200 hover:drop-shadow-md'>
          danh-muc
        </Link>
        {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={index}>
            {index === 0 && <FaAngleRight size={14} />}
            <Link
              href={`/categories/${breadcrumbs.slice(0, index + 1).join('/')}`}
              className='hover:text-primary trans-200 hover:drop-shadow-md'
            >
              {breadcrumb}
            </Link>
            {index !== breadcrumbs.length - 1 && <FaAngleRight size={14} />}
          </Fragment>
        ))}
      </div>

      <Divider size={3} />

      <h2 className='text-white text-2xl md:text-6xl font-bold text-center relative z-20'>{title}</h2>
      <p className='text-white text-sm md:text-2xl max-w-xl mt-6 text-center relative z-20'>
        {description}
      </p>
    </div>
  )
}

export default memo(BreadcrumbBanner)
