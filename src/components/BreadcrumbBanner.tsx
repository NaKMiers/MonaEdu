'use client'

import React from 'react'
import VortexBackground from './backgrounds/VortexBackground'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaAngleRight } from 'react-icons/fa'
import { capitalize } from '@/utils/string'
import Divider from './Divider'

interface BreadcrumbBannerProps {
  title: string
  description: string
  className?: string
}

function BreadcrumbBanner({ className = '' }: BreadcrumbBannerProps) {
  // hooks
  const pathname = usePathname()
  const breadcrumbs = pathname.split('/').filter(path => path)

  return (
    <div className={`h-[300px] mx-auto overflow-hidden ${className}`}>
      <VortexBackground className='flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full'>
        <div className='flex items-center gap-3'>
          {breadcrumbs.map((breadcrumb, index) => (
            <>
              <Link href='/' className='text-light hover:text-primary trans-200 hover:drop-shadow-md'>
                {capitalize(breadcrumb)}
              </Link>
              {index !== breadcrumbs.length - 1 && <FaAngleRight size={14} className='text-white' />}
            </>
          ))}
        </div>

        <Divider size={3} />

        <h2 className='text-white text-2xl md:text-6xl font-bold text-center'>English</h2>
        <p className='text-white text-sm md:text-2xl max-w-xl mt-6 text-center'>
          This is chemical burn. It&apos;ll hurt more than you&apos;ve ever been burned and you&apos;ll
          have a scar.
        </p>
      </VortexBackground>
    </div>
  )
}

export default BreadcrumbBanner
