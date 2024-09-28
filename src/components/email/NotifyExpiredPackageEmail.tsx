import { expiredPackageData } from '@/constants/dataSamples'
import { getUserName } from '@/utils/string'
import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function NotifyExpiredPackageEmail({ data = expiredPackageData }: { data?: any }) {
  return (
    <Tailwind
      config={{
        theme,
      }}
    >
      <Body className="font-sans text-dark">
        <Container className="bg-white p-4">
          <Section className="mx-auto inline-block">
            <Row className="mb-3 w-full">
              <Column>
                <a
                  href={process.env.NEXT_PUBLIC_APP_URL}
                  className=""
                >
                  <Img
                    className="aspect-square rounded-md"
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`}
                    width={35}
                    height={35}
                  />
                </a>
              </Column>
              <Column>
                <a
                  href={process.env.NEXT_PUBLIC_APP_URL}
                  className="pl-2 text-2xl font-bold tracking-[0.3px] text-dark no-underline"
                >
                  Mona Edu
                </a>
              </Column>
            </Row>
          </Section>

          <Section
            className="overflow-hidden rounded-lg"
            style={{
              border: '1px solid rgb(0, 0, 0, 0.1)',
            }}
          >
            <div>
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/backgrounds/brand-banner.jpg`}
                className="w-full object-cover"
              />
            </div>

            <Row className="p-4">
              <Column className="font">
                <h1 className="text-center text-2xl font-bold">Hi, {getUserName(data)}👋</h1>
                <h2 className="text-center text-xl font-semibold">
                  Gói hội của bạn sẽ hết hạn{' '}
                  <span className="text-orange-500">{data.remainingTime}</span> 😥
                </h2>

                <div className="mt-8 text-sm">
                  <p>
                    <span>Email: </span>
                    <span className="tracking-wider text-sky-500 underline">{data.email}</span>{' '}
                  </p>
                  <p>
                    <span>Thời gian tham gia: </span>
                    {new Intl.DateTimeFormat('vi', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })
                      .format(new Date(data.package.createdAt))
                      .replace('lúc', '')}
                  </p>
                  <p>
                    <span>Gói: </span>
                    <span className="text-violet-500">{data.package.title}</span>
                  </p>
                  <p>
                    <span>Thời gian còn lại: </span>
                    <span className="text-orange-500">{data.remainingTime.replace('trong', '')}</span>
                  </p>
                </div>
              </Column>
            </Row>

            <div className="px-4">
              <div className="h-px bg-slate-300 px-4" />
            </div>

            <Row className="p-4">
              <p className="font-body text-sm tracking-wider">
                Cảm ơn bạn đã đồng hành cùng Mona Edu trong thời gian qua.
              </p>
              <p className="font-body text-sm tracking-wider">
                Hãy{' '}
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/subscription`}
                  className="text-violet-500 underline"
                >
                  gia hạn
                </a>{' '}
                hoặc{' '}
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/subscription`}
                  className="text-violet-500 underline"
                >
                  nâng cấp
                </a>{' '}
                gói học viên của bạn để tiếp tục hành trình học tập của bạn nhé 🥳
              </p>
            </Row>

            <div className="mb-10 p-3 text-center">
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/subscription`}
                className="inline cursor-pointer rounded-lg border border-light bg-neutral-900 px-7 py-3 font-semibold text-light no-underline"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                Gia hạn ngay
              </a>
            </div>
          </Section>

          {/* MARK: Footer */}
          <div className="flex justify-center pt-[45px]">
            <Img
              className="max-w-full"
              width={620}
              src={`${process.env.NEXT_PUBLIC_APP_URL}/backgrounds/footer-banner.jpg`}
            />
          </div>

          <p className="text-center text-xs text-slate-600">
            © 2024 | Mona Edu - Developed by Nguyen Anh Khoa, All rights reserved.
          </p>

          <div className="text-center">
            <a
              href={process.env.NEXT_PUBLIC_MESSENGER!}
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/icons/messenger.jpg`}
                width={35}
                height={35}
                alt="zalo"
              />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_FACEBOOK!}
              target="_blank"
              rel="noreferrer"
              className="ml-4 inline-block"
            >
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/icons/facebook.png`}
                width={35}
                height={35}
                alt="messenger"
              />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM!}
              target="_blank"
              rel="noreferrer"
              className="ml-4 inline-block"
            >
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/icons/instagram.png`}
                width={35}
                height={35}
                alt="messenger"
              />
            </a>
          </div>
        </Container>
      </Body>
    </Tailwind>
  )
}

export default NotifyExpiredPackageEmail
