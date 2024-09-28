import Divider from '@/components/Divider'

function PackageItemX({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-1/2 md:w-1/3 xl:min-w-[400px] ${className}`}>
      <div className="flex min-h-[500px] w-full flex-col overflow-hidden rounded-none border bg-neutral-950 p-[40px] max-sm:p-21">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-300" />

        <div className="relative z-20 mt-4 text-neutral-200">
          <ul className="mt-2 flex list-none flex-col gap-[14px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <li
                className="flex items-center gap-2"
                key={index}
              >
                <div className="h-3 w-3 animate-pulse rounded-md bg-slate-300" />
                <div className="h-5 w-full animate-pulse rounded-md bg-slate-300" />
              </li>
            ))}
          </ul>
        </div>

        <Divider
          className="relative z-20"
          size={3}
          border
        />

        <div className="flex items-center gap-2">
          <div className="h-2.5 w-20 animate-pulse rounded-lg bg-slate-300" />
          <div className="h-2.5 w-20 animate-pulse rounded-lg bg-slate-300" />
        </div>

        <div className="flex flex-1 items-end py-21">
          <button className="flex min-h-10 w-full animate-pulse items-center justify-between rounded-3xl border border-neutral-700 bg-neutral-900 px-4 py-1">
            <div className="h-2.5 w-32 animate-pulse rounded-lg bg-slate-300" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PackageItemX
