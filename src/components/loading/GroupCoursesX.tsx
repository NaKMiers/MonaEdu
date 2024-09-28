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
      <div className="flex flex-wrap">
        <div className="flex w-full overflow-x-auto py-21">
          {Children.toArray(children).map((child, index) => (
            <div
              key={index}
              className={`relative h-full flex-shrink-0 px-21/2 ${classChild}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GroupCoursesX
