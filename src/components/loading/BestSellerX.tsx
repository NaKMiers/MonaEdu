import Divider from '../Divider'
import HeadingX from '../loading/HeadingX'

function BestSellerX() {
  return (
    <div className='max-w-1200 mx-auto px-21'>
      <div className='flex items-center justify-center'>
        <div className='max-w-full h-[90px] w-[200px] bg-slate-500 animate-pulse rounded-lg' />
      </div>

      <Divider size={12} />

      <HeadingX />

      <Divider size={16} />

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-21'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div className='' key={index}>
            <div className='w-full aspect-video rounded-lg shadow-lg bg-slate-700 animate-pulse' />
            <div className='w-full  rounded-lg shadow-lg bg-slate-200 px-21 py-4'>
              <div className='h-4 w-2/3 mb-1 bg-slate-700 animate-pulse rounded-md' />
              <div className='h-7 w-full bg-slate-700 animate-pulse rounded-md' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestSellerX
