import { removeDiacritics } from '@/utils'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CategorySchema = new Schema(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
    title: {
      type: String,
      required: true,
    },
    titleNoDiacritics: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    courseQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    booted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// pre-save hook
CategorySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.titleNoDiacritics = removeDiacritics(this.title)
  }

  next()
})

const CategoryModel = mongoose.models.category || mongoose.model('category', CategorySchema)
export default CategoryModel

export interface ICategory {
  _id: string
  parentId: string | ICategory
  title: string
  titleNoDiacritics: string
  description: string
  image: string
  slug: string
  courseQuantity: number
  booted: boolean
  createdAt: string
  updatedAt: string

  // subs
  subs: any
}
