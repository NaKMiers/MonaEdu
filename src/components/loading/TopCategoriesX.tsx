import Divider from '../Divider'
import HeadingX from '../loading/HeadingX'

function TopCategoriesX() {
  return (
    <div className='max-w-1200 mx-auto px-21'>
      <HeadingX />

      <Divider size={16} />

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-21 sm:gap-8'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div className={`relative overflow-hidden aspect-square w-full rounded-xl`} key={index}>
            <div className='w-full h-full animate-pulse bg-slate-300' />
            <div className='absolute z-20 bottom-0 left-0 right-0 bg-slate-700 w-full p-2'>
              <div className='h-[26px] w-full mb-1 rounded-md animate-pulse bg-slate-300' />
              <div className='h-[26px] w-full rounded-md animate-pulse bg-slate-300' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopCategoriesX
