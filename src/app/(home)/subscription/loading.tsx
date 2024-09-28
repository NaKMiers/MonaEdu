import Divider from '@/components/Divider'
import SubscriptionsX from '@/components/loading/SubscriptionX'

function Loading() {
  return (
    <div className="relative -my-[72px] flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white to-neutral-100 py-[72px] dark:from-neutral-950 dark:to-neutral-800">
      <Divider size={40} />

      <div className="flex w-full flex-col items-center gap-6">
        <div className="h-[70px] w-full max-w-[780px] animate-pulse rounded-xl bg-slate-300" />
        <div className="h-[70px] w-full max-w-[580px] animate-pulse rounded-xl bg-slate-300" />
      </div>

      <Divider size={40} />

      <SubscriptionsX />

      <Divider size={40} />
    </div>
  )
}

export default Loading
