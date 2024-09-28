import Divider from '../Divider'

function FloatingSummaryX({ className = '' }: { className?: string }) {
  return (
    <div className={`max-h-[calc(100vh-100px)] overflow-y-auto px-4 ${className}`}>
      {/* Thumbnails */}
      <div className="-mx-4 aspect-video animate-pulse rounded-lg bg-slate-300" />

      <Divider size={4} />

      <div className="h-full overflow-y-auto">
        {/* Price */}
        <div className="h-9 w-full animate-pulse rounded-md bg-slate-500" />

        <Divider size={4} />

        {/* Action Buttons */}
        <div className="flex w-full items-center gap-1">
          <div className="flex h-[42px] w-full animate-pulse items-center justify-center rounded-lg bg-slate-500 px-2" />
          <div className="group flex h-[42px] w-[48px] animate-pulse items-center justify-center rounded-lg bg-slate-500" />
        </div>

        <Divider size={4} />

        {/* Like & Share */}
        <div className="flex h-[28px]">
          <div className="flex w-full items-center justify-center border-r-2 border-slate-300">
            <button className="-mb-1 flex items-center justify-center gap-1">
              <div className="h-5 w-12 animate-pulse rounded-md bg-slate-300" />{' '}
              <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
            </button>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
          </div>
        </div>

        <Divider
          size={5}
          border
        />

        {/* Tags */}
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
          <div className="h-5 w-[75px] animate-pulse rounded-md bg-slate-300" />
          <div className="h-5 w-[75px] animate-pulse rounded-md bg-slate-300" />
          <div className="h-5 w-[75px] animate-pulse rounded-md bg-slate-300" />
          <div className="h-5 w-[75px] animate-pulse rounded-md bg-slate-300" />
        </div>

        <Divider
          size={5}
          border
        />

        <div className="">
          <div className="my-0.5 h-5 w-full max-w-[200px] animate-pulse rounded-md bg-slate-500" />

          <Divider size={3} />

          <div className="mb-1 flex flex-wrap items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
            <div className="h-5 w-[80px] animate-pulse rounded-md bg-slate-300" />
            <div className="h-5 w-[80px] animate-pulse rounded-md bg-slate-300" />
          </div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
            <div className="h-5 w-[80px] animate-pulse rounded-md bg-slate-300" />
          </div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-300" />
            <div className="h-5 w-[200px] max-w-full animate-pulse rounded-md bg-slate-300" />
          </div>
        </div>

        <Divider size={8} />
      </div>
    </div>
  )
}

export default FloatingSummaryX
