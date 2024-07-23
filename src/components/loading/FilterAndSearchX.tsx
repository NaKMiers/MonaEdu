import Divider from '../Divider'

function FilterAndSearchX() {
  return (
    <>
      {/* Desktop */}
      <div className='hidden w-full md:flex flex-col gap-3'>
        {/* Search */}
        <div className='relative w-full h-[42px] rounded-3xl bg-slate-700 animate-pulse' />

        <Divider size={2} />

        {/* Sub Categories */}
        <div>
          <div className='h-6 w-full max-w-[150px] my-0.5 rounded-md bg-slate-700 animate-pulse' />

          <Divider size={4} />

          <div className='flex flex-col gap-2.5'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div className='rounded-lg bg-slate-500 w-full h-[30px] animate-pulse' key={index} />
            ))}
          </div>
        </div>

        <Divider size={1} border />

        {/* Filter */}
        <div>
          <div className='h-6 w-full max-w-[150px] my-0.5 rounded-md bg-slate-700 animate-pulse' />

          <Divider size={4} />

          {/* Price Range */}
          <div className='w-full h-[74px] rounded-lg bg-slate-700 animate-pulse' />

          <Divider size={4} />

          {/* Time Range */}
          <div className='w-full h-[74px] rounded-lg bg-slate-700 animate-pulse' />
        </div>

        <Divider size={1} border />

        {/* Sort */}
        <div>
          <div className='h-6 w-full max-w-[150px] my-0.5 rounded-md bg-slate-700 animate-pulse' />

          <Divider size={4} />

          {/* Sort Price */}
          <div className='z-10 flex items-center gap-3 tracking-wider'>
            <div className='h-7 w-[60px] rounded-md bg-slate-700 animate-pulse' />
            <div className='h-7 w-[80px] rounded-md bg-slate-500 animate-pulse' />
          </div>

          <Divider size={4} />

          {/* Sort Time */}
          <div className='z-10 flex items-center gap-3 tracking-wider'>
            <div className='h-7 w-[60px] rounded-md bg-slate-700 animate-pulse' />
            <div className='h-7 w-[80px] rounded-md bg-slate-500 animate-pulse' />
          </div>
        </div>

        <Divider size={8} />
      </div>

      {/* Mobile */}
      <div className='md:hidden flex justify-between w-full items-center gap-3 border-b border-dark pt-3 pb-5'>
        <div className='w-full max-w-[153px] h-[34px] rounded-lg bg-slate-700 animate-pulse' />
        <div className='w-full max-w-[94px] h-[34px] rounded-lg bg-slate-700 animate-pulse' />
      </div>
    </>
  )
}

export default FilterAndSearchX
