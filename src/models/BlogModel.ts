import { generateSlug, removeDiacritics } from '@/utils'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleNoDiacritics: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    thumbnails: {
      type: [{ type: String }],
      minlength: 1,
    },
    tags: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    summary: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    booted: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    relatedBlogs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'blog',
      },
    ],
  },
  { timestamps: true }
)

// pre-save hook
BlogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
    this.titleNoDiacritics = removeDiacritics(this.title)
  }

  next()
})

const BlogModel = mongoose.models.blog || mongoose.model('blog', BlogSchema)
export default BlogModel

export interface IBlog {
  _id: string
  title: string
  titleNoDiacritics: string
  slug: string
  thumbnails: string[]
  tags: string[]
  content: string
  author: string
  status: 'draft' | 'published' | 'archived'
  summary: string
  views: number
  commentAmount: number
  likes: string[]
  booted: boolean
  publishedAt: string
  relatedBlogs: any[]
  createdAt: string
  updatedAt: string
}
