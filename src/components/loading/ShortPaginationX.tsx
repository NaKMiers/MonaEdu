function ShortPaginationX({ className = '' }: { className?: string }) {
  return (
    <div className={`flex min-h-[42px] w-full items-center gap-4 font-semibold ${className}`}>
      {/* MARK: Prev */}
      <div className="h-[42px] w-[42px] animate-pulse rounded-full bg-slate-500" />

      {/* MARK: 1 ... n */}
      <div className="flex items-center gap-1">
        <div className="h-5 w-6 animate-pulse rounded-md bg-slate-300" /> /
        <div className="h-5 w-6 animate-pulse rounded-md bg-slate-300" />
      </div>

      {/* MARK: Next */}
      <div className="h-[42px] w-[42px] animate-pulse rounded-full bg-slate-500" />
    </div>
  )
}

export default ShortPaginationX
