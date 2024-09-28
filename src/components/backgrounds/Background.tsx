import Image from 'next/image'
import { memo } from 'react'

function Background() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 -z-10 flex h-screen w-screen items-center justify-center bg-gradient-radial from-blue-950 to-neutral-950">
      <div className="absolute left-[-25%] top-[-55%] hidden w-[70%] lg:block">
        <Image
          className="h-full w-full object-contain object-left-top opacity-20"
          src="/backgrounds/glow-1.png"
          width={1000}
          height={1000}
          alt="Mona-Edu-Glow-1"
        />
      </div>

      <div className="absolute bottom-[-90%] left-[-20%] hidden w-[75%] lg:block">
        <Image
          className="h-full w-full object-contain object-left-top opacity-10"
          src="/backgrounds/glow-2.png"
          width={1000}
          height={1000}
          alt="Mona-Edu-Glow-2"
        />
      </div>

      <div className="absolute right-[-30%] top-[-60%] hidden w-[80%] lg:block">
        <Image
          className="h-full w-full object-contain object-left-top opacity-10"
          src="/backgrounds/glow-3.png"
          width={1000}
          height={1000}
          alt="Mona-Edu-Glow-3"
        />
      </div>

      <div className="relative flex h-[50rem] w-full items-center justify-center bg-grid-white/[0.05]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/[0.3] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
          Mona Edu
        </p>
      </div>
    </div>
  )
}

export default memo(Background)
