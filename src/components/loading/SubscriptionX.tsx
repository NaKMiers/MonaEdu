import PackageItemX from './PackageItemX'

function SubscriptionsX({ className = '' }: { className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-1200 text-light ${className}`}>
      <div className="flex flex-col gap-10">
        {[
          [0, 1, 2],
          [0, 1, 2],
          [0, 1],
        ].map((pG, index) => (
          <div
            className="mx-auto inline-block"
            key={index}
          >
            <div className="flex h-11 animate-pulse items-center justify-center rounded-t-md bg-slate-300 px-21 py-2">
              <div className="h-3 w-28 animate-pulse rounded-lg bg-slate-800" />
            </div>

            <div className="flex flex-wrap justify-between">
              {pG.map((_, index) => (
                <PackageItemX
                  className={pG.length === 2 ? '!w-1/2' : ''}
                  key={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionsX
