import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

function VerifyPhoneEmail({
  name = 'Nguyễn Pi Pi',
  link = 'https://monaedu.com?token=1234567890',
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
                <a href='https://monaedu.com'>
                  <Img
                    className='aspect-square rounded-md'
                    src={`${'https://monaedu.com'}/images/logo.jpg`}
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

          <div
            className='border-t'
            style={{
              borderTop: '1px solid rgb(0, 0, 0, 0.1)',
            }}
          />

          <Section className='px-5'>
            <p>Hi {name},</p>
            <p>
              Bạn đã yêu cầu gửi mã xác thực tại{' '}
              <span className='font-semibold'>&quot;MonaEdu&quot;</span> lúc{' '}
              {new Intl.DateTimeFormat('en', {
                dateStyle: 'full',
                timeStyle: 'medium',
                timeZone: 'Asia/Ho_Chi_Minh',
              }).format(new Date())}
              .
            </p>

            <p>Nếu đây không phải bạn, hãy bỏ qua email này.</p>

            <p>
              Người lại, nếu đây là bạn, hãy ấn vào nút bên dưới để{' '}
              <a href={link} className='text-blue-500'>
                xác thực số điện thoại của bạn
              </a>{' '}
              ngay.
            </p>

            {/* Button */}
            <div className='text-center p-3'>
              <a
                href={link}
                className='inline bg-sky-500 no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'
              >
                Xác thực
              </a>
            </div>

            <p>Để giữ cho tải khoản của bạn được an toàn, không chia sẻ email này với bất kỳ ai!</p>
            <p>
              Nếu bạn có thắc mắc gì? Vui lòng liên hệ để được hỗ trợ với sự tận tình và nhanh chống:{' '}
              <a href='https://www.messenger.com/t/170660996137305' className='text-blue-500'>
                Liên hệ
              </a>
            </p>
            <p>
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
              <br />
              MonaEdu
            </p>
          </Section>

          {/* Footer */}
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

export default VerifyPhoneEmail
