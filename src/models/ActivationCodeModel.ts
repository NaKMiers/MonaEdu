import mongoose from 'mongoose'
import { ICourse } from './CourseModel'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const ActivationCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      length: 12,
      uppercase: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'course',
      required: true,
    },
    begin: {
      type: Date,
      required: true,
    },
    expire: {
      type: Date,
    },
    timesLeft: {
      type: Number,
      default: 1,
      min: 0,
    },
    usedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const ActivationCodeModel =
  mongoose.models.activationCode || mongoose.model('activationCode', ActivationCodeSchema)
export default ActivationCodeModel

export interface IActivationCode {
  _id: string
  code: string
  courseId: string | ICourse
  begin: string
  expire: string
  timesLeft: number
  usedUsers: string[] | IUser[]
  active: boolean
  createdAt: string
  updatedAt: string
}
