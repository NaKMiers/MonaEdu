import Image from 'next/image'
import { memo } from 'react'
import Slider from './Slider'

function Quote() {
  return (
    <div className="mx-auto flex max-w-1200 justify-center">
      <Slider time={10000}>
        <div className="w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/images/quote-1.jpg"
            className="h-full w-full object-contain"
            width={1280}
            height={720}
            loading="lazy"
            alt="quote"
          />
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/images/quote-2.jpg"
            className="h-full w-full object-contain"
            width={1280}
            height={720}
            loading="lazy"
            alt="quote"
          />
        </div>
        {/* <div className='w-full rounded-lg shadow-lg overflow-hidden'>
          <Image
            src='/images/quote-3.jpg'
            className='w-full h-full object-contain'
            width={1280}
            height={720}
            loading='lazy'
            alt='quote'
          />
        </div> */}
      </Slider>
    </div>
  )
}

export default memo(Quote)
