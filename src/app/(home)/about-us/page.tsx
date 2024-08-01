import { AnimatedTooltip } from '@/components/AnimatedTooltip'
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
    image: '/images/testimonial-1.jpg ',
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
    <div className='p-2'>
      <div className='bg-white rounded-3xl overflow-hidden'>
        {/* 1 */}
        <div className='max-w-1200 mx-auto'>
          <div className='w-full flex flex-wrap md:flex-nowrap gap-x-4'>
            <div className='pt-[30px] md:pt-[60px] px-21 pb-0 md:pb-[90px] w-full md:w-1/2'>
              <span className='text-[32px] lg:text-[48px]'>
                Chúng tôi luôn mong muốn những khóa học tốt nhất cho bạn
              </span>
            </div>
            <div className='pt-[30px] md:pt-[60px] px-21 pb-[65px] md:pb-[90px] w-full md:w-1/2'>
              <span className='text-[32px] lg:text-[48px]'>87% số người cho rằng</span>
              <p className='text-[20px] mt-3 font-body tracking-wider'>
                học tập để phát triển chuyên môn mang các lợi ích nghề nghiệp, bao gồm các kết quả như
                được thăng chức, trở nên giỏi hơn trong công việc hiện tại và tìm được việc làm mới.
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-21 px-21'>
            <div className='flex gap-21 items-center'>
              <div className='text-[127px] w-[130px] overflow-hidden flex-shrink-0'>
                <span className='text-slate-200 mr-2 ml-[-30%]'>0</span>
                <span>1</span>
              </div>
              <div className='flex flex-col'>
                <p className='text-orange-500'>Đa dạng khóa học</p>
                <p
                  className='text-sm font-body tracking-wider leading-[22px] text-ellipsis line-clamp-3'
                  title='Mona Edu cung cấp hàng ngàn khóa học từ nhiều lĩnh vực, giúp bạn dễ dàng lựa chọn và phát triển kỹ năng.'
                >
                  Mona Edu cung cấp hàng ngàn khóa học từ nhiều lĩnh vực, giúp bạn dễ dàng lựa chọn và
                  phát triển kỹ năng
                </p>
              </div>
            </div>

            <div className='flex gap-21 items-center gap-x-21'>
              <div className='text-[127px] w-[130px] overflow-hidden flex-shrink-0'>
                <span className='text-slate-200 mr-2 ml-[-30%]'>0</span>
                <span>2</span>
              </div>
              <div className='flex flex-col'>
                <p className='text-orange-500'>Chi phí hợp lí</p>
                <p
                  className='text-sm font-body tracking-wider leading-[22px] text-ellipsis line-clamp-3'
                  title='Chúng tôi mang đến các khóa học chất lượng với mức giá phải chăng, phù hợp với mọi
                  người'
                >
                  Chúng tôi mang đến các khóa học chất lượng với mức giá phải chăng, phù hợp với mọi
                  người.
                </p>
              </div>
            </div>

            <div className='flex gap-21 items-center'>
              <div className='text-[127px] w-[130px] overflow-hidden flex-shrink-0'>
                <span className='text-slate-200 mr-2 ml-[-30%]'>0</span>
                <span>3</span>
              </div>
              <div className='flex flex-col'>
                <p className='text-orange-500'>Họi mọi lúc mọi nơi</p>
                <p
                  className='text-sm font-body tracking-wider leading-[22px] text-ellipsis line-clamp-3'
                  title='Học trên Mona Edu bất kể bạn ở đâu, chỉ cần có Internet'
                >
                  Học trên Mona Edu bất kể bạn ở đâu, chỉ cần có Internet.
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap md:flex-nowrap gap-21 py-[90px]'>
            <p className='font-body tracking-wider text-[19px] leading-8 px-21'>
              Mona Edu không chỉ cung cấp kiến thức mà còn kết nối bạn với cộng đồng, mang đến trải
              nghiệm học tập dễ tiếp cận cho mọi người.
            </p>
            <p className='font-body tracking-wider text-[19px] leading-8 px-21'>
              Chúng tôi giúp học viên học hỏi và ứng dụng vào công việc, cuộc sống. Mona Edu luôn đồng
              hành cùng bạn trong quá trình phát triển bản thân và sự nghiệp.
            </p>
          </div>
        </div>

        {/* 2 */}
        <div className='bg-[#f8f6f7] gap-21'>
          <div className='max-w-1200 mx-auto flex'>
            <div className='flex flex-col justify-center min-h-[453px] md:min-h-[521px] lg:min-h-[642px] max-w-[642px] w-full px-21'>
              <p className='text-[32px] lg:text-[50px] leading-[44px] lg:leading-[62px]'>
                Sứ mệnh - cung cấp sự giáo dục dễ tiếp cận cho mọi người
              </p>
              <p className='text-[22px] lg:text-[28px] leading-[32px] lg:leading-[37px] mt-4'>
                Mona Edu cung cấp +300 khóa học đa dạng lĩnh vực với mức giá phải chăng, phù hợp với mọi
                người
              </p>

              <div className='w-full h-[130px] flex items-end justify-start'>
                <div className='flex items-center justify-center gap-3'>
                  <Link
                    href='/categories'
                    className='h-[46px] flex items-center justify-center px-4 py-1 text-sm font-semibold bg-neutral-950 rounded-3xl text-light trans-300 shadow-lg hover:shadow-lg hover:shadow-primary'
                  >
                    Xem tất cả danh mục
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div className='max-w-1200 mx-auto'>
          <div className='grid grid-cols-12'>
            <div className='col-span-12 md:col-span-4 pt-[85px] pb-0 md:pb-[85px] px-21'>
              <div className='flex'>
                <p className='flex items-center gap-2 uppercase text-sm tracking-widest'>
                  <LuMoonStar size={16} className='text-orange-500' />
                  TESTIMONIALS
                </p>
              </div>
              <p className='text-[32px] lg:text-[48px] leading-[44px] lg:leading-[60px]'>
                Học sinh nói gì về chúng tôi
              </p>

              <div className='flex flex-row items-center w-full mt-10 flex-shrink-0'>
                <AnimatedTooltip items={testimonials} />
              </div>
            </div>

            <div className='col-span-12 md:col-span-8 py-[85px] px-21'>
              <div className='rounded-3xl bg-[#f8f6f7] h-[209px] w-full'>
                <Slider className='h-full' time={5000}>
                  {testimonials.map((testimonial, index) => (
                    <div className='flex flex-col justify-center px-21 sm:px-[80px] h-full' key={index}>
                      <p className='text-orange-500 font-semibold'>{testimonial.name}</p>
                      <p className='text-slate-400 text-sm'>{testimonial.designation}</p>
                      <p className='font-body tracking-wider mt-3 max-h-[120px] overflow-y-auto'>
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
        <div className='bg-[#f8f6f7] py-8'>
          <div className='max-w-1200 mx-auto'>
            <p className='text-[48px] text-center mb-8'>Thông tin liên hệ</p>

            {/* <div className='rounded-t-lg overflow-hidden'>
              <Image
                className='w-full h-full object-cover'
                src='/images/quote-3.jpg'
                width={1280}
                height={1280}
                alt='headquarter'
              />
            </div> */}

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-0.5 mt-0.5'>
              <Link
                href={process.env.NEXT_PUBLIC_FACEBOOK!}
                target='_blank'
                rel='noreferrer'
                className='bg-white px-21 py-8 sm:py-[80px] text-center rounded-bl-lg trans-300 hover:bg-primary hover:text-lg'
              >
                <div className='flex items-center justify-center gap-2'>
                  <FaFacebook size={24} className='flex-shrink-0' />
                  <span className='font-semibold'>Messenger</span>
                </div>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_INSTAGRAM!}
                target='_blank'
                rel='noreferrer'
                className='bg-white px-21 py-8 sm:py-[80px] text-center rounded-bl-lg trans-300 hover:bg-primary hover:text-lg'
              >
                <div className='flex items-center justify-center gap-2'>
                  <FaInstagram size={24} className='flex-shrink-0' />
                  <span className='font-semibold'>Instagram</span>
                </div>
              </Link>
              <Link
                href={`mailto:${process.env.NEXT_PUBLIC_GMAIL!}`}
                target='_blank'
                rel='noreferrer'
                className='bg-white px-21 py-8 sm:py-[80px] text-center rounded-bl-lg trans-300 hover:bg-primary hover:text-lg'
              >
                <div className='flex items-center justify-center gap-2'>
                  <SiGmail size={24} className='flex-shrink-0' />
                  <span className='font-semibold'>Gmail</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 5 */}
        <div className='max-w-1200 mx-auto flex items-center justify-center overflow-hidden h-[450px]'>
          <iframe
            className='w-full h-full object-contain'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4795225204916!2d106.64132647488253!3d10.774537789374126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ebc8a9e30d1%3A0x8e96c963a3909dab!2zNDkgVHLhu4tuaCDEkMOsbmggVHLhu41uZywgUGjGsOG7nW5nIDUsIFF14bqtbiAxMSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1722351133649!5m2!1svi!2s'
            style={{ border: '0' }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage
