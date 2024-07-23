function ShortPaginationX({ className = '' }: { className?: string }) {
  return (
    <div className={`flex font-semibold gap-4 items-center w-full min-h-[42px] ${className}`}>
      {/* MARK: Prev */}
      <div className='h-[42px] w-[42px] rounded-full bg-slate-500 animate-pulse' />

      {/* MARK: 1 ... n */}
      <div className='flex items-center gap-1'>
        <div className='h-5 w-6 rounded-md bg-slate-300 animate-pulse' /> /
        <div className='h-5 w-6 rounded-md bg-slate-300 animate-pulse' />
      </div>

      {/* MARK: Next */}
      <div className='h-[42px] w-[42px] rounded-full bg-slate-500 animate-pulse' />
    </div>
  )
}

export default ShortPaginationX
