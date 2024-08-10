import { order as orderSample } from '@/constants/dataSamples'
import { formatPrice } from '@/utils/number'
import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function OrderEmail({ order = orderSample }: { order?: any }) {
  return (
    <Tailwind
      config={{
        theme,
      }}
    >
      <Body className='text-dark font-sans'>
        <Container className='bg-white p-4'>
          <Section className='inline-block mx-auto'>
            <Row className='mb-3 w-full'>
              <Column>
                <a href='https://monaedu.com'>
                  <Img
                    className='aspect-square rounded-md'
                    src={`${'https://monaedu.com'}/images/logo.png`}
                    width={35}
                    height={35}
                    alt='Mona-Edu'
                  />
                </a>
              </Column>
              <Column>
                <a
                  href='https://monaedu.com'
                  className='text-2xl font-bold tracking-[0.3px] no-underline text-dark pl-2'
                >
                  MonaEdu
                </a>
              </Column>
            </Row>
          </Section>

          <Section
            className='rounded-lg overflow-hidden'
            style={{
              border: '1px solid rgb(0, 0, 0, 0.1)',
            }}
          >
            <div>
              <Img
                src='https://monaedu.com/backgrounds/brand-banner.jpg'
                className='w-full object-cover'
              />
            </div>

            <Row className='p-4'>
              <Column className='font'>
                <h1 className='text-2xl font-bold text-center'>Hi👋 </h1>
                <h2 className='text-xl font-semibold text-center'>
                  Cảm ơn bạn đã tham gia khóa học của Mona Edu, chúc bạn học tốt!
                </h2>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Mã đơn hàng: </b>
                    <span className='text-secondary tracking-wider font-semibold'>{order.code}</span>
                  </p>
                  <p>
                    <b>Ngày tham gia: </b>
                    {new Intl.DateTimeFormat('en', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                      timeZone: 'Asia/Ho_Chi_Minh',
                    }).format(new Date(order.createdAt))}
                  </p>
                  <p>
                    <b>Trạng thái: </b>
                    <span className='text-[#50C878]'>Hoàn tất</span>
                  </p>
                  <p>
                    <b>Tổng: </b>
                    <b>{formatPrice(order.total)}</b>
                  </p>
                  <p>
                    <b>Email: </b>
                    <span className='text-[#0a82ed]'>{order.email}</span>
                  </p>
                </div>

                {/* Message From Admin */}
                {order.message && typeof order.message === 'string' && order.message.trim() && (
                  <div
                    className='px-21 py-21/2 rounded-lg'
                    style={{
                      border: '1px solid rgb(0, 0, 0, 0.1)',
                    }}
                  >
                    <p className='font-semibold underline tracking-wider text-sm text-slate-400 text-center m-0 mb-3'>
                      Lời nhắn từ quản trị viên
                    </p>
                    <p className='text-sm m-0'>{order.message}</p>
                  </div>
                )}

                {/* Course */}
                <div className='mt-8'>
                  <b className='text-[24px]'>Khóa học: </b>

                  <ul className='list-none p-0'>
                    {order.items.map((course: any) => (
                      <li className='mb-2' key={course._id}>
                        <a
                          href={`https://monaedu.vercel.app/${course.slug}`}
                          className='block h-full text-dark tracking-wider no-underline'
                        >
                          <Section>
                            <Row>
                              <Column className='w-[130px]'>
                                <Img
                                  src={course.images[0]}
                                  width={120}
                                  className='inline aspect-video rounded-lg object-cover'
                                />
                              </Column>
                              <Column>
                                <p className='font-semibold text-slate-600'>{course.title}</p>
                              </Column>
                            </Row>
                          </Section>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Column>
            </Row>

            <div className='text-center p-3 mb-8'>
              <a
                href={
                  order.items.length > 1
                    ? 'https://monaedu.com/my-courses'
                    : `https://monaedu.com/learning/${order.items[0]._id}/start`
                }
                className='inline bg-sky-500 no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'
              >
                Học ngay
              </a>
            </div>
          </Section>

          <div className='flex justify-center pt-[45px]'>
            <Img
              className='max-w-full'
              width={620}
              src={`${'https://monaedu.com'}/backgrounds/footer-banner.jpg`}
            />
          </div>

          <p className='text-center text-xs text-slate-600'>
            © 2023 | MonaEdu - Developed by Nguyen Anh Khoa, All rights reserved.
          </p>

          <div className='text-center'>
            <a
              href='https://zalo.me/0899320427'
              target='_blank'
              rel='noreferrer'
              className='inline-block'
            >
              <Img src={`${'https://monaedu.com'}/icons/zalo.jpg`} width={35} height={35} alt='zalo' />
            </a>
            <a
              href='https://www.messenger.com/t/170660996137305'
              target='_blank'
              rel='noreferrer'
              className='inline-block ml-2'
            >
              <Img
                src={`${'https://monaedu.com'}/icons/messenger.jpg`}
                width={35}
                height={35}
                alt='messenger'
              />
            </a>
          </div>
        </Container>
      </Body>
    </Tailwind>
  )
}

export default OrderEmail
