'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaQuestionCircle } from 'react-icons/fa'
import { FaBoltLightning } from 'react-icons/fa6'

interface FloatingButtonsProps {
  className?: string
}

function FloatingButtons({ className = '' }: FloatingButtonsProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)

  // key board event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // clean up
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])

  return (
    <div
      className={`fixed z-30 right-3 bottom-[140px] flex flex-col gap-2 items-center rounded-xl trans-300 overflow-hidden shadow-medium-light select-none ${className}`}
    >
      <Link
        href='/flash-sale'
        className='group flex items-center justify-center h-[44px] w-[44px] border-2 bg-dark-100 border-light rounded-xl'
        onClick={() => setOpen(!open)}
      >
        <FaBoltLightning size={20} className={`text-white wiggle trans-200`} />
      </Link>

      <Link
        href='/forum'
        className='group flex items-center justify-center h-[44px] w-[44px] border-2 bg-dark-100 border-light rounded-xl'
        onClick={() => setOpen(!open)}
      >
        <FaQuestionCircle size={20} className={`text-white wiggle trans-200`} />
      </Link>
    </div>
  )
}

export default FloatingButtons
