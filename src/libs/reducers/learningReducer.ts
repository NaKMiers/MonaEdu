import { ILesson } from '@/models/LessonModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const learning = createSlice({
  name: 'learning',
  initialState: {
    learningLesson: null as ILesson | null,
    userProgress: 0,
  },
  reducers: {
    setLearningLesson: (state, action: PayloadAction<ILesson>) => ({
      ...state,
      learningLesson: action.payload,
    }),

    resetLearningLesson: state => ({
      ...state,
      learningLesson: null,
    }),

    setUserProgress: (state, action: PayloadAction<number>) => ({
      ...state,
      userProgress: action.payload,
    }),
  },
})

export const { setLearningLesson, resetLearningLesson, setUserProgress } = learning.actions
export default learning.reducer
