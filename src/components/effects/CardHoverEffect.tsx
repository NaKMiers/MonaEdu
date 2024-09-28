'use client'

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
      className={`group relative block h-full w-full p-2 ${className}`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200 dark:bg-slate-800/[0.8]"
            layoutId="hoverBackground"
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
