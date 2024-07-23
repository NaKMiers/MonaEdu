import CommentItemX from './CommentItemX'

function CommentX() {
  return (
    <div>
      {/* MARK: Input */}
      <div className='flex items-center justify-between gap-3'>
        <div className='rounded-full h-10 w-10 flex-shrink-0 aspect-square bg-slate-700 animate-pulse' />

        <div className='w-full h-10 rounded-lg bg-slate-500 animate-pulse' />

        <div className='h-10 w-[100px] rounded-lg bg-slate-700 animate-pulse' />
      </div>

      {/* MARK: Comment List */}
      <div className='flex flex-col mt-5 gap-3'>
        {Array.from({ length: 4 }).map((_, index) => (
          <CommentItemX key={index} />
        ))}
      </div>
    </div>
  )
}

export default CommentX
