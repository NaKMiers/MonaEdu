import mongoose from 'mongoose'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    image: {
      type: String,
      default: '/images/logo.png',
    },
    title: {
      type: String,
      required: true,
    },
    content: String,
    link: String,
    type: {
      type: String,
      enum: [
        'unset',
        'create-order',
        'delivered-order',
        'replied-comment',
        'emotion-comment',
        'new-lesson',
        'new-event',
        'given-course',
      ],
      default: 'unset',
    },
    status: {
      type: String,
      enum: ['read', 'unread'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
)

const NotificationModel =
  mongoose.models.notification || mongoose.model('notification', NotificationSchema)
export default NotificationModel

export interface INotification {
  _id: string
  userId: string | IUser
  image: string
  title: string
  content?: string
  link?: string
  type: string
  status: 'read' | 'unread'
  createdAt: string
}
