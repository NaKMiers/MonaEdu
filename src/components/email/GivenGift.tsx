import { order as orderSample } from '@/constants/dataSamples'
import { formatPrice } from '@/utils/number'
import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function GivenGift({ order = orderSample }: { order?: any }) {
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
                <a href={process.env.NEXT_PUBLIC_APP_URL}>
                  <Img
                    className='aspect-square rounded-md'
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`}
                    width={35}
                    height={35}
                  />
                </a>
              </Column>
              <Column>
                <a
                  href={process.env.NEXT_PUBLIC_APP_URL}
                  className='text-2xl font-bold tracking-[0.3px] no-underline text-dark pl-2'
                >
                  Mona Edu
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
                src={`${process.env.NEXT_PUBLIC_APP_URL}/backgrounds/brand-banner.jpg`}
                className='w-full object-cover'
              />
            </div>

            <Row className='p-4'>
              <Column className='font'>
                <h1 className='text-2xl font-bold text-center'>Hi👋 </h1>
                <h2 className='text-xl font-semibold text-center'>
                  Bạn được tặng khóa học từ <span className='text-orange-500'>{order.sender}</span>
                </h2>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Received Date: </b>
                    {new Intl.DateTimeFormat('vi', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })
                      .format(new Date(order.createdAt))
                      .replace('lúc', '')}
                  </p>
                  <p>
                    <b>Trạng thái: </b>
                    <span className='text-[#50C878]'>Done</span>
                  </p>
                  <p>
                    <b>Tổng tiền: </b>
                    <b>{formatPrice(order.total)}</b>
                  </p>
                  <p>
                    <b>Người tặng: </b>
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

                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/${order.item.slug}`}
                    className='block h-full text-dark tracking-wider no-underline mt-2'
                  >
                    <Section>
                      <Row>
                        <Column className='w-[130px]'>
                          <Img
                            src={order.item.images[0]}
                            width={120}
                            className='inline aspect-video rounded-lg object-cover'
                          />
                        </Column>
                        <Column>
                          <p className='font-semibold text-slate-600'>{order.item.title}</p>
                        </Column>
                      </Row>
                    </Section>
                  </a>
                </div>
              </Column>
            </Row>

            {order.userId && (
              <div className='text-center p-3 mb-8'>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/learning/${order.item._id}/start`}
                  className='inline bg-sky-500 no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'
                >
                  Học ngay
                </a>
              </div>
            )}
          </Section>

          {/* MARK: Footer */}
          <div className='flex justify-center pt-[45px]'>
            <Img
              className='max-w-full'
              width={620}
              src={`${process.env.NEXT_PUBLIC_APP_URL}/backgrounds/footer-banner.jpg`}
            />
          </div>

          <p className='text-center text-xs text-slate-600'>
            © 2024 | Mona Edu - Developed by Nguyen Anh Khoa, All rights reserved.
          </p>

          <div className='text-center'>
            <a
              href={process.env.NEXT_PUBLIC_MESSENGER!}
              target='_blank'
              rel='noreferrer'
              className='inline-block'
            >
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/icons/messenger.jpg`}
                width={35}
                height={35}
                alt='zalo'
              />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_FACEBOOK!}
              target='_blank'
              rel='noreferrer'
              className='inline-block ml-4'
            >
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/icons/facebook.png`}
                width={35}
                height={35}
                alt='messenger'
              />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM!}
              target='_blank'
              rel='noreferrer'
              className='inline-block ml-4'
            >
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/icons/instagram.png`}
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

export default GivenGift
