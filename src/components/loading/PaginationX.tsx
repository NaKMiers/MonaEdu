function PaginationX() {
  return (
    <div className="mx-auto flex w-full justify-center gap-2">
      {/* MARK: Prev */}
      <div className="h-[40px] w-[60px] animate-pulse rounded-lg border-slate-200 bg-slate-300" />

      {/* MARK: 1 ... n */}
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="h-[40px] w-12 animate-pulse rounded-lg bg-slate-500"
            key={index}
          />
        ))}
      </div>

      {/* MARK: Next */}
      <div className="h-[40px] w-[60px] animate-pulse rounded-lg border-slate-200 bg-slate-300" />
    </div>
  )
}

export default PaginationX
