function Background() {
  return (
    <div className='fixed -z-10 top-0 left-0 bottom-0 right-0 w-screen h-screen flex items-center justify-center bg-gradient-radial from-blue-950 to-slate-950'>
      <div
        className='w-full h-full bg-center bg-no-repeat bg-cover blur-md'
        style={{
          backgroundImage: `url(${'/images/wave.png'})`,
        }}
      />
    </div>
  )
}

export default Background
