function PaginationX() {
  return (
    <div className='flex gap-2 justify-center w-full mx-auto'>
      {/* MARK: Prev */}
      <div className='rounded-lg h-[40px] w-[60px] bg-white border-slate-200 animate-pulse' />

      {/* MARK: 1 ... n */}
      <div className='flex gap-2'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div className='h-[40px] w-12 rounded-lg bg-slate-500 animate-pulse' key={index} />
        ))}
      </div>

      {/* MARK: Next */}
      <div className='rounded-lg h-[40px] w-[60px] bg-white border-slate-200 animate-pulse' />
    </div>
  )
}

export default PaginationX
