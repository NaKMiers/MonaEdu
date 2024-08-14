import CourseModel, { ICourse } from '@/models/CourseModel'
import OrderModel, { IOrder } from '@/models/OrderModel'
import UserModel, { IUser } from '@/models/UserModel'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import { notifyDeliveryOrder, notifyGivenCourse } from './sendMail'
import NotificationModel from '@/models/NotificationModel'
import { getUserName } from './string'

// Models: Order, Voucher, User, Course, Notification
import '@/models/CourseModel'
import '@/models/OrderModel'
import '@/models/UserModel'
import '@/models/VoucherModel'
import '@/models/NotificationModel'

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
  const { items, email, total, userId, receivedUser } = order

  const buyer: IUser | null = await UserModel.findById(userId).lean()

  // buy for themselves
  if (!receivedUser) {
    console.log('- Buy For Themselves -')
    // get user to check if user has already joined course
    const userCourses: any = buyer?.courses

    const userCourseIds = userCourses.map((course: any) => course.course.toString())
    const itemIds = items.map((item: any) => item._id.toString())

    if (itemIds.some((id: string) => userCourseIds.includes(id))) {
      throw new Error('Học viên đã tham gia khóa học này')
    }
  }

  // buy as a gift
  else {
    console.log('- Buy As A Gift -')

    const receiver: IUser | null = await UserModel.findOne({
      email: receivedUser,
    }).lean()
    if (!receiver) {
      throw new Error('Receiver not found')
    }

    const userCourses: any = receiver?.courses
    const userCourseIds = userCourses.map((course: any) => course.course.toString())
    const itemIds = items.map((item: any) => item._id.toString())

    if (itemIds.some((id: string) => userCourseIds.includes(id))) {
      throw new Error('Học viên đã tham gia khóa học này')
    }
  }

  // VOUCHER
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

  // USER
  if (receivedUser) {
    // buy as a gift
    const receiver = await UserModel.findOneAndUpdate(
      { email: receivedUser },
      {
        $addToSet: {
          courses: items.map((item: any) => ({
            course: item._id,
            progress: 0,
          })),
          gifts: items.map((item: any) => ({
            course: item._id,
            giver: email,
          })),
        },
      }
    )

    // notify receiver after buying courseO
    await NotificationModel.create({
      userId: receiver._id,
      title: `Bạn đươc tặng khóa học bởi ${getUserName(buyer as IUser)}, học ngay thôi!`,
      image: '/images/logo.png',
      link: '/my-courses',
      type: 'given-course',
    })
  } else {
    // buy for themselves
    const buyer = await UserModel.findOneAndUpdate(
      { email },
      {
        $inc: { expended: total },
        $addToSet: {
          courses: items.map((item: any) => ({
            course: item._id,
            progress: 0,
          })),
        },
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

  // COURSE
  await CourseModel.updateMany(
    { _id: { $in: order.items.map((item: ICourse) => item._id) } },
    { $inc: { joined: 1 } }
  )

  // ORDER
  const updatedOrder: IOrder | null = await OrderModel.findByIdAndUpdate(
    order._id.toString(),
    {
      $set: { status: 'done' },
    },
    { new: true }
  ).lean()

  // data transferring to email
  const orderData = {
    ...updatedOrder,
    discount: updatedOrder?.discount || 0,
    message,
  }

  // EMAIL
  await notifyDeliveryOrder(email, orderData)

  // notify given course
  if (receivedUser) {
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
