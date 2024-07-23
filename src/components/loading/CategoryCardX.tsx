function CategoryCardX() {
  return (
    <div className={`relative overflow-hidden aspect-square w-full rounded-xl`}>
      <div className='w-full h-full animate-pulse bg-slate-300' />
      <div className='absolute z-20 bottom-0 left-0 right-0 bg-slate-700 w-full p-2'>
        <div className='h-[26px] w-full mb-1 rounded-md animate-pulse bg-slate-300' />
        <div className='h-[26px] w-full rounded-md animate-pulse bg-slate-300' />
      </div>
    </div>
  )
}

export default CategoryCardX
