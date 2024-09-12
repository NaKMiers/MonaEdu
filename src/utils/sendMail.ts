import NotifyOrderEmail from '@/components/email/NotifyOrderEmail'
import OrderEmail from '@/components/email/OrderEmail'
import ResetPasswordEmail from '@/components/email/ResetPasswordEmail'
import SummaryEmail from '@/components/email/SummaryEmail'
import VerifyEmailEmail from '@/components/email/VerifyEmailEmail'
import UserModel from '@/models/UserModel'
import { render } from '@react-email/render'
import nodeMailer from 'nodemailer'
import GivenGiftEmail from '@/components/email/GivenGiftEmail'
import { formatPrice } from './number'

// Models: User
import '@/models/UserModel'
import NotifyExpiredPackageEmail from '@/components/email/NotifyExpiredPackageEmail'

// SEND MAIL CORE
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
})

// Send Mail Core
export async function sendMail(to: string | string[], subject: string, html: string) {
  console.log('- Send Mail -')

  await transporter.sendMail({
    from: 'Mona Edu <no-reply@monaedu.com>',
    to: to,
    subject: subject,
    html: html,
  })
}

// send order notification to admin
export async function notifyNewOrderToAdmin(newOrder: any) {
  console.log('- Notify New Order To Admin -')

  try {
    // get admin and editor mails
    const admins: any[] = await UserModel.find({
      role: { $in: ['admin', 'editor'] },
    }).lean()
    let emails: string[] = [...admins.map(admin => admin.email), process.env.NEXT_PUBLIC_MAIL]

    const html = render(NotifyOrderEmail({ order: newOrder }))
    await sendMail(
      emails,
      `${newOrder.isPackage ? 'Package -' : ''} ${newOrder.code} - ${formatPrice(newOrder.total)} - ${
        newOrder.paymentMethod
      }`,
      html
    )
  } catch (err: any) {
    console.log(err)
  }
}

// deliver notification
export async function notifyDeliveryOrder(email: string, orderData: any) {
  console.log('- Notify Delivery Order -')

  try {
    const html = render(OrderEmail({ order: orderData }))
    await sendMail(email, 'Bạn có đơn hàng từ Mona Edu', html)
  } catch (err: any) {
    console.log(err)
  }
}

// given course notification
export async function notifyGivenCourse(receiveEmail: string, sender: string, orderData: any) {
  console.log('- Notify Given Course To Receiver -')

  try {
    const html = render(GivenGiftEmail({ order: { ...orderData, sender } }))
    await sendMail(receiveEmail, `Bạn được tặng khóa học trên Mona Edu từ ${sender}`, html)
  } catch (err: any) {
    console.log(err)
  }
}

// summary notification
export async function summaryNotification(email: string, summary: any) {
  console.log('- Summary Notification -')

  try {
    // Render template
    const html = render(SummaryEmail({ summary }))
    await sendMail(email, `Báo cáo tháng ${new Date().getMonth() + 1}`, html)
  } catch (err: any) {
    console.log(err)
  }
}

// reset password email
export async function sendResetPasswordEmail(email: string, name: string, link: string) {
  console.log('- Send Reset Password Email -')

  try {
    // Render template
    const html = render(ResetPasswordEmail({ name, link }))

    await sendMail(email, 'Khôi phục mật khẩu', html)
  } catch (err: any) {
    console.log(err)
  }
}

// verify email
export async function sendVerifyEmail(email: string, name: string, link: string) {
  console.log('- Send Verify Email -')

  try {
    // Render template
    const html = render(VerifyEmailEmail({ name, link }))
    await sendMail(email, 'Xác thực Email', html)
  } catch (err: any) {
    console.log(err)
  }
}

// notify expired package
export async function notifyExpiredPackage(email: string, data: any) {
  console.log('- Notify Expired Email -')

  try {
    // Render template
    const html = render(NotifyExpiredPackageEmail({ data }))
    await sendMail(email, `Gói học viên của bạn sẽ hết hạn ${data.remainingTime} nữa 😱`, html)
  } catch (err: any) {
    console.log(err)
  }
}
