import Divider from '@/components/Divider'
import CommentX from '@/components/loading/CommentX'

async function Loading() {
  return (
    <div className='max-w-1200 mx-auto px-21'>
      <Divider size={10} />

      <div className='rounded-xl bg-white py-4'>
        {/* Question */}
        <div className='w-full px-21'>
          {/* User Info */}
          <div className='relative flex w-full gap-3 p-4'>
            <div className='flex-shrink-0 w-[40px] h-[40px] rounded-full aspect-square bg-slate-300 animate-pulse' />
            <div className='flex-1 w-full'>
              <div className='h-5 w-full max-w-[170px] mb-1 bg-slate-500 animate-pulse rounded-md' />
              <div className='h-4 max-w-full w-[80px] bg-slate-300 animate-pulse rounded-md' />
            </div>
          </div>

          <Divider size={0} border />

          <div className='flex flex-col gap-1 px-5 py-6 overflow-auto'>
            <div className='h-5 max-w-full w-[170px] mb-1 bg-slate-500 animate-pulse rounded-md' />
            <div className='h-5 max-w-full mb-1 bg-slate-500 animate-pulse rounded-md' />
          </div>

          <Divider size={0} border />

          {/* Bottom of question */}
          <div className='flex h-[50px] gap-4'>
            <div className='flex justify-center items-center gap-1'>
              <div className='rounded-md w-5 h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
            </div>

            <div className='flex justify-center items-center gap-1'>
              <div className='rounded-md w-5 h-5 bg-slate-300 animate-pulse' />
              <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
            </div>
          </div>
        </div>

        <Divider size={6} />

        {/* Comments */}
        <div className='px-21 pb-21'>
          <CommentX />
        </div>
      </div>

      <Divider size={28} />
    </div>
  )
}

export default Loading
