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
      className={`relative mx-auto flex flex-col items-center justify-center overflow-hidden overflow-y-auto bg-neutral-950 bg-opacity-50 p-3 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />
      <BeamsBackground />

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-nowrap text-slate-400">
        {preLink.map((link, index) => (
          <Fragment key={index}>
            <Link
              href={link.href}
              className="trans-200 hover:text-primary hover:drop-shadow-md"
            >
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
              className="trans-200 hover:text-primary hover:drop-shadow-md"
            >
              {breadcrumb}
            </Link>
            {index !== breadcrumbs.length - 1 && <FaAngleRight size={14} />}
          </Fragment>
        ))}
      </div>

      <Divider size={3} />

      <h2
        className={`text-light ${
          description ? 'text-2xl' : 'text-4xl'
        } relative z-20 mt-2 text-center font-bold md:text-6xl`}
      >
        {title}
      </h2>
      <p className="relative z-20 mt-6 max-w-xl text-center text-sm text-light md:text-base">
        {description}
      </p>
    </div>
  )
}

export default memo(BreadcrumbBanner)
