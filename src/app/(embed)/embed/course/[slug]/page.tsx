import Divider from '@/components/Divider'
import { CardBody, CardContainer, CardItem } from '@/components/effects/3dCard'
import Price from '@/components/Price'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { getEmbedCourseApi } from '@/requests/embedRequest'
import { applyFlashSalePrice, countPercent } from '@/utils/number'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function EmbedPage({ params: { slug } }: { params: { slug: string } }) {
  let course: ICourse | null = null

  try {
    const data = await getEmbedCourseApi(slug, { next: { revalidate: 60 } })
    console.log('data:', data)
    course = data.course
  } catch (err: any) {
    notFound()
  }

  if (!course) {
    return
  }

  return (
    <div className='p-5 overflow-hidden no-scrollbar rounded-xl border-2 border-neutral-800'>
      <CardContainer>
        <CardBody className='flex flex-col bg-neutral-800 relative group/card border-black/[0.1] h-full rounded-xl p-2.5 md:p-4 border'>
          {course.oldPrice && (
            <CardItem
              translateZ='35'
              className='absolute top-1 right-1 rounded-tr-lg rounded-bl-lg bg-yellow-400 px-1 py-0.5 text-dark font-semibold font-body text-center text-[12px] leading-4'
            >
              Giảm{' '}
              {countPercent(
                applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
                course.oldPrice
              )}
            </CardItem>
          )}

          <Divider size={2} />

          <CardItem translateZ={50} className='text-xl font-bold text-neutral-600 dark:text-light'>
            <Link
              href={`/${course.slug}`}
              prefetch={false}
              className='font-body text-[14px] md:text-[21px] tracking-wider leading-[20px] md:leading-[28px] mb-1 md:mb-2 text-ellipsis line-clamp-2'
              title={course.title}
            >
              {course.title}
            </Link>
          </CardItem>

          <CardItem
            as='p'
            translateZ={30}
            className='text-ellipsis line-clamp-2 text-xs md:text-sm mb-2 text-neutral-300'
            title={course.textHook}
          >
            {course.textHook}
          </CardItem>

          <CardItem translateZ={80} className='w-full'>
            <Link
              href={`/${course.slug}`}
              prefetch={false}
              className='relative aspect-video rounded-lg overflow-hidden shadow-lg block group'
            >
              <div className='flex w-full overflow-x-scroll snap-x snap-mandatory hover:scale-105 trans-500'>
                {course.images.map(src => (
                  <Image
                    className='flex-shrink-0 snap-start w-full h-full object-cover'
                    src={src}
                    width={320}
                    height={320}
                    alt={course.title}
                    loading='lazy'
                    key={src}
                  />
                ))}
              </div>
            </Link>
          </CardItem>

          <Divider size={2} />

          <CardItem
            translateZ={40}
            rotateZ={-5}
            className='w-full text-xl font-bold text-neutral-600 dark:text-light'
          >
            <Price
              price={course.price}
              oldPrice={course.oldPrice}
              flashSale={course.flashSale as IFlashSale}
              className='border-2'
            />
          </CardItem>

          <Divider size={4} />

          <div className='flex flex-1 items-end justify-between'>
            <CardItem translateZ={80} className='flex items-center gap-1 w-full'>
              {/* Buy Now Button */}
              <Link
                href={`/checkout/${course.slug}`}
                prefetch={false}
                className='relative font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-light border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1 px-2 overflow-hidden'
              >
                <p className='relative z-10 flex items-center gap-1 text-sm sm:text-base text-ellipsis text-nowrap line-clamp-1 sm:max-w-max'>
                  Mua ngay
                </p>
              </Link>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  )
}

export default EmbedPage
