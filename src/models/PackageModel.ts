import mongoose from 'mongoose'
import { IFlashSale } from './FlashSaleModel'
const Schema = mongoose.Schema

const PackageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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
    description: {
      type: String,
    },
    flashSale: {
      type: Schema.Types.ObjectId,
      ref: 'flashSale',
    },
    packageGroup: {
      type: Schema.Types.ObjectId,
      ref: 'packageGroup',
    },
    joined: {
      type: Number,
      default: 0,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

// create model from schema
const PackageModel = mongoose.models.package || mongoose.model('package', PackageSchema)
export default PackageModel

export interface IPackage {
  _id: string
  title: string
  oldPrice: number
  price: number
  description: string
  flashSale: string | IFlashSale
  packageGroup: string
  joined: number
  active: boolean
  features: string[]
  createdAt: string
  updatedAt: string
}
