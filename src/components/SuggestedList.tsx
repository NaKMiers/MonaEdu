import { ICourse } from '@/models/CourseModel'
import { useEffect, useState } from 'react'
import CourseCard from './CourseCard'
import GroupCourses from './GroupCourses'
import toast from 'react-hot-toast'
import { getSuggestedCoursesApi } from '@/requests'
import { useAppSelector } from '@/libs/hooks'

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
        const coursesInCart = cartItems.map(cartItem => (cartItem.courseId as ICourse)._id)
        console.log('coursesInCart: ', coursesInCart)
        const query = '?' + coursesInCart.map(courseId => `courses=${courseId}`).join('&')

        const { courses } = await getSuggestedCoursesApi(query)
        setCourses(courses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getSuggestedCourses()
  }, [cartItems])

  return (
    <div className={`w-full px-21 ${className}`}>
      <h3 className='font-semibold text-2xl mb-2'>Các khóa học đề xuất</h3>

      <GroupCourses className='-mx-21/2' classChild='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
        {courses.map(course => (
          <CourseCard course={course} key={course._id} />
        ))}
      </GroupCourses>
    </div>
  )
}

export default SuggestedList
