import { ICourse } from '@/models/CourseModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment-timezone'

export const course = createSlice({
  name: 'course',
  initialState: {
    recentlyVisitCourses: JSON.parse(localStorage.getItem('recentlyVisit') || '[]').filter(
      (course: any) => moment().diff(moment(course.lastVisit), 'days') < 1
    ) as ICourse[],
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
      const uniqueCourses = courses.filter(
        (course, index, self) => index === self.findIndex(t => t._id === course._id)
      )
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
