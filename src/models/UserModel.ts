import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { ICourse } from './CourseModel'
import { IPackage } from './PackageModel'
import { IVoucher } from './VoucherModel'
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    // Authentication
    username: {
      type: String,
      required: function (this: { authType: string }) {
        return this.authType === 'local'
      },
      unique: function (this: { authType: string }) {
        return this.authType === 'local'
      },
    },
    nickname: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$$/.test(value)
        },
        message: 'Email không hợp lệ',
      },
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (value: string) {
          return /^0\d{9,10}$/.test(value)
        },
        message: 'Số điện thoại không hợp lệ',
      },
    },
    bio: {
      type: String,
      default: '',
    },
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
    verifiedPhone: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: function (this: { authType: string }) {
        return this.authType === 'local'
      },
      validate: {
        validator: function (value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)
        },
        message: 'Mật khẩu không hợp lệ',
      },
    },
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook', 'github'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'editor', 'collaborator'],
      default: 'user',
    },

    // Information
    avatar: {
      type: String,
      default: process.env.NEXT_PUBLIC_DEFAULT_AVATAR,
    },
    banner: {
      type: String,
      default: process.env.NEXT_PUBLIC_DEFAULT_BANNER,
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    birthday: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: String,
    job: String,
    expended: {
      type: Number,
      default: 0,
    },
    commission: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'fixed',
      },
      value: {
        type: String,
        default: '0',
      },
    },

    // refs
    courses: [
      {
        course: {
          type: Schema.Types.ObjectId,
          ref: 'course',
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    ],
    gifts: [
      {
        course: {
          type: Schema.Types.ObjectId,
          ref: 'course',
        },
        giver: {
          type: String,
        },
      },
    ],
    notifications: [
      {
        _id: {
          type: String,
          required: true,
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
          ],
          default: 'unset',
        },
        status: {
          type: String,
          enum: ['read', 'unread'],
          default: 'unread',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // settings
    notificationSettings: {
      newLesson: {
        type: Boolean,
        default: true,
      },
      repliedComment: {
        type: Boolean,
        default: true,
      },
      emotionComment: {
        type: Boolean,
        default: true,
      },
    },
    blockStatuses: {
      blockedComment: {
        type: Boolean,
        default: false,
      },
    },

    // package
    package: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  console.log('- Pre Save User -')
  // check authType & username before saving
  if (this.authType !== 'local' || !this.isModified('password')) {
    return next()
  }

  // hash password before saving
  try {
    const hashedPassword = await bcrypt.hash(this.password || '', +process.env.BCRYPT_SALT_ROUND! || 10)
    this.password = hashedPassword

    next()
  } catch (err: any) {
    return next(err)
  }
})

const UserModel = mongoose.models.user || mongoose.model('user', UserSchema)
export default UserModel

export interface IUser {
  _id: string
  username: string
  nickname: string
  email: string
  phone: string
  bio: string
  verifiedEmail: boolean
  verifiedPhone: boolean
  password: string
  authType: string
  role: string
  avatar: string
  banner: string
  firstName: string
  lastName: string
  birthday: string
  address: string
  gender: string
  job: string
  expended: number
  commission: { type: string; value: string }
  courses: { course: ICourse; progress: number }[]
  gifts: string[] | ICourse[]
  notificationSettings: {
    newLesson: boolean
    repliedComment: boolean
    emotionComment: boolean
  }
  blockStatuses: {
    blockedComment: boolean
  }
  package: any
  createdAt: string
  updatedAt: string

  // Subs
  vouchers?: IVoucher[]
}
