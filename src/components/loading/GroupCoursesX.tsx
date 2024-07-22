import { Children, ReactNode } from 'react'

interface GroupCoursesXProps {
  className?: string
  classChild?: string
  children: ReactNode
}

function GroupCoursesX({ className = '', classChild = '', children }: GroupCoursesXProps) {
  return (
    <div className={`relative ${className}`}>
      {/* MARK: Slider */}
      <div className='flex flex-wrap'>
        <div className='flex w-full py-21 overflow-x-auto'>
          {Children.toArray(children).map((child, index) => (
            <div key={index} className={`relative h-full px-21/2 flex-shrink-0 ${classChild}`}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GroupCoursesX
