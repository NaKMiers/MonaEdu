import { AnimatedTooltip } from '@/components/AnimatedTooltip'
import Slider from '@/components/Slider'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookMessenger, FaInstagram, FaInstagramSquare } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'

const people = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Software Engineer',
    image: '/images/logo.png',
  },
  {
    id: 2,
    name: 'Robert Johnson',
    designation: 'Product Manager',
    image: '/images/logo.png',
  },
  {
    id: 3,
    name: 'Jane Smith',
    designation: 'Data Scientist',
    image: '/images/logo.png',
  },
  {
    id: 4,
    name: 'Emily Davis',
    designation: 'UX Designer',
    image: '/images/logo.png',
  },
  {
    id: 5,
    name: 'Tyler Durden',
    designation: 'Soap Developer',
    image: '/images/logo.png',
  },
  {
    id: 6,
    name: 'Dora',
    designation: 'The Explorer',
    image: '/images/logo.png',
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
                  phát triển kỹ năng.
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
                  người.'
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
                  title='Học tập linh hoạt trên Mona Edu với kết nối internet, bất kể bạn ở đâu.'
                >
                  Học tập linh hoạt trên Mona Edu với kết nối internet, bất kể bạn ở đâu.
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap md:flex-nowrap gap-21 py-[90px]'>
            <p className='font-body tracking-wider text-[19px] leading-8 px-21'>
              Excepteur sint occaecat cupidatat non proident, sunulpa qui officia deserunt mollit anim id
              est laborum. Sedut ciatis unde omnis natus error voluptatem accusantium laudantium.
            </p>
            <p className='font-body tracking-wider text-[19px] leading-8 px-21'>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab inventore veritatis architecto.
            </p>
          </div>
        </div>

        {/* 2 */}
        <div className='bg-[#f8f6f7] gap-21'>
          <div className='max-w-1200 mx-auto flex'>
            <div className='flex flex-col justify-center min-h-[453px] md:min-h-[521px] lg:min-h-[642px] max-w-[642px] w-full px-21'>
              <p className='text-[32px] lg:text-[50px] leading-[44px] lg:leading-[62px]'>
                Mission - hight quality education for everyone
              </p>
              <p className='text-[22px] lg:text-[28px] leading-[32px] lg:leading-[37px] mt-4'>
                Excepteur sint occaecat cupidatat non proident deserunt mollit anim!
              </p>

              <div className='w-full h-[130px] flex items-end justify-start'>
                <div className='flex items-center justify-center gap-3'>
                  <Link
                    href='/categories'
                    className={`group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50`}
                  >
                    <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
                    <span className='inline-flex font-semibold h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 trans-300 px-21 py-1 text-sm text-white backdrop-blur-3xl'>
                      View All Courses
                    </span>
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
                <span className='uppercase text-sm tracking-widest'>TESTIMONIALS</span>
              </div>
              <p className='text-[32px] lg:text-[48px] leading-[44px] lg:leading-[60px]'>
                Students say about us...
              </p>

              <div className='flex flex-row items-center w-full mt-10 flex-shrink-0'>
                <AnimatedTooltip items={people} />
              </div>
            </div>

            <div className='col-span-12 md:col-span-8 py-[85px] px-21'>
              <div className='rounded-3xl bg-[#f8f6f7] h-[209px] w-full'>
                <Slider className='h-full' time={5000}>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div className='flex flex-col justify-center px-21 sm:px-[80px] h-full' key={index}>
                      <p className='text-orange-500 font-semibold'>Jessica Jane</p>
                      <p className='text-slate-400 text-sm'>Marketing Consultant</p>
                      <p className='tracking-wider mt-3 max-h-[120px] overflow-y-auto'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores animi eius earum
                        dolor rem esse incidunt tenetur, voluptates iusto dolores!
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
            <p className='text-[48px] text-center'>Thông tin liên hệ</p>

            <div className='rounded-t-lg overflow-hidden mt-8'>
              <Image
                className='w-full h-full object-cover'
                src='/images/quote-3.jpg'
                width={1280}
                height={1280}
                alt='headquarter'
              />
            </div>

            <div className='grid grid-cols-3 gap-0.5 mt-0.5'>
              <div className='bg-white px-21 py-[80px] text-center rounded-bl-lg'>
                <div className='flex items-center justify-center gap-2'>
                  <FaFacebookMessenger size={24} />
                  <span className='font-semibold'>Messenger</span>
                </div>

                <Link href='/' className='block mt-2.5 font-boyd tracking-wider'>
                  http://localhost:3000/about-us
                </Link>
              </div>
              <div className='bg-white px-21 py-[80px] text-center'>
                <div className='flex items-center justify-center gap-2'>
                  <FaInstagram size={24} />
                  <span className='font-semibold'>Instagram</span>
                </div>

                <Link href='/' className='block mt-2.5 font-boyd tracking-wider'>
                  http://localhost:3000/about-us
                </Link>
              </div>
              <div className='bg-white px-21 py-[80px] text-center rounded-br-lg'>
                <div className='flex items-center justify-center gap-2'>
                  <SiGmail size={24} />
                  <span className='font-semibold'>Gmail</span>
                </div>

                <Link href='/' className='block mt-2.5 font-boyd tracking-wider'>
                  http://localhost:3000/about-us
                </Link>
              </div>
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
