function QuestionItemX() {
  return (
    <div className='rounded-2xl shadow-lg bg-white'>
      {/* Top */}
      <div className='relative flex w-full gap-3 p-4 border-b-2 border-slate-300'>
        <div className='flex-shrink-0 w-[40px] h-[40px] rounded-full aspect-square overflow-hidden shadow-lg' />
        <div className='flex-1 w-full'>
          <div className='h-6 w-full max-w-[170px] mb-1 bg-slate-500 animate-pulse rounded-md' />
          <div className='h-4 max-w-full w-[80px] bg-slate-300 animate-pulse rounded-md' />
        </div>
      </div>

      {/* Center */}
      <div className='flex flex-col gap-1 px-5 py-6 border-b-2 border-slate-300 overflow-auto'>
        <div className='h-5 max-w-full w-[170px] mb-1 bg-slate-500 animate-pulse rounded-md' />
        <div className='h-5 max-w-full mb-1 bg-slate-500 animate-pulse rounded-md' />
      </div>

      {/* Bottom */}
      <div className='flex h-[50px]'>
        <div className='flex justify-center items-center border-r-2 border-slate-300 gap-1 flex-1'>
          <div className='rounded-md w-5 h-5 bg-slate-300 animate-pulse' />
          <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
        </div>

        <div className='flex justify-center items-center gap-1 flex-1'>
          <div className='rounded-md w-5 h-5 bg-slate-300 animate-pulse' />
          <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
        </div>
      </div>
    </div>
  )
}

export default QuestionItemX
