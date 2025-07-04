import { order as orderSample } from '@/constants/dataSamples'
import { formatPrice } from '@/utils/number'
import { capitalize } from '@/utils/string'
import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function OrderEmail({ order = orderSample }: { order?: any }) {
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
                <a href={process.env.NEXT_PUBLIC_APP_URL}>
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
                <h1 className="text-center text-2xl font-bold">Hi👋 </h1>
                <h2 className="text-center text-xl font-semibold">
                  {order.isPackage
                    ? 'Cảm ơn bạn đã đăng ký gói học viên của chúng tôi, chúc bạn thành công. Ấn vào đây!'
                    : 'Cảm ơn bạn đã tham gia khóa học của Mona Edu, chúc bạn học tốt!'}
                </h2>

                <div className="mt-8 text-sm">
                  <p>
                    <b>Mã đơn hàng: </b>
                    <span className="font-semibold tracking-wider text-secondary">{order.code}</span>
                  </p>
                  <p>
                    <b>Ngày tham gia: </b>
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
                    <span className="text-[#50C878]">Hoàn tất</span>
                  </p>
                  <p>
                    <b>Phương thức thanh toán: </b>
                    <span className="text-purple-500">{capitalize(order.paymentMethod)}</span>
                  </p>
                  <p>
                    <b>Tổng: </b>
                    <b className="text-green-600">{formatPrice(order.total)}</b>
                  </p>
                  <p>
                    <b>Email: </b>
                    <span className="text-[#0a82ed]">{order.email}</span>
                  </p>
                </div>

                {/* Message From Admin */}
                {order.message && typeof order.message === 'string' && order.message.trim() && (
                  <div
                    className="rounded-lg px-21 py-21/2"
                    style={{
                      border: '1px solid rgb(0, 0, 0, 0.1)',
                    }}
                  >
                    <p className="m-0 mb-3 text-center text-sm font-semibold tracking-wider text-slate-400 underline">
                      Lời nhắn từ quản trị viên
                    </p>
                    <p className="m-0 text-sm">{order.message}</p>
                  </div>
                )}

                {/* Course */}
                <div className="mt-8">
                  <b className="text-[24px]">{order.isPackage ? 'Gói học viên:' : 'Khóa học:'} </b>

                  <ul className="list-none p-0">
                    {order.items.map((course: any) => (
                      <li
                        className="mb-2"
                        key={course._id}
                      >
                        <a
                          href={`${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`}
                          className="block h-full tracking-wider text-dark no-underline"
                        >
                          <Section>
                            <Row>
                              {course.images && course.images[0] && (
                                <Column className="w-[130px]">
                                  <Img
                                    src={course.images[0]}
                                    width={120}
                                    className="inline aspect-video rounded-lg object-cover"
                                  />
                                </Column>
                              )}
                              <Column>
                                <p className="font-semibold text-slate-600">{course.title}</p>
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

            <div className="mb-8 p-3 text-center">
              <a
                href={
                  order.items.length > 1
                    ? `${process.env.NEXT_PUBLIC_APP_URL}/my-courses`
                    : `${process.env.NEXT_PUBLIC_APP_URL}/learning/${order.items[0]._id}/start`
                }
                className="inline cursor-pointer rounded-lg border-0 bg-sky-500 px-7 py-3 font-semibold text-light no-underline"
              >
                Học ngay
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

export default OrderEmail
