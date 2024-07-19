import { ILesson } from '@/models/LessonModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const learning = createSlice({
  name: 'learning',
  initialState: {
    learningLesson: null as ILesson | null,
  },
  reducers: {
    setLearningLesson: (state, action: PayloadAction<ILesson>) => ({
      ...state,
      learningLesson: action.payload,
    }),

    resetLearningLesson: (state) => ({
      ...state,
      learningLesson: null,
    }),
  },
})

export const { setLearningLesson, resetLearningLesson } = learning.actions
export default learning.reducer
