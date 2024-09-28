import Divider from '../Divider'

function FilterAndSearchX({ subs = true }: { subs?: boolean }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden w-full flex-col gap-3 md:flex">
        {/* Search */}
        <div className="relative h-[42px] w-full animate-pulse rounded-3xl bg-slate-700" />

        {/* Sub Categories */}
        {subs && (
          <div>
            <div className="my-0.5 mt-2 h-6 w-full max-w-[150px] animate-pulse rounded-md bg-slate-700" />

            <Divider size={4} />

            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="h-[30px] w-full animate-pulse rounded-lg bg-slate-500"
                  key={index}
                />
              ))}
            </div>
          </div>
        )}

        <Divider
          size={1}
          border
        />

        {/* Filter */}
        <div>
          <div className="my-0.5 h-6 w-full max-w-[150px] animate-pulse rounded-md bg-slate-700" />

          <Divider size={4} />

          {/* Price Range */}
          <div className="h-[74px] w-full animate-pulse rounded-lg bg-slate-700" />

          <Divider size={4} />

          {/* Time Range */}
          <div className="h-[74px] w-full animate-pulse rounded-lg bg-slate-700" />
        </div>

        <Divider
          size={1}
          border
        />

        {/* Sort */}
        <div>
          <div className="my-0.5 h-6 w-full max-w-[150px] animate-pulse rounded-md bg-slate-700" />

          <Divider size={4} />

          {/* Sort Price */}
          <div className="z-10 flex items-center gap-3 tracking-wider">
            <div className="h-7 w-[60px] animate-pulse rounded-md bg-slate-700" />
            <div className="h-7 w-[80px] animate-pulse rounded-md bg-slate-500" />
          </div>

          <Divider size={4} />

          {/* Sort Time */}
          <div className="z-10 flex items-center gap-3 tracking-wider">
            <div className="h-7 w-[60px] animate-pulse rounded-md bg-slate-700" />
            <div className="h-7 w-[80px] animate-pulse rounded-md bg-slate-500" />
          </div>
        </div>

        <Divider size={8} />
      </div>

      {/* Mobile */}
      <div className="flex w-full items-center justify-between gap-3 border-b border-dark pb-5 pt-3 md:hidden">
        <div className="h-[34px] w-full max-w-[153px] animate-pulse rounded-lg bg-slate-700" />
        <div className="h-[34px] w-full max-w-[94px] animate-pulse rounded-lg bg-slate-700" />
      </div>
    </>
  )
}

export default FilterAndSearchX
