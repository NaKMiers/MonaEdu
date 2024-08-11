import { ICourse } from '@/models/CourseModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment-timezone'

const getRecentlyVisitedCourses = (): ICourse[] => {
  if (typeof window !== 'undefined') {
    // Check if localStorage is available
    const courses = localStorage.getItem('recentlyVisit')
    if (courses) {
      return JSON.parse(courses).filter(
        (course: any) => moment().diff(moment(course.lastVisit), 'days') < 1
      )
    }
  }
  return []
}

export const course = createSlice({
  name: 'course',
  initialState: {
    recentlyVisitCourses: getRecentlyVisitedCourses(),
  },
  reducers: {
    setRecentlyVisitCourses: (state, action: PayloadAction<ICourse[]>) => {
      const payload = action.payload.map(course => ({ ...course, lastVisit: new Date() }))
      localStorage.setItem('recentlyVisit', JSON.stringify(payload))
      return {
        ...state,
        recentlyVisitCourses: action.payload,
      }
    },
    addRecentlyVisitCourses: (state, action: PayloadAction<ICourse[]>) => {
      const payload = action.payload.map(course => ({ ...course, lastVisit: new Date() }))
      const courses = [...payload, ...state.recentlyVisitCourses]
      let uniqueCourses = courses.filter(
        (course, index, self) => index === self.findIndex(t => t._id === course._id)
      )
      // make sure only no more than 16 courses are stored
      if (uniqueCourses.length > 16) {
        uniqueCourses = uniqueCourses.slice(0, 16)
      }

      localStorage.setItem('recentlyVisit', JSON.stringify(uniqueCourses))
      return {
        ...state,
        recentlyVisitCourses: uniqueCourses,
      }
    },
    removeRecentlyVisitCourses: (state, action: PayloadAction<ICourse>) => {
      const courses = state.recentlyVisitCourses.filter(course => course._id !== action.payload._id)
      localStorage.setItem('recentlyVisit', JSON.stringify(courses))
      return {
        ...state,
        recentlyVisitCourses: courses,
      }
    },
  },
})

export const { setRecentlyVisitCourses, addRecentlyVisitCourses, removeRecentlyVisitCourses } =
  course.actions
export default course.reducer
