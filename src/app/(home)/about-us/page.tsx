import { AnimatedTooltip } from '@/components/effects/AnimatedTooltip'
import Slider from '@/components/Slider'
import Link from 'next/link'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { LuMoonStar } from 'react-icons/lu'
import { SiGmail } from 'react-icons/si'

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Hoàng Ân',
    designation: 'Kỹ sư phần mềm',
    content:
      'Mona Edu là nơi tuyệt vời để tôi cập nhật và nâng cao kỹ năng công nghệ của mình. Các khóa học rất thực tiễn và dễ hiểu.',
    image: '/images/testimonial-1.jpg',
  },
  {
    id: 2,
    name: 'Trần Thị Minh',
    designation: 'Sinh viên',
    content:
      'Nhờ Mona Edu, tôi đã tìm thấy hướng đi rõ ràng cho tương lai của mình. Các khóa học rất phong phú và giảng viên nhiệt tình.',
    image: '/images/testimonial-3.jpg',
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    designation: 'Chuyên gia dữ liệu',
    content:
      'Các khóa học về khoa học dữ liệu trên Mona Edu đã giúp tôi nâng cao kiến thức và áp dụng ngay vào công việc hiện tại.',
    image: '/images/testimonial-4.jpg',
  },
  {
    id: 4,
    name: 'Phạm Thùy Dương',
    designation: 'Nhà thiết kế UX',
    content:
      'Tôi rất ấn tượng với các khóa học thiết kế UX tại Mona Edu. Các bài giảng rõ ràng và có nhiều bài tập thực hành.',
    image: '/images/testimonial-2.jpg',
  },
  {
    id: 5,
    name: 'Hoàng Văn Long',
    designation: 'Học sinh',
    content:
      'Các khóa học của Mona Edu đã giúp tôi hiểu rõ hơn về lập trình và định hướng cho tương lai nghề nghiệp của mình.',
    image: '/images/testimonial-5.jpg',
  },
  {
    id: 6,
    name: 'Võ Thu Hà',
    designation: 'Sinh viên',
    content:
      'Tôi đã tìm thấy niềm đam mê mới trong ngành công nghệ thông qua các khóa học tại Mona Edu. Các bài giảng rất dễ tiếp cận và thú vị.',
    image: '/images/testimonial-6.jpg',
  },
]

