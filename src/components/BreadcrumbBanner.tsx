'use client'

import { capitalize } from '@/utils/string'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaAngleRight } from 'react-icons/fa'
import Divider from './Divider'
import BoxesBackground from './backgrounds/BoxesBackground'
import { Fragment } from 'react'

interface BreadcrumbBannerProps {
  title: string
  description: string
  className?: string
}

function BreadcrumbBanner({ title, description, className = '' }: BreadcrumbBannerProps) {
  // hooks
  const pathname = usePathname()
  const breadcrumbs = pathname.split('/').filter(path => path)

  return (
    <div
      className={`relative flex flex-col justify-center bg-secondary bg-opacity-50 items-center mx-auto overflow-hidden ${className}`}
    >
      <div className='absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />
      <BoxesBackground />

      <div className='flex items-center gap-3 relative z-20'>
        <Link href='/' className='text-light hover:text-primary trans-200 hover:drop-shadow-md'>
          Trang chủ
        </Link>
        <FaAngleRight size={14} className='text-white' />

        {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={index}>
            <Link href='/' className='text-light hover:text-primary trans-200 hover:drop-shadow-md'>
              {capitalize(breadcrumb)}
            </Link>
            {index !== breadcrumbs.length - 1 && <FaAngleRight size={14} className='text-white' />}
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

export default BreadcrumbBanner
