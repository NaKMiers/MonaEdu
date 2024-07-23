function CommentItemX() {
  return (
    <div className='w-full flex items-start gap-3'>
      {/* Avatar */}
      <div className='rounded-full h-10 w-10 flex-shrink-0 aspect-square bg-slate-700 animate-pulse' />

      <div className='w-full'>
        {/* MARK: Headline */}
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
          <div className='max-w-full w-[150px] h-5 rounded-md bg-slate-500 animate-pulse' />
          <div className='max-w-full w-[150px] h-5 rounded-md bg-slate-300 animate-pulse' />
        </div>

        {/* MARK: Content */}
        <div className='flex flex-col gap-1 mt-2'>
          <div className='h-5 max-w-full w-[170px] bg-slate-500 animate-pulse rounded-md' />
          <div className='h-5 max-w-full w-[500px] bg-slate-500 animate-pulse rounded-md' />
        </div>

        {/* MARK: Actions */}
        <div className='flex items-center gap-3 mt-2'>
          <div className='flex items-center gap-1'>
            <div className='rounded-full w-5 h-5 bg-slate-300 animate-pulse' />
            <div className='rounded-md w-5 h-5 bg-slate-300 animate-pulse' />
          </div>

          <div className='h-5 max-w-full w-[100px] mb-1 bg-slate-500 animate-pulse rounded-md' />
        </div>
      </div>
    </div>
  )
}

export default CommentItemX
