import PackageItemX from './PackageItemX'

function SubscriptionsX({ className = '' }: { className?: string }) {
  return (
    <div className={`max-w-1200 w-full mx-auto text-light ${className}`}>
      <div className='flex flex-col gap-10'>
        {[
          [0, 1, 2],
          [0, 1, 2],
          [0, 1],
        ].map((pG, index) => (
          <div className='inline-block mx-auto' key={index}>
            <div className='px-21 py-2 bg-slate-300 animate-pulse rounded-t-md flex items-center justify-center h-11'>
              <div className='w-28 h-3 bg-slate-800 animate-pulse rounded-lg' />
            </div>

            <div className='flex flex-wrap justify-between'>
              {pG.map((_, index) => (
                <PackageItemX className={pG.length === 2 ? '!w-1/2' : ''} key={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionsX
