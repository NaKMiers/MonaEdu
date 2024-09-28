interface HeadingXProps {
  align?: 'left' | 'center' | 'right'
}

function HeadingX({ align = 'center' }: HeadingXProps) {
  return (
    <div className="relative mx-auto h-0.5 w-full max-w-1200 animate-pulse rounded-lg bg-slate-700">
      <span
        className={`absolute top-1/2 ${
          align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
        } h-9 w-[200px] max-w-full -translate-y-1/2 rounded-lg bg-slate-700`}
      />
    </div>
  )
}

export default HeadingX
