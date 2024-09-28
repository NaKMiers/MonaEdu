import Divider from '../Divider'

function CourseCardX() {
  return (
    <div className="w-full">
      <div className="flex h-full flex-col rounded-xl bg-slate-500 p-2.5 md:p-4">
        <Divider size={2} />

        <div className="mb-1 h-12 w-full animate-pulse rounded-md bg-slate-700 md:mb-2" />
        <div className="mb-1 h-10 w-full animate-pulse rounded-md bg-slate-700 md:mb-2" />

        <div className="aspect-video animate-pulse rounded-lg bg-slate-300" />

        <Divider size={4} />

        <div className="flex w-full items-center gap-1">
          <div className="h-[42px] w-full animate-pulse rounded-lg bg-slate-700" />
          <div className={`flex h-[42px] w-12 animate-pulse rounded-lg bg-slate-300 px-3`} />
        </div>
      </div>
    </div>
  )
}

export default CourseCardX
