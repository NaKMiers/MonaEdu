'use client'

import { useAppSelector } from '@/libs/hooks'
import { memo } from 'react'
import CourseCard from '../CourseCard'
import Divider from '../Divider'
import GroupCourses from '../GroupCourses'
import Heading from '../Heading'

function RecentlyVisit() {
  // hook
  const courses = useAppSelector(state => state.course.recentlyVisitCourses)

  if (courses.length === 0) return null

  return (
    <div className={`max-w-1200 w-full mx-auto px-21`}>
      <Heading title='Đã xem gần đây' />

      <Divider size={16} />

      <GroupCourses className='' classChild='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
        {courses.map(course => (
          <CourseCard course={course} key={course._id} />
        ))}
      </GroupCourses>
    </div>
  )
}

export default memo(RecentlyVisit)
