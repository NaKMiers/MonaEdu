function CategoryCardX() {
  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-xl`}>
      <div className="h-full w-full animate-pulse bg-slate-300" />
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full bg-slate-700 p-2">
        <div className="mb-1 h-[26px] w-full animate-pulse rounded-md bg-slate-300" />
        <div className="h-[26px] w-full animate-pulse rounded-md bg-slate-300" />
      </div>
    </div>
  )
}

export default CategoryCardX
