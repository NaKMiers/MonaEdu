function CommentItemX() {
  return (
    <div className="flex w-full items-start gap-3">
      {/* Avatar */}
      <div className="aspect-square h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-slate-700" />

      <div className="w-full">
        {/* MARK: Headline */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <div className="h-5 w-[150px] max-w-full animate-pulse rounded-md bg-slate-500" />
          <div className="h-5 w-[150px] max-w-full animate-pulse rounded-md bg-slate-300" />
        </div>

        {/* MARK: Content */}
        <div className="mt-2 flex flex-col gap-1">
          <div className="h-5 w-[170px] max-w-full animate-pulse rounded-md bg-slate-500" />
          <div className="h-5 w-[500px] max-w-full animate-pulse rounded-md bg-slate-500" />
        </div>

        {/* MARK: Actions */}
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
            <div className="h-5 w-5 animate-pulse rounded-md bg-slate-300" />
          </div>

          <div className="mb-1 h-5 w-[100px] max-w-full animate-pulse rounded-md bg-slate-500" />
        </div>
      </div>
    </div>
  )
}

export default CommentItemX
