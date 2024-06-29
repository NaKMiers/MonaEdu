'use client'

import { cn } from '@/utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { Children, useState } from 'react'

export const HoverEffect = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return Children.toArray(children).map((child, index) => (
    <div
      key={index}
      className='relative group  block p-2 h-full w-full'
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className='absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl'
            layoutId='hoverBackground'
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      {child}
    </div>
  ))
}
