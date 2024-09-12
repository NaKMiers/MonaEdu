import Divider from '@/components/Divider'
import SubscriptionsX from '@/components/loading/SubscriptionX'

function Loading() {
  return (
    <div className='-my-[72px] py-[72px] flex-col min-h-screen bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800 relative flex items-center w-full justify-center overflow-hidden'>
      <Divider size={40} />

      <div className='flex flex-col gap-6 items-center w-full'>
        <div className='w-full max-w-[780px] h-[70px] rounded-xl animate-pulse bg-slate-300' />
        <div className='w-full max-w-[580px] h-[70px] rounded-xl animate-pulse bg-slate-300' />
      </div>

      <Divider size={40} />

      <SubscriptionsX />

      <Divider size={40} />
    </div>
  )
}

export default Loading
