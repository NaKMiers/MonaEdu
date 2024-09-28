import Divider from '../Divider'
import HeadingX from '../loading/HeadingX'

function BestSellerX() {
  return (
    <div className="mx-auto max-w-1200 px-21">
      <div className="flex items-center justify-center">
        <div className="h-[90px] w-[200px] max-w-full animate-pulse rounded-lg bg-slate-500" />
      </div>

      <Divider size={12} />

      <HeadingX />

      <Divider size={16} />

      <div className="grid grid-cols-2 gap-21 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            className=""
            key={index}
          >
            <div className="aspect-video w-full animate-pulse rounded-lg bg-slate-700" />
            <div className="w-full rounded-lg bg-slate-200 px-21 py-4">
              <div className="mb-1 h-4 w-2/3 animate-pulse rounded-md bg-slate-700" />
              <div className="h-7 w-full animate-pulse rounded-md bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestSellerX
