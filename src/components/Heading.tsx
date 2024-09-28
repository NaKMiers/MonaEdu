import { memo } from 'react'

interface HeadingProps {
  title: string
  noLine?: boolean
  space?: boolean
  className?: string
  align?: 'left' | 'center' | 'right'
}

function Heading({ title, noLine, space, align = 'center', className }: HeadingProps) {
  return (
    <div
      className={`relative mx-auto max-w-1200 ${noLine ? 'h-0' : 'h-0.5'} rounded-lg bg-white ${
        space ? 'w-[calc(100%_-_21_*_2px)]' : 'w-full'
      } ${className}`}
    >
      <h1
        className={`absolute top-1/2 ${
          align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
        } -translate-y-1/2 text-nowrap rounded-lg bg-white px-2 py-1 text-center text-xs font-semibold xs:px-4 xs:text-xl sm:text-2xl`}
      >
        {title}
      </h1>
    </div>
  )
}

export default memo(Heading)
