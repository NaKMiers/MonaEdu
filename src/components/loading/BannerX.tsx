function BannerX() {
  return (
    <div className='carousel mt-[-72px] relative w-full h-[calc(100vh)] overflow-hidden shadow-medium-light'>
      {/* List Items */}
      <div className='list bg-white'>
        <div className='item absolute inset-0'>
          <div className='w-full h-full animate-pulse bg-slate-500 rounded-b-medium' />
          <div className='content absolute top-[20%] md:top-[15%] left-1/2 -translate-x-1/2 max-w-[1200px] px-21 w-full drop-shadow-2xl text-white'>
            <div className='max-w-[700px] w-full'>
              <div className='author h-5 w-[150px] max-w-full my-0.5 rounded-md animate-pulse bg-slate-800' />
              <div className='title h-[50px] w-[400px] max-w-full my-3 rounded-md animate-pulse bg-slate-800' />
              <div className='title h-[68px] w-[500px] max-w-full my-0.5 rounded-md animate-pulse bg-slate-800 pr-[20%]' />

              <div className='buttons flex flex-wrap gap-1.5 mt-5'>
                <div className='h-10 w-[90px] max-w-1/2 rounded-md animate-pulse bg-slate-800' />
                <div className='h-10 w-[90px] max-w-1/2 rounded-md animate-pulse bg-slate-800' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className='thumbnails absolute bottom-[50px] left-1/2 z-10 flex gap-21 text-white'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className='item relative w-[150px] h-[220px] flex-shrink-0 overflow-hidden rounded-medium'
            key={index}
          >
            <div className='img w-full h-full object-cover animate-pull bg-slate-700' />
            <div className='content absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 px-3 py-1 text-sm rounded-t-lg text-dark'>
              <div className='title h-[18px] mb-1 w-[100px] rounded-md animate-pulse bg-slate-500' />
              <div className='title h-[18px] w-[100px] rounded-md animate-pulse bg-slate-500' />
            </div>
          </div>
        ))}
      </div>
      {/* Arrows */}
      <div className='arrows absolute bottom-[50px] left-[10%] md:left-1/3 flex gap-4'>
        <div className='prev w-12 h-12 border border-white rounded-full animate-pulse bg-slate-800' />
        <div className='next w-12 h-12 border border-white rounded-full animate-pulse bg-slate-800' />
      </div>
    </div>
  )
}

export default BannerX