function AboutUsPage() {
  return (
    <div className="p-2">
      <div className="overflow-hidden rounded-3xl bg-white">
        {/* 1 */}
        <div className="mx-auto max-w-1200">
          <div className="flex w-full flex-wrap gap-x-4 md:flex-nowrap">
            <div className="w-full px-21 pb-0 pt-[30px] md:w-1/2 md:pb-[90px] md:pt-[60px]">
              <span className="text-[32px] lg:text-[48px]">
                Chúng tôi luôn mong muốn những khóa học tốt nhất cho bạn
              </span>
            </div>
            <div className="w-full px-21 pb-[65px] pt-[30px] md:w-1/2 md:pb-[90px] md:pt-[60px]">
              <span className="text-[32px] lg:text-[48px]">87% số người cho rằng</span>
              <p className="mt-3 font-body text-[20px] tracking-wider">
                học tập để phát triển chuyên môn mang các lợi ích nghề nghiệp, bao gồm các kết quả như
                được thăng chức, trở nên giỏi hơn trong công việc hiện tại và tìm được việc làm mới.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-21 px-21 lg:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-center gap-21">
              <div className="w-[130px] flex-shrink-0 overflow-hidden text-[127px]">
                <span className="ml-[-30%] mr-2 text-slate-200">0</span>
                <span>1</span>
              </div>
              <div className="flex flex-col">
                <p className="text-orange-500">Đa dạng khóa học</p>
                <p
                  className="line-clamp-3 text-ellipsis font-body text-sm leading-[22px] tracking-wider"
                  title="Mona Edu cung cấp hàng ngàn khóa học từ nhiều lĩnh vực, giúp bạn dễ dàng lựa chọn và phát triển kỹ năng."
                >
                  Mona Edu cung cấp hàng ngàn khóa học từ nhiều lĩnh vực, giúp bạn dễ dàng lựa chọn và
                  phát triển kỹ năng
                </p>
              </div>
            </div>

            <div className="flex items-center gap-21 gap-x-21">
              <div className="w-[130px] flex-shrink-0 overflow-hidden text-[127px]">
                <span className="ml-[-30%] mr-2 text-slate-200">0</span>
                <span>2</span>
              </div>
              <div className="flex flex-col">
                <p className="text-orange-500">Chi phí hợp lí</p>
                <p
                  className="line-clamp-3 text-ellipsis font-body text-sm leading-[22px] tracking-wider"
                  title="Chúng tôi mang đến các khóa học chất lượng với mức giá phải chăng, phù hợp với mọi
                  người"
                >
                  Chúng tôi mang đến các khóa học chất lượng với mức giá phải chăng, phù hợp với mọi
                  người.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-21">
              <div className="w-[130px] flex-shrink-0 overflow-hidden text-[127px]">
                <span className="ml-[-30%] mr-2 text-slate-200">0</span>
                <span>3</span>
              </div>
              <div className="flex flex-col">
                <p className="text-orange-500">Học mọi lúc mọi nơi</p>
                <p
                  className="line-clamp-3 text-ellipsis font-body text-sm leading-[22px] tracking-wider"
                  title="Học trên Mona Edu bất kể bạn ở đâu, chỉ cần có Internet"
                >
                  Học trên Mona Edu bất kể bạn ở đâu, chỉ cần có Internet.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-21 py-[90px] md:flex-nowrap">
            <p className="px-21 font-body text-[19px] leading-8 tracking-wider">
              Mona Edu không chỉ cung cấp kiến thức mà còn kết nối bạn với cộng đồng, mang đến trải
              nghiệm học tập dễ tiếp cận cho mọi người.
            </p>
            <p className="px-21 font-body text-[19px] leading-8 tracking-wider">
              Chúng tôi giúp học viên học hỏi và ứng dụng vào công việc, cuộc sống. Mona Edu luôn đồng
              hành cùng bạn trong quá trình phát triển bản thân và sự nghiệp.
            </p>
          </div>
        </div>

        {/* 2 */}
        <div className="gap-21 bg-[#f8f6f7]">
          <div className="mx-auto flex max-w-1200">
            <div className="flex min-h-[453px] w-full max-w-[642px] flex-col justify-center px-21 md:min-h-[521px] lg:min-h-[642px]">
              <p className="text-[32px] leading-[44px] lg:text-[50px] lg:leading-[62px]">
                Sứ mệnh - cung cấp sự giáo dục dễ tiếp cận cho mọi người
              </p>
              <p className="mt-4 text-[22px] leading-[32px] lg:text-[28px] lg:leading-[37px]">
                Mona Edu cung cấp +300 khóa học đa dạng lĩnh vực với mức giá phải chăng, phù hợp với mọi
                người
              </p>

              <div className="flex h-[130px] w-full items-end justify-start">
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href="/categories"
                    className="trans-300 flex h-[46px] items-center justify-center rounded-3xl bg-neutral-950 px-4 py-1 text-sm font-semibold text-light shadow-lg hover:shadow-lg hover:shadow-primary"
                  >
                    Xem tất cả danh mục
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div className="mx-auto max-w-1200">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-21 pb-0 pt-[85px] md:col-span-4 md:pb-[85px]">
              <div className="flex">
                <p className="flex items-center gap-2 text-sm uppercase tracking-widest">
                  <LuMoonStar
                    size={16}
                    className="text-orange-500"
                  />
                  TESTIMONIALS
                </p>
              </div>
              <p className="text-[32px] leading-[44px] lg:text-[48px] lg:leading-[60px]">
                Học sinh nói gì về chúng tôi
              </p>

              <div className="mt-10 flex w-full flex-shrink-0 flex-row items-center">
                <AnimatedTooltip items={testimonials} />
              </div>
            </div>

            <div className="col-span-12 px-21 py-[85px] md:col-span-8">
              <div className="h-[209px] w-full rounded-3xl bg-[#f8f6f7]">
                <Slider
                  className="h-full"
                  time={5000}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      className="flex h-full flex-col justify-center px-21 sm:px-[80px]"
                      key={index}
                    >
                      <p className="font-semibold text-orange-500">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.designation}</p>
                      <p className="mt-3 max-h-[120px] overflow-y-auto font-body tracking-wider">
                        {testimonial.content}
                      </p>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>

        {/* 4 */}
        <div className="bg-[#f8f6f7] py-8">
          <div className="mx-auto max-w-1200">
            <p className="mb-8 text-center text-[48px]">Thông tin liên hệ</p>

            <div className="mt-0.5 grid grid-cols-1 gap-0.5 sm:grid-cols-3">
              <Link
                href={process.env.NEXT_PUBLIC_FACEBOOK!}
                target="_blank"
                rel="noreferrer"
                className="trans-300 rounded-bl-lg bg-white px-21 py-8 text-center hover:bg-primary hover:text-lg sm:py-[80px]"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaFacebook
                    size={24}
                    className="flex-shrink-0"
                  />
                  <span className="font-semibold">Messenger</span>
                </div>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_INSTAGRAM!}
                target="_blank"
                rel="noreferrer"
                className="trans-300 rounded-bl-lg bg-white px-21 py-8 text-center hover:bg-primary hover:text-lg sm:py-[80px]"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaInstagram
                    size={24}
                    className="flex-shrink-0"
                  />
                  <span className="font-semibold">Instagram</span>
                </div>
              </Link>
              <Link
                href={`mailto:${process.env.NEXT_PUBLIC_GMAIL!}`}
                target="_blank"
                rel="noreferrer"
                className="trans-300 rounded-bl-lg bg-white px-21 py-8 text-center hover:bg-primary hover:text-lg sm:py-[80px]"
              >
                <div className="flex items-center justify-center gap-2">
                  <SiGmail
                    size={24}
                    className="flex-shrink-0"
                  />
                  <span className="font-semibold">Gmail</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 5 */}
        <div className="mx-auto flex h-[450px] max-w-1200 items-center justify-center overflow-hidden">
          <iframe
            className="h-full w-full object-contain"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4795225204916!2d106.64132647488253!3d10.774537789374126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ebc8a9e30d1%3A0x8e96c963a3909dab!2zNDkgVHLhu4tuaCDEkMOsbmggVHLhu41uZywgUGjGsOG7nW5nIDUsIFF14bqtbiAxMSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1722351133649!5m2!1svi!2s"
            style={{ border: '0' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage
