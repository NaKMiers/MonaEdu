import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
import { IChapter } from './ChapterModel'
import { ICourse } from './CourseModel'
import { IProgress } from './ProgressModel'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const LessonSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'course',
      required: true,
    },
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: 'chapter',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number, // in seconds
      required: true,
      min: 0,
    },
    sourceType: {
      type: String,
      enum: ['file', 'embed', 'none'],
    },
    source: {
      type: String,
    },
    docs: [
      {
        name: String,
        url: String,
        size: Number,
      },
    ],
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    commentAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// pre-save hook to generate slug from title
LessonSchema.pre('save', function (next) {
  console.log('- Pre-Save Lesson -')

  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }
  next()
})

const LessonModel = mongoose.models.lesson || mongoose.model('lesson', LessonSchema)
export default LessonModel

export interface ILesson {
  _id: string
  courseId: string | ICourse
  chapterId: string | IChapter
  title: string
  sourceType: 'embed' | 'file'
  docs: IDoc[]
  slug: string
  duration: number
  source: string
  description: string
  active: boolean
  status: string
  likes: string[] | IUser[]
  commentAmount: number
  createdAt: string
  updatedAt: string

  // subs
  progress?: IProgress
}

export interface IDoc {
  name: string
  url: string
  size: number
}
