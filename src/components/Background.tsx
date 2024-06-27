function Background() {
  return (
    <div className='fixed -z-10 top-0 left-0 bottom-0 right-0 w-screen h-screen flex items-center justify-center bg-gradient-radial from-blue-950 to-slate-950'>
      <div
        className='w-full h-full bg-repeat bg-center'
        style={{
          backgroundImage: `url(${'/images/stars.png'})`,
        }}
      />
    </div>
  )
}

export default Background
