import GivenGiftEmail from '@/components/email/GivenGiftEmail'
import NotifyCommentEmail from '@/components/email/NotifyCommentEmail'
import NotifyExpiredPackageEmail from '@/components/email/NotifyExpiredPackageEmail'
import NotifyOrderEmail from '@/components/email/NotifyOrderEmail'
import OrderEmail from '@/components/email/OrderEmail'
import ResetPasswordEmail from '@/components/email/ResetPasswordEmail'
import SummaryEmail from '@/components/email/SummaryEmail'
import VerifyEmailEmail from '@/components/email/VerifyEmailEmail'

function EmailTemplatePage({ params: { type } }: { params: { type: string } }) {
  const renderComponent = () => {
    switch (type) {
      case 'order':
        return <OrderEmail />
      case 'reset-password':
        return <ResetPasswordEmail />
      case 'verify-email':
        return <VerifyEmailEmail />
      case 'notify-order':
        return <NotifyOrderEmail />
      case 'summary':
        return <SummaryEmail />
      case 'notify-comment':
        return <NotifyCommentEmail />
      case 'given-gift':
        return <GivenGiftEmail />
      case 'notify-expired-package':
        return <NotifyExpiredPackageEmail />
      default:
        return null
    }
  }

  return renderComponent()
}

export default EmailTemplatePage
