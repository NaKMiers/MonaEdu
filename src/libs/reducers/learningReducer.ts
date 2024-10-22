import { IChapter } from '@/models/ChapterModel'
import { ILesson } from '@/models/LessonModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const learning = createSlice({
  name: 'learning',
  initialState: {
    chapters: [] as IChapter[],
    learningLesson: null as ILesson | null,
    userProgress: 0 as number,
    nextLesson: '' as string,
    prevLesson: '' as string,
    isFullScreen: false as boolean,
  },
  reducers: {
    setChapters: (state, action: PayloadAction<IChapter[]>) => {
      state.chapters = action.payload
    },

    setLearningLesson: (state, action: PayloadAction<ILesson>) => {
      state.learningLesson = action.payload
    },

    setNextLesson: (state, action: PayloadAction<string>) => {
      state.nextLesson = action.payload
    },

    setPrevLesson: (state, action: PayloadAction<string>) => {
      state.prevLesson = action.payload
    },

    resetLearningLesson: state => {
      state.learningLesson = null
    },

    setUserProgress: (state, action: PayloadAction<number>) => {
      state.userProgress = action.payload
    },

    setIsFullScreen: (state, action: PayloadAction<boolean>) => {
      state.isFullScreen = action.payload
    },
  },
})

export const {
  setChapters,
  setLearningLesson,
  setNextLesson,
  setPrevLesson,
  resetLearningLesson,
  setUserProgress,
  setIsFullScreen,
} = learning.actions
export default learning.reducer
