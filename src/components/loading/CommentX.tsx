import CommentItemX from './CommentItemX'

function CommentX() {
  return (
    <div>
      {/* MARK: Input */}
      <div className="flex items-center justify-between gap-3">
        <div className="aspect-square h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-slate-700" />

        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-500" />

        <div className="h-10 w-[100px] animate-pulse rounded-lg bg-slate-700" />
      </div>

      {/* MARK: Comment List */}
      <div className="mt-5 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <CommentItemX key={index} />
        ))}
      </div>
    </div>
  )
}

export default CommentX
