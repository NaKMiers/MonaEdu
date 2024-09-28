import { useAppSelector } from '@/libs/hooks'
import { ICourse } from '@/models/CourseModel'
import { getSuggestedCoursesApi } from '@/requests'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CourseCard from './CourseCard'
import GroupCourses from './GroupCourses'

interface SuggestedListProps {
  className?: string
}

function SuggestedList({ className = '' }: SuggestedListProps) {
  // reducer
  const cartItems = useAppSelector(state => state.cart.items)

  // states
  const [courses, setCourses] = useState<ICourse[]>([])

  // get suggested courses
  useEffect(() => {
    const getSuggestedCourses = async () => {
      try {
        const coursesInCart = cartItems
          .filter(Boolean)
          .map(cartItem => (cartItem.courseId as ICourse)._id)

        const query = '?' + coursesInCart.map(courseId => `courses=${courseId}`).join('&')

        const { courses } = await getSuggestedCoursesApi(query, { next: { revalidate: 30 } })
        setCourses(courses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getSuggestedCourses()
  }, [cartItems])

  if (courses.length <= 0) {
    return null
  }

  return (
    <div className={`w-full px-21 ${className}`}>
      <h3 className="mb-2 text-2xl font-semibold">Các khóa học đề xuất</h3>

      <GroupCourses
        className="-mx-21/2"
        classChild="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
      >
        {courses.map(course => (
          <CourseCard
            course={course}
            key={course._id}
          />
        ))}
      </GroupCourses>
    </div>
  )
}

export default memo(SuggestedList)
