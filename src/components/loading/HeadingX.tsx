interface HeadingXProps {
  align?: 'left' | 'center' | 'right'
}

function HeadingX({ align = 'center' }: HeadingXProps) {
  return (
    <div className='relative max-w-1200 mx-auto animate-pulse h-0.5 bg-slate-700 rounded-lg w-full'>
      <span
        className={`absolute top-1/2 ${
          align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
        } -translate-y-1/2 max-w-full w-[200px] h-9 rounded-lg bg-slate-700`}
      />
    </div>
  )
}

export default HeadingX
