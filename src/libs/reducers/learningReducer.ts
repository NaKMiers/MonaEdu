import { IChapter } from '@/models/ChapterModel'
import { ILesson } from '@/models/LessonModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const learning = createSlice({
  name: 'learning',
  initialState: {
    chapters: [] as IChapter[],
    learningLesson: null as ILesson | null,
    userProgress: 0,
  },
  reducers: {
    setChapters: (state, action: PayloadAction<IChapter[]>) => ({
      ...state,
      chapters: action.payload,
    }),

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

export const { setChapters, setLearningLesson, resetLearningLesson, setUserProgress } = learning.actions
export default learning.reducer
