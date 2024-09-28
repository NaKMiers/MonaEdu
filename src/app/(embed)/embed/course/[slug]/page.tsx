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
    course = data.course
  } catch (err: any) {
    notFound()
  }

  if (!course) {
    return
  }

  return (
    <div className="no-scrollbar overflow-hidden rounded-xl border-2 border-neutral-800 p-5">
      <CardContainer>
        <CardBody className="group/card relative flex h-full flex-col rounded-xl border border-black/[0.1] bg-neutral-800 p-2.5 md:p-4">
          {course.oldPrice && (
            <CardItem
              translateZ="35"
              className="absolute right-1 top-1 rounded-bl-lg rounded-tr-lg bg-yellow-400 px-1 py-0.5 text-center font-body text-[12px] font-semibold leading-4 text-dark"
            >
              Giảm{' '}
              {countPercent(
                applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
                course.oldPrice
              )}
            </CardItem>
          )}

          <Divider size={2} />

          <CardItem
            translateZ={50}
            className="text-xl font-bold text-neutral-600 dark:text-light"
          >
            <Link
              href={`/${course.slug}`}
              prefetch={false}
              target="_blank"
              rel="noreferrer"
              className="mb-1 line-clamp-2 text-ellipsis font-body text-[14px] leading-[20px] tracking-wider md:mb-2 md:text-[21px] md:leading-[28px]"
              title={course.title}
            >
              {course.title}
            </Link>
          </CardItem>

          <CardItem
            as="p"
            translateZ={30}
            className="mb-2 line-clamp-2 text-ellipsis text-xs text-neutral-300 md:text-sm"
            title={course.textHook}
          >
            {course.textHook}
          </CardItem>

          <CardItem
            translateZ={80}
            className="w-full"
          >
            <Link
              href={`/${course.slug}`}
              prefetch={false}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-video overflow-hidden rounded-lg shadow-lg"
            >
              <div className="trans-500 flex w-full snap-x snap-mandatory overflow-x-scroll hover:scale-105">
                {course.images.map(src => (
                  <Image
                    className="h-full w-full flex-shrink-0 snap-start object-cover"
                    src={src}
                    width={320}
                    height={320}
                    alt={course.title}
                    loading="lazy"
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
            className="w-full text-xl font-bold text-neutral-600 dark:text-light"
          >
            <Price
              price={course.price}
              oldPrice={course.oldPrice}
              flashSale={course.flashSale as IFlashSale}
              className="border-2"
            />
          </CardItem>

          <Divider size={4} />

          <div className="flex flex-1 items-end justify-between">
            <CardItem
              translateZ={80}
              className="flex w-full items-center gap-1"
            >
              {/* Buy Now Button */}
              <Link
                href={`/${course.slug}`}
                prefetch={false}
                target="_blank"
                rel="noreferrer"
                className="trans-300 relative flex h-[42px] w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dark bg-dark-100 px-2 font-semibold text-light shadow-lg hover:-translate-y-1 hover:bg-white hover:text-dark"
              >
                <p className="relative z-10 line-clamp-1 flex items-center gap-1 text-ellipsis text-nowrap text-sm sm:max-w-max sm:text-base">
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
