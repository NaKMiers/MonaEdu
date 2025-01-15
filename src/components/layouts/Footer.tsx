'use client'

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import {
  FaCheck,
  FaFreeCodeCamp,
  FaHistory,
  FaInfoCircle,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
} from 'react-icons/fa'
import { RiVipCrown2Fill } from 'react-icons/ri'
import { SiCoursera } from 'react-icons/si'
import Divider from '../Divider'
import Quote from '../Quote'
import { MdOutlineRedeem } from 'react-icons/md'
import toast from 'react-hot-toast'
import { setOpenActivateCourse } from '@/libs/reducers/modalReducer'
import { useAppDispatch } from '@/libs/hooks'

function Footer() {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

  return (
    <footer className="mb-[72px] overflow-hidden rounded-t-[40px] border-t-2 border-slate-300 bg-dark-100 px-21 pt-3 text-light md:mb-0">
      <div className="mx-auto max-w-1200">
        {/* Head */}
        <div className="flex flex-wrap items-center justify-between gap-x-21">
          {/* Brand */}
          <div className="flex items-center gap-4 py-3">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="aspect-square h-[40px] w-[40px] overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  className="h-full w-full object-cover"
                  src="/images/logo.png"
                  width={60}
                  height={60}
                  alt="github"
                  loading="lazy"
                />
              </Link>
              <span className="font-body text-3xl font-bold text-primary">MonaEdu</span>
            </div>
          </div>

          {/* Contact */}
          <div
            id="contact"
            className="flex items-center gap-x-4 gap-y-2"
          >
            <Link
              href={process.env.NEXT_PUBLIC_MESSENGER!}
              target="_blank"
              rel="noreferrer"
              className="w-full max-w-[32px]"
            >
              <Image
                src="/icons/messenger.jpg"
                className="wiggle-1"
                width={50}
                height={50}
                alt="messenger"
                loading="lazy"
              />
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_FACEBOOK!}
              target="_blank"
              rel="noreferrer"
              className="w-full max-w-[32px]"
            >
              <Image
                src="/icons/facebook.png"
                className="wiggle-1"
                width={50}
                height={50}
                alt="gmail"
                loading="lazy"
              />
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_INSTAGRAM!}
              target="_blank"
              rel="noreferrer"
              className="w-full max-w-[32px]"
            >
              <Image
                src="/icons/instagram.png"
                className="wiggle-1"
                width={50}
                height={50}
                alt="instagram"
                loading="lazy"
              />
            </Link>
            <Link
              href={`mailto:${process.env.NEXT_PUBLIC_GMAIL}`}
              target="_blank"
              rel="noreferrer"
              className="w-full max-w-[32px]"
            >
              <Image
                src="/icons/gmail.png"
                className="wiggle-1"
                width={50}
                height={50}
                alt="gmail"
                loading="lazy"
              />
            </Link>
          </div>
        </div>

        <Divider
          size={2}
          border
        />
        <Divider size={4} />

        {/* Quote */}
        <div className="flex justify-center gap-21 lg:justify-between">
          <div className="flex w-full max-w-[640px] shrink-0">
            <Quote />
          </div>

          <div className="hidden flex-col lg:flex">
            <h3 className="text-xl font-bold">VỀ CHÚNG TÔI</h3>

            <p className="mt-2 font-body tracking-wider">
              Mona Edu là nền tảng giáo dục trực tuyến, cung cấp các khóa học chất lượng được reup từ các
              nguồn uy tín như Udemy, Coursera, LinkedIn Learning... và nhiều trang khác. Với chi phí hợp
              lý, chúng tôi giúp học sinh, sinh viên và người mới ra trường tiếp cận kiến thức chuyên môn
              và cơ hội nghề nghiệp. Khám phá Mona Edu để trải nghiệm học tập hiệu quả và thú vị hơn bao
              giờ hết!
            </p>
          </div>
        </div>

        <Divider size={4} />
        <Divider
          size={2}
          border
        />

        {/* Body */}
        <div className="grid grid-cols-12 justify-evenly gap-y-7 py-3 text-center sm:gap-x-7 md:text-left lg:flex lg:text-center">
          <div className="col-span-12 flex flex-col md:col-span-7 lg:hidden">
            <h3 className="text-xl font-bold">VỀ CHÚNG TÔI</h3>

            <p className="mt-2 font-body tracking-wider">
              Mona Edu là nền tảng giáo dục trực tuyến, cung cấp các khóa học chất lượng được reup từ các
              nguồn uy tín như Udemy, Coursera, LinkedIn Learning... và nhiều trang khác. Với chi phí hợp
              lý, chúng tôi giúp học sinh, sinh viên và người mới ra trường tiếp cận kiến thức chuyên môn
              và cơ hội nghề nghiệp. Khám phá Mona Edu để trải nghiệm học tập hiệu quả và thú vị hơn bao
              giờ hết!
            </p>
          </div>

          <div className="col-span-12 flex flex-col sm:col-span-6 md:col-span-3">
            <h3 className="text-center text-xl font-bold md:text-left">ƯU ĐIỂM</h3>

            <div className="mt-1.5 flex flex-col gap-3">
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Đa dạng khóa học
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Giá thành hợp lí
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Giao diện thân thiện
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Thường xuyên cập nhật
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Hỗ trợ nhanh chóng
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Thanh toán an toàn
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col sm:col-span-6 md:col-span-2">
            <h3 className="text-center text-xl font-bold md:text-left">LIÊN KẾT</h3>

            <div className="mt-1.5 flex flex-col gap-3 text-center md:text-left lg:text-center">
              <Link
                href="/about-us"
                className="trans-200 group flex items-center justify-center gap-1.5 font-body tracking-wide underline underline-offset-2 hover:tracking-wider md:justify-start"
              >
                <FaInfoCircle
                  size={14}
                  className="wiggle-0 flex-shrink-0"
                />
                Về chúng tôi
              </Link>
              <button
                className="trans-200 group flex items-center justify-center gap-1.5 font-body tracking-wide underline underline-offset-2 hover:tracking-wider md:justify-start"
                onClick={() => {
                  if (!curUser) {
                    toast.error('Vui lòng đăng nhập để kích hoạt khóa học')
                    return
                  }
                  dispatch(setOpenActivateCourse(true))
                }}
              >
                <MdOutlineRedeem
                  size={15}
                  className="wiggle-0 flex-shrink-0"
                />
                Kích hoạt khóa học
              </button>
              <Link
                href="/subscription"
                className="trans-200 group flex items-center justify-center gap-1.5 font-body tracking-wide underline underline-offset-2 hover:tracking-wider md:justify-start"
              >
                <RiVipCrown2Fill
                  size={14}
                  className="wiggle-0 flex-shrink-0"
                />
                Gói học viên
              </Link>
              <Link
                href="/cart"
                className="trans-200 group flex items-center justify-center gap-1.5 font-body tracking-wide underline underline-offset-2 hover:tracking-wider md:justify-start"
              >
                <FaShoppingCart
                  size={14}
                  className="wiggle-0 flex-shrink-0"
                />
                Giỏ hàng
              </Link>
              <Link
                href="/user/history"
                className="trans-200 group flex items-center justify-center gap-1.5 font-body tracking-wide underline underline-offset-2 hover:tracking-wider md:justify-start"
              >
                <FaHistory
                  size={14}
                  className="wiggle-0 flex-shrink-0"
                />
                Lịch sử mua hàng
              </Link>
              <Link
                href="/my-courses"
                className="trans-200 group flex items-center justify-center gap-1.5 font-body tracking-wide underline underline-offset-2 hover:tracking-wider md:justify-start"
              >
                <SiCoursera
                  size={14}
                  className="wiggle-0 flex-shrink-0"
                />
                Khóa học của tôi
              </Link>
              {curUser ? (
                <button
                  className="trans-200 group flex items-center justify-center gap-1 font-body tracking-wide text-yellow-400 hover:tracking-wider md:justify-start md:text-left lg:text-center"
                  onClick={() => signOut()}
                >
                  <FaSignOutAlt
                    size={15}
                    className="wiggle-0 flex-shrink-0"
                  />
                  Đăng xuất
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="trans-200 group flex items-center justify-center gap-1 font-body tracking-wide text-sky-400 hover:tracking-wider md:justify-start md:text-left lg:text-center"
                >
                  <FaSignInAlt
                    size={15}
                    className="wiggle-0 flex-shrink-0"
                  />
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>

        <Divider
          size={2}
          border
        />

        {/* MARK: Bottom */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center md:justify-between">
          <p className="text-[14px] transition-all duration-300 hover:tracking-wide">
            © <span className="font-semibold text-primary">Mona Edu</span>. All rights reserved
          </p>
          <div className="text-[14px] transition-all duration-300 hover:tracking-wide">
            <span className="font-semibold text-primary">Developed by</span> Nguyen Anh Khoa
          </div>
        </div>

        <Divider size={4} />
      </div>
    </footer>
  )
}

export default memo(Footer)
