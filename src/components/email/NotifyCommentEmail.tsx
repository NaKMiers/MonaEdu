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
                <h1 className="text-center text-2xl font-bold">Hi {data.receiver}👋 </h1>
                <h2 className="text-center text-xl font-semibold">
                  Ai đó vừa trả lời bình luận của bạn, phản hồi ngay 😊!
                </h2>

                <div className="mt-8 text-sm">
                  <p>
                    <b>Người bình luận: </b>
                    <span className="font-semibold tracking-wider text-secondary">
                      {data.senderName}
                    </span>{' '}
                    <span className="text-slate-500">({data.senderEmail})</span>
                  </p>
                  <p>
                    <b>Người nhận: </b>
                    <span className="font-semibold tracking-wider text-secondary">
                      {data.receiver}
                    </span>{' '}
                    <span className="text-slate-500">({data.receiverEmail})</span>
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
                    <span className="text-slate-500">{data.content}</span>
                  </p>
                </div>
              </Column>
            </Row>

            <div className="mb-10 p-3 text-center">
              <a
                href={data.slug}
                className="inline cursor-pointer rounded-lg px-7 py-3 font-semibold text-slate-500 no-underline"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                Phản hồi ngay
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

export default NotifyCommentEmail
