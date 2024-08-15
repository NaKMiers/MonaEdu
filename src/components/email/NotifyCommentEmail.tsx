import { commentData } from '@/constants/dataSamples'
import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function NotifyCommentEmail({ data = commentData }: { data?: any }) {
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
                <a href={process.env.NEXT_PUBLIC_APP_URL} className=''>
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
                <h1 className='text-2xl font-bold text-center'>Hi {data.receiver}👋 </h1>
                <h2 className='text-xl font-semibold text-center'>
                  Ai đó vừa trả lời bình luận của bạn, phản hồi ngay 😊!
                </h2>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Người bình luận: </b>
                    <span className='text-secondary tracking-wider font-semibold'>
                      {data.senderName}
                    </span>{' '}
                    <span className='text-slate-500'>({data.senderEmail})</span>
                  </p>
                  <p>
                    <b>Người nhận: </b>
                    <span className='text-secondary tracking-wider font-semibold'>
                      {data.receiver}
                    </span>{' '}
                    <span className='text-slate-500'>({data.receiverEmail})</span>
                  </p>
                  <p>
                    <b>Lúc: </b>
                    {new Intl.DateTimeFormat('vi', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })
                      .format(new Date(data.time))
                      .replace('lúc', '')}
                  </p>
                  <p>
                    <b>Nội dung: </b>
                    <span className='text-slate-500'>{data.content}</span>
                  </p>
                </div>
              </Column>
            </Row>

            <div className='text-center p-3 mb-10'>
              <a
                href={data.slug}
                className='inline no-underline rounded-lg font-semibold cursor-pointer py-3 px-7 text-slate-500'
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                Phản hồi ngay
              </a>
            </div>
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

export default NotifyCommentEmail
