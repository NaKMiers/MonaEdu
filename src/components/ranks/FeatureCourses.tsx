'use client'

import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { memo, useEffect, useState } from 'react'
import CourseCard from '../CourseCard'
import Divider from '../Divider'
import Heading from '../Heading'

interface FeatureCoursesProps {
  courses: {
    category: ICategory
    courses: ICourse[]
  }[]
  className?: string
}

function FeatureCourses({ courses: originalData, className = '' }: FeatureCoursesProps) {
  // data
  const categories = originalData.map(item => item.category)

  // state
  const [width, setWidth] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    setWidth(window.innerWidth)

    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    let data = originalData.map(item => item.courses).flat()

    if (selectedCategory) {
      data = originalData.find(({ category }) => category._id === selectedCategory)?.courses || []
    }

    // split courses into 2 row
    if (data.length > 4) {
      const newCourses = [...data]

      // split courses into 2 row
      let row1 = newCourses.splice(0, Math.ceil(newCourses.length / 2))
      let row2 = newCourses

      let row1AtLeast = 4
      if (width >= 1280) {
        // xl
        row1AtLeast = 5
      } else if (width >= 1024) {
        // lg
        row1AtLeast = 4
      } else {
        row1AtLeast = 3
      }

      if (row1.length < row1AtLeast) {
        const fill = row1AtLeast - row1.length
        row1 = [...row1, ...row2.splice(0, fill)]
      }

      setCourses([row1, row2])
    } else {
      setCourses([data])
    }
  }, [originalData, selectedCategory, width])

  return (
    <div className={`border-b-2 border-t-2 border-light bg-dark-100 ${className}`}>
      <Divider size={16} />

      <div className="px-21">
        <Heading title="Khóa học nổi bật" />
      </div>

      <Divider size={14} />

      {/* Select Tab */}
      <div className="flex justify-center border-b border-neutral-800 bg-white">
        <div className="flex overflow-x-auto text-nowrap">
          <button
            className={`${
              selectedCategory === '' ? 'bg-neutral-700 text-light' : ''
            } trans-300 min-w-[100px] flex-shrink-0 px-3 py-3 text-center font-body text-lg font-semibold tracking-wider hover:bg-neutral-800 hover:text-primary`}
            onClick={() => setSelectedCategory('')}
          >
            Tất cả
          </button>
          {categories.map(category => (
            <button
              className={`${
                selectedCategory === category._id ? 'bg-neutral-700 text-light' : ''
              } trans-300 min-w-[100px] flex-shrink-0 px-3 py-3 text-center font-body text-lg font-semibold tracking-wider hover:bg-neutral-800 hover:text-primary`}
              onClick={() => setSelectedCategory(category._id)}
              key={category._id}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 overflow-x-auto bg-slate-200 px-2 py-21 md:gap-21 md:px-21/2">
        {courses.map((row, index) => (
          <div
            className="flex"
            key={index}
          >
            {row.map((course: ICourse) => (
              <div
                className="w-1/2 flex-shrink-0 px-2 md:w-1/3 md:px-21/2 lg:w-1/4 xl:w-1/5"
                key={course._id}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Divider size={16} />
    </div>
  )
}

export default memo(FeatureCourses)
