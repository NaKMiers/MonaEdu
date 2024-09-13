import { generateSlug, removeDiacritics } from '@/utils'
import mongoose from 'mongoose'
import { ICategory } from './CategoryModel'
import { IChapter } from './ChapterModel'
import { IFlashSale } from './FlashSaleModel'
import { ILesson } from './LessonModel'
import { ITag } from './TagModel'
import { IUser } from './UserModel'

const Schema = mongoose.Schema

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleNoDiacritics: {
      type: String,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value >= 0
        },
        message: 'Invalid price',
      },
      min: 0,
    },
    citing: {
      type: String,
    },
    author: {
      type: String,
    },
    textHook: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    flashSale: {
      type: Schema.Types.ObjectId,
      ref: 'flashSale',
    },
    tags: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'tag',
          minlength: 1,
        },
      ],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
    images: {
      type: [{ type: String }],
      minlength: 1,
    },
    joined: {
      type: Number,
      default: 0,
      min: 0,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    languages: {
      type: [{ type: String }],
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
    booted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// pre-save hook
CourseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
    this.titleNoDiacritics = removeDiacritics(this.title)
  }

  next()
})

// create model from schema
const CourseModel = mongoose.models.course || mongoose.model('course', CourseSchema)
export default CourseModel

export interface ICourse {
  _id: string
  title: string
  titleNoDiacritics: string
  oldPrice: number
  price: number
  citing: string
  author: string
  textHook: string
  description: string
  flashSale: string | undefined | IFlashSale
  tags: string[] | ITag[]
  category: string | ICategory
  images: string[]
  joined: number
  slug: string
  active: boolean
  likes: string[] | IUser[]
  languages: string[]
  duration: number
  booted: boolean
  createdAt: string
  updatedAt: string

  // sub
  chapters?: IChapter[]
  lessons: ILesson[]
}
