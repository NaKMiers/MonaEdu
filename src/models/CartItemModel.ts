import mongoose from 'mongoose'
import { IUser } from './UserModel'
import { ICourse } from './CourseModel'
const Schema = mongoose.Schema

const CartItemSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'course',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const CartItemModel = mongoose.models.cartItem || mongoose.model('cartItem', CartItemSchema)
export default CartItemModel

export interface ICartItem {
  _id: string
  userId: string | IUser
  courseId: string | ICourse
  quantity: number
  createdAt: string
  updatedAt: string
}
