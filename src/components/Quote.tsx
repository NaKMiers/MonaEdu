import Image from 'next/image'
import Slider from './Slider'

function Quote() {
  return (
    <div className='max-w-1200 mx-auto flex justify-center px-21'>
      <Slider time={10000}>
        <div className='w-full rounded-lg shadow-lg overflow-hidden'>
          <Image
            src='/images/quote-1.jpg'
            className='w-full h-full object-contain'
            width={1280}
            height={720}
            loading='lazy'
            alt='quote'
          />
        </div>
        <div className='w-full rounded-lg shadow-lg overflow-hidden'>
          <Image
            src='/images/quote-2.jpg'
            className='w-full h-full object-contain'
            width={1280}
            height={720}
            loading='lazy'
            alt='quote'
          />
        </div>
      </Slider>
    </div>
  )
}

export default Quote
