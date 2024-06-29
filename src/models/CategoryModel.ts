import { generateSlug } from '@/utils'
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
    description: {
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

// pre-save hook to generate slug from title
CategorySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }
  next()
})

const CategoryModel = mongoose.models.category || mongoose.model('category', CategorySchema)
export default CategoryModel

export interface ICategory {
  _id: string
  parentId: string | ICategory
  title: string
  description: string
  slug: string
  courseQuantity: number
  booted: boolean
  createdAt: string
  updatedAt: string

  // subs
  subs: any
}
