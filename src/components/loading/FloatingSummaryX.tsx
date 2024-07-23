import Divider from '../Divider'

function FloatingSummaryX({ className = '' }: { className?: string }) {
  return (
    <div className={`px-4 max-h-[calc(100vh-100px)] overflow-y-auto ${className}`}>
      {/* Thumbnails */}
      <div className='aspect-video -mx-4 rounded-lg bg-slate-300 animate-pulse' />

      <Divider size={4} />

      <div className='overflow-y-auto h-full'>
        {/* Price */}
        <div className='w-full h-9 bg-slate-500 rounded-md animate-pulse' />

        <Divider size={4} />

        {/* Action Buttons */}
        <div className='flex items-center gap-1 w-full'>
          <div className='h-[42px] flex w-full items-center justify-center rounded-lg px-2 bg-slate-500 animate-pulse' />
          <div className='group h-[42px] w-[48px] flex items-center justify-center rounded-lg bg-slate-500 animate-pulse' />
        </div>

        <Divider size={4} />

        {/* Like & Share */}
        <div className='flex h-[28px]'>
          <div className='flex justify-center items-center w-full border-r-2 border-slate-300'>
            <button className='flex items-center justify-center gap-1 -mb-1'>
              <div className='rounded-md w-12 h-5 bg-slate-300 animate-pulse' />{' '}
              <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
            </button>
          </div>

          <div className='flex justify-center items-center w-full'>
            <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
          </div>
        </div>

        <Divider size={5} border />

        {/* Tags */}
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1 mb-1'>
          <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
          <div className='rounded-md w-[75px] h-5 bg-slate-300 animate-pulse' />
          <div className='rounded-md w-[75px] h-5 bg-slate-300 animate-pulse' />
          <div className='rounded-md w-[75px] h-5 bg-slate-300 animate-pulse' />
          <div className='rounded-md w-[75px] h-5 bg-slate-300 animate-pulse' />
        </div>

        <Divider size={5} border />

        <div className=''>
          <div className='h-5 my-0.5 max-w-[200px] w-full rounded-md bg-slate-500 animate-pulse' />

          <Divider size={3} />

          <div className='flex items-center flex-wrap gap-2 mb-1'>
            <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
            <div className='rounded-md w-[80px] h-5 bg-slate-300 animate-pulse' />
            <div className='rounded-md w-[80px] h-5 bg-slate-300 animate-pulse' />
          </div>
          <div className='flex items-center flex-wrap gap-2 mb-1'>
            <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
            <div className='rounded-md w-[80px] h-5 bg-slate-300 animate-pulse' />
          </div>
          <div className='flex items-center flex-wrap gap-2 mb-1'>
            <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
            <div className='rounded-md max-w-full w-[200px] h-5 bg-slate-300 animate-pulse' />
          </div>
        </div>

        <Divider size={8} />
      </div>
    </div>
  )
}

export default FloatingSummaryX
