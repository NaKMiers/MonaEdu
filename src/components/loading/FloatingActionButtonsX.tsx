function FloatingActionButtonsX({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed ${className}`}>
      {/* Like & Share */}
      <div className='flex items-center gap-2 sm:gap-2.5 mr-1 sm:mr-2.5'>
        <button className='flex items-center justify-center group gap-1'>
          <div className='rounded-md w-5 h-5 bg-slate-500 animate-pulse' />
          <div className='rounded-full w-5 h-5 bg-slate-500 animate-pulse' />
        </button>

        <button className='flex justify-center items-center w-full gap-1'>
          <div className='rounded-full w-5 h-5 bg-slate-500 animate-pulse' />
          <div className='rounded-md w-[60px] h-5 bg-slate-500 animate-pulse' />
        </button>
      </div>

      {/* Price */}
      <div className='flex flex-col justify-center tracking-tighter pl-2 sm:px-4 border-l'>
        <div className='h-5 max-w-full w-[70px] sm:w-[100px] mb-1 rounded-md bg-slate-700 animate-pulse' />
        <div className='h-4 max-w-full w-[50px] sm:w-[80px] rounded-md bg-slate-500 animate-pulse' />
      </div>

      {/* Buy Now */}
      <div className='h-[42px] flex w-full items-center justify-center rounded-lg px-2 bg-slate-500 animate-pulse' />

      {/* Add To Cart */}
      <div className='flex-shrink-0 h-[42px] w-[48px] flex items-center justify-center rounded-lg bg-slate-500 animate-pulse' />
    </div>
  )
}

export default FloatingActionButtonsX
