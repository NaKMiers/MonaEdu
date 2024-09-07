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
  preLink?: { label: string; href: string }[]
  className?: string
}

function BreadcrumbBanner({ title, description, preLink = [], className = '' }: BreadcrumbBannerProps) {
  // hooks
  const pathname = usePathname()
  const breadcrumbs = pathname
    .split('/')
    .slice(2)
    .filter(path => path)

  return (
    <div
      className={`relative flex flex-col justify-center items-center p-3 overflow-y-auto bg-neutral-950 bg-opacity-50 mx-auto overflow-hidden ${className}`}
    >
      <div className='absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />
      <BeamsBackground />

      <div className='flex items-center flex-wrap justify-center gap-x-3 gap-y-1 relative z-20 text-slate-400 text-nowrap'>
        {preLink.map((link, index) => (
          <Fragment key={index}>
            <Link href={link.href} className='hover:text-primary trans-200 hover:drop-shadow-md'>
              {link.label}
            </Link>
            {index < preLink.length - 1 && <FaAngleRight size={14} />}
          </Fragment>
        ))}
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
      <p className='text-white text-sm md:text-base max-w-xl mt-6 text-center relative z-20'>
        {description}
      </p>
    </div>
  )
}

export default memo(BreadcrumbBanner)
