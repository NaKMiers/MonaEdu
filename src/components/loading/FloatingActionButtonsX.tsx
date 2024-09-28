function FloatingActionButtonsX({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed ${className}`}>
      {/* Like & Share */}
      <div className="mr-1 flex items-center gap-2 sm:mr-2.5 sm:gap-2.5">
        <button className="group flex items-center justify-center gap-1">
          <div className="h-5 w-5 animate-pulse rounded-md bg-slate-500" />
          <div className="h-5 w-5 animate-pulse rounded-full bg-slate-500" />
        </button>

        <button className="flex w-full items-center justify-center gap-1">
          <div className="h-5 w-5 animate-pulse rounded-full bg-slate-500" />
          <div className="h-5 w-[60px] animate-pulse rounded-md bg-slate-500" />
        </button>
      </div>

      {/* Price */}
      <div className="flex flex-col justify-center border-l pl-2 tracking-tighter sm:px-4">
        <div className="mb-1 h-5 w-[70px] max-w-full animate-pulse rounded-md bg-slate-700 sm:w-[100px]" />
        <div className="h-4 w-[50px] max-w-full animate-pulse rounded-md bg-slate-500 sm:w-[80px]" />
      </div>

      {/* Buy Now */}
      <div className="flex h-[42px] w-full animate-pulse items-center justify-center rounded-lg bg-slate-500 px-2" />

      {/* Add To Cart */}
      <div className="flex h-[42px] w-[48px] flex-shrink-0 animate-pulse items-center justify-center rounded-lg bg-slate-500" />
    </div>
  )
}

export default FloatingActionButtonsX
