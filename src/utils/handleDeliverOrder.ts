import CourseModel, { ICourse } from '@/models/CourseModel'
import NotificationModel from '@/models/NotificationModel'
import OrderModel, { IOrder } from '@/models/OrderModel'
import PackageModel from '@/models/PackageModel'
import UserModel, { IUser } from '@/models/UserModel'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import moment from 'moment-timezone'
import { applyFlashSalePrice } from './number'
import { notifyDeliveryOrder, notifyGivenCourse } from './sendMail'
import { checkPackageType, getUserName } from './string'

// Models: Order, Voucher, User, Course, Notification, Package
import '@/models/CourseModel'
import '@/models/NotificationModel'
import '@/models/OrderModel'
import '@/models/PackageModel'
import '@/models/UserModel'
import '@/models/VoucherModel'

export default async function handleDeliverOrder(id: string, message: string = '') {
  console.log('- Handle Deliver Order -')

  // get order from database to deliver
  const order: IOrder | null = await OrderModel.findById(id)
    .populate({
      path: 'voucher',
      select: 'code',
      populate: 'owner',
    })
    .lean()

  // error state
  let orderError = {
    error: false,
    message: '',
    status: 200,
  }

  // check order exist
  if (!order) {
    throw new Error('Order not found')
  }

  // only deliver order with status is 'pending' | 'cancel'
  if (order.status === 'done') {
    throw new Error('Order is not ready to deliver')
  }

  // get items and applied voucher
  const { items, email, total, userId, receivedUser, isPackage } = order

  let buyer: IUser | null = await UserModel.findById(userId).lean()

  // check if user exists or not
  if (!buyer) {
    throw new Error('User not found')
  }

  // MARK: Buy Courses
  if (!isPackage) {
    // buy for themselves
    if (!receivedUser) {
      // get user to check if user has already joined course
      const userCourses: any = buyer?.courses

      let isJoined = false
      userCourses.forEach((course: any) => {
        items.forEach((item: any) => {
          if (
            item._id.toString() === course.course.toString() &&
            (!course.expire || course.expire === null)
          ) {
            isJoined = true
          }
        })
      })

      if (isJoined) {
        throw new Error('Tồn tại khóa học đã được học viên tham gia')
      }
    }

    // buy as a gift
    else {
      const receiver: IUser | null = await UserModel.findOne({
        email: receivedUser,
      }).lean()
      if (!receiver) {
        throw new Error('Receiver not found')
      }

      const userCourses: any = receiver?.courses

      let isJoined = false
      userCourses.forEach((course: any) => {
        items.forEach((item: any) => {
          if (
            item._id.toString() === course.course.toString() &&
            (!course.expire || course.expire === null)
          ) {
            isJoined = true
          }
        })
      })

      if (isJoined) {
        throw new Error('Học viên đã tham gia khóa học này')
      }
    }

    // MARK: VOUCHER
    const voucher: IVoucher = order.voucher as IVoucher
    if (voucher) {
      const commission: any = (voucher.owner as IUser).commission
      let extraAccumulated = 0

      switch (commission.type) {
        case 'fixed': {
          extraAccumulated = commission.value
          break
        }
        case 'percentage': {
          extraAccumulated = (order.total * parseFloat(commission.value)) / 100
          break
        }
      }

      // update voucher
      await VoucherModel.findByIdAndUpdate(voucher._id, {
        $addToSet: { usedUsers: email },
        $inc: {
          accumulated: extraAccumulated,
          timesLeft: -1,
        },
      })
    }

    // MARK: USER
    // buy as a gift
    if (receivedUser) {
      // get receiver courses
      let receiver: IUser | null = await UserModel.findOne({ email: receivedUser }).lean()

      // check if receiver exists or not
      if (!receiver) {
        throw new Error('Receiver not found')
      }

      // merge new course to old course in case that user has already joined this course
      const itemIds = items.map((course: any) => course._id.toString())
      const duplicatedCourseIds: string[] = []
      const updatedCourses = receiver?.courses.map((course: any) => {
        if (itemIds.includes(course.course.toString())) {
          // duplicate
          duplicatedCourseIds.push(course.course.toString())

          return {
            course: course.course,
            progress: course.progress,
            // expire will be exclude if exist
          }
        } else {
          // not duplicate
          return course
        }
      })

      const newCourses = items.map((course: any) => {
        if (!duplicatedCourseIds.includes(course._id.toString())) {
          return {
            course: course._id,
            progress: 0,
          }
        }
      })

      // buy as a gift
      await UserModel.updateOne(
        { email: receivedUser },
        {
          $set: { courses: [...updatedCourses, ...newCourses] },
          $addToSet: {
            gifts: items.map((item: any) => ({
              course: item._id,
              giver: email,
            })),
          },
        }
      )

      // notify receiver after buying course
      await NotificationModel.create({
        userId: receiver._id,
        title: `Bạn đươc tặng khóa học bởi ${getUserName(buyer as IUser)}, học ngay thôi!`,
        image: '/images/logo.png',
        link: '/my-courses',
        type: 'given-course',
      })
    }
    // buy for themselves
    else {
      // merge new course to old course in case that user has already joined this course
      const itemIds = items.map((course: any) => course._id.toString())
      const duplicatedCourseIds: string[] = []
      const updatedCourses = buyer?.courses.map((course: any) => {
        if (itemIds.includes(course.course.toString())) {
          // duplicate
          duplicatedCourseIds.push(course.course.toString())

          return {
            course: course.course,
            progress: course.progress,
            // expire will be exclude if exist
          }
        } else {
          // not duplicate
          return course
        }
      })

      const newCourses = items.map((course: any) => {
        if (!duplicatedCourseIds.includes(course._id.toString())) {
          return {
            course: course._id,
            progress: 0,
          }
        }
      })

      // update user courses, increase expended
      await UserModel.findOneAndUpdate(
        { email },
        {
          $inc: { expended: total },
          $set: { courses: [...updatedCourses, ...newCourses] },
        }
      )

      // notify buyer after buying course
      await NotificationModel.create({
        userId: buyer._id,
        title: 'Tham gia khóa học thành công, học ngay thôi!',
        image: '/images/logo.png',
        link: '/my-courses',
        type: 'delivered-order',
      })
    }

    // MARK: COURSE
    await CourseModel.updateMany(
      { _id: { $in: order.items.map((item: ICourse) => item._id) } },
      { $inc: { joined: 1 } }
    )
  }

  // MARK: Buy Package
  else {
    // get current package of user if exist to prevent downgrade
    const userPackage = buyer?.package

    // prevent downgrade with lifetime advanced
    if (
      checkPackageType(userPackage?.credit, userPackage?.expire) === 'lifetime' &&
      !userPackage.maxPrice
    ) {
      throw new Error('Không thể thay đổi gói học viên hiện tại của học viên')
    }

    // USER
    const { _id, title, price, joined, credit, days, maxPrice, packageGroup, flashSale } = items[0]

    const userPackageData = {
      title,
      price: flashSale ? applyFlashSalePrice(price, flashSale) : price,
      packageGroup: typeof packageGroup === 'string' ? packageGroup : packageGroup._id,
      joined,
      credit: credit || null,
      expire: days ? moment(order.createdAt).add(days, 'days').toDate() : null,
      maxPrice: maxPrice || null,
      createdAt: order.createdAt,
    }

    await Promise.all([
      // update package field of user
      UserModel.findByIdAndUpdate(userId, { $set: { package: userPackageData } }),

      // notify buyer after buying package
      NotificationModel.create({
        userId,
        title: 'Đăng ký gói học viên thành công!',
        image: '/images/logo.png',
        link: '/my-courses',
        type: 'delivered-order',
      }),

      // PACKAGE
      // increase joined of package
      PackageModel.findByIdAndUpdate(_id, { $inc: { joined: 1 } }),

      // update all user courses that joined by monthly package
      UserModel.findByIdAndUpdate(userId, {
        $set: {
          courses: buyer?.courses.map((course: any) =>
            course.expire &&
            course.expire !== null &&
            checkPackageType(userPackageData.credit, userPackageData.expire) === 'monthly'
              ? {
                  ...course,
                  expire: userPackageData.expire, // update new expire date when course buy monthly package again
                }
              : course
          ),
        },
      }),
    ])
  }

  // MARK: ORDER
  const updatedOrder: IOrder | null = await OrderModel.findByIdAndUpdate(
    order._id.toString(),
    { $set: { status: 'done' } },
    { new: true }
  ).lean()

  // data transferring to email
  const orderData = {
    ...updatedOrder,
    discount: updatedOrder?.discount || 0,
    message,
  }

  // EMAIL
  // notify delivery order
  await notifyDeliveryOrder(email, orderData)

  // notify given course
  if (receivedUser && !isPackage) {
    await notifyGivenCourse(
      receivedUser,
      `${
        buyer?.firstName && buyer?.lastName ? `${buyer.firstName} ${buyer.lastName}` : buyer?.username
      }`,
      orderData
    )
  }

  return {
    order,
    isError: orderError.error,
    message: `Deliver Order Successfully`,
    status: 200,
  }
}
