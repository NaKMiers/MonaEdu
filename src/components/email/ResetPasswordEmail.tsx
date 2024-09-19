import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

function ResetPasswordEmail({
  name = 'David Pi',
  link = process.env.NEXT_PUBLIC_APP_URL,
}: {
  name?: string
  link?: string
}) {
  return (
    <Tailwind
      config={{
        theme,
      }}
    >
      <Body className='text-dark font-sans'>
        <Container className='bg-white p-4 pb-6'>
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

          <div
            className='border-t'
            style={{
              borderTop: '1px solid rgb(0, 0, 0, 0.1)',
            }}
          />

          <Section className='px-5'>
            <p>Hi {name},</p>
            <p>
              Bạn đã gửi yêu cầu khôi phục mật khẩu tại{' '}
              <span className='font-semibold'>&quot;MonaEdu&quot;</span> lúc{' '}
              {new Intl.DateTimeFormat('vi', {
                dateStyle: 'full',
                timeStyle: 'medium',
                timeZone: 'Asia/Ho_Chi_Minh',
              })
                .format(new Date())
                .replace('lúc', '')}
              .
            </p>

            <p>Nếu đây không phải bạn, hãy bỏ qua email này.</p>

            <p>
              Ngược lại, nếu đây là bạn, hãy ấn vào nút bên dưới để{' '}
              <a href={link} className='text-blue-500'>
                khôi phục mật khẩu
              </a>{' '}
              ngay.
            </p>

            <div className='text-center p-3'>
              <a
                href={link}
                className='inline bg-sky-500 no-underline rounded-lg text-light font-semibold cursor-pointer py-3 px-7 border-0'
              >
                Khôi phục mật khẩu
              </a>
            </div>

            <p className='text-xs text-center'>{link}</p>

            <p>Để giữ cho tải khoản của bạn được an toàn, không chia sẻ email này với bất kỳ ai!</p>
            <p>
              Nếu bạn có thắc mắc gì? Vui lòng liên hệ để được hỗ trợ với sự tận tình và nhanh chống:{' '}
              <a href={process.env.NEXT_PUBLIC_MESSENGER!} className='text-blue-500'>
                Liên hệ
              </a>
            </p>
            <p>
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
              <br />
              Mona Edu
            </p>
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

export default ResetPasswordEmail
