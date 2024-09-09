import mongoose from 'mongoose'
import { IPackage } from './PackageModel'
const Schema = mongoose.Schema

const PackageGroupSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    packageAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// create model from schema
const PackageGroupModel =
  mongoose.models.packageGroup || mongoose.model('packageGroup', PackageGroupSchema)
export default PackageGroupModel

export interface IPackageGroup {
  _id: string
  title: string
  description: string
  packageAmount: number
  createdAt: string
  updatedAt: string

  // subs
  packages?: IPackage[]
}
