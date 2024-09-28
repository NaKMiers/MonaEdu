function BannerX() {
  return (
    <div className="carousel relative mt-[-72px] h-[calc(100vh)] w-full overflow-hidden">
      {/* List Items */}
      <div className="list bg-white">
        <div className="item absolute inset-0">
          <div className="h-full w-full animate-pulse rounded-b-medium bg-slate-500" />
          <div className="content absolute left-1/2 top-[20%] w-full max-w-[1200px] -translate-x-1/2 px-21 md:top-[15%]">
            <div className="w-full max-w-[700px]">
              <div className="author my-0.5 h-5 w-[150px] max-w-full animate-pulse rounded-md bg-slate-800" />
              <div className="title my-3 h-[50px] w-[400px] max-w-full animate-pulse rounded-md bg-slate-800" />
              <div className="title my-0.5 h-[68px] w-[500px] max-w-full animate-pulse rounded-md bg-slate-800 pr-[20%]" />

              <div className="buttons mt-5 flex flex-wrap gap-1.5">
                <div className="max-w-1/2 h-10 w-[90px] animate-pulse rounded-md bg-slate-800" />
                <div className="max-w-1/2 h-10 w-[90px] animate-pulse rounded-md bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="thumbnails absolute bottom-[50px] left-1/2 z-10 flex gap-21">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="item relative h-[220px] w-[150px] flex-shrink-0 overflow-hidden rounded-medium"
            key={index}
          >
            <div className="img animate-pull h-full w-full bg-slate-700 object-cover" />
            <div className="content absolute bottom-0 left-0 right-0 rounded-t-lg bg-white bg-opacity-80 px-3 py-1">
              <div className="title mb-1 h-[18px] w-[100px] animate-pulse rounded-md bg-slate-500" />
              <div className="title h-[18px] w-[100px] animate-pulse rounded-md bg-slate-500" />
            </div>
          </div>
        ))}
      </div>
      {/* Arrows */}
      <div className="arrows absolute bottom-[50px] left-[10%] flex gap-4 md:left-1/3">
        <div className="prev h-12 w-12 animate-pulse rounded-full border border-light bg-slate-800" />
        <div className="next h-12 w-12 animate-pulse rounded-full border border-light bg-slate-800" />
      </div>
    </div>
  )
}

export default BannerX
