'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import { FaCheck, FaHistory, FaInfoCircle, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa'
import { SiCoursera } from 'react-icons/si'
import Divider from '../Divider'
import Quote from '../Quote'
import { RiVipCrown2Fill } from 'react-icons/ri'

function Footer() {
  return (
    <footer className='mb-[72px] md:mb-0 bg-dark-100 text-light border-t-2 rounded-t-[40px] border-slate-300 px-21 pt-3 overflow-hidden'>
      <div className='max-w-1200 mx-auto'>
        {/* Head */}
        <div className='flex items-center justify-between flex-wrap gap-x-21'>
          {/* Brand */}
          <div className='flex items-center gap-4 py-3'>
            <div className='flex items-center gap-2'>
              <Link
                href='/'
                className='w-[40px] h-[40px] aspect-square rounded-lg shadow-lg overflow-hidden'
              >
                <Image
                  className='w-full h-full object-cover'
                  src='/images/logo.png'
                  width={60}
                  height={60}
                  alt='github'
                  loading='lazy'
                />
              </Link>
              <span className='font-body text-primary font-bold text-3xl'>MonaEdu</span>
            </div>
          </div>

          {/* Contact */}
          <div id='contact' className='flex items-center gap-x-4 gap-y-2'>
            <Link
              href={process.env.NEXT_PUBLIC_MESSENGER!}
              target='_blank'
              rel='noreferrer'
              className='max-w-[32px] w-full'
            >
              <Image
                src='/icons/messenger.jpg'
                className='wiggle-1'
                width={50}
                height={50}
                alt='messenger'
                loading='lazy'
              />
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_FACEBOOK!}
              target='_blank'
              rel='noreferrer'
              className='max-w-[32px] w-full'
            >
              <Image
                src='/icons/facebook.png'
                className='wiggle-1'
                width={50}
                height={50}
                alt='gmail'
                loading='lazy'
              />
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_INSTAGRAM!}
              target='_blank'
              rel='noreferrer'
              className='max-w-[32px] w-full'
            >
              <Image
                src='/icons/instagram.png'
                className='wiggle-1'
                width={50}
                height={50}
                alt='instagram'
                loading='lazy'
              />
            </Link>
            <Link
              href={`mailto:${process.env.NEXT_PUBLIC_GMAIL}`}
              target='_blank'
              rel='noreferrer'
              className='max-w-[32px] w-full'
            >
              <Image
                src='/icons/gmail.png'
                className='wiggle-1'
                width={50}
                height={50}
                alt='gmail'
                loading='lazy'
              />
            </Link>
          </div>
        </div>

        <Divider size={2} border />
        <Divider size={4} />

        {/* Quote */}
        <div className='flex gap-21 justify-center lg:justify-between'>
          <div className='flex shrink-0 max-w-[640px] w-full'>
            <Quote />
          </div>

          <div className='hidden lg:flex flex-col'>
            <h3 className='font-bold text-xl'>VỀ CHÚNG TÔI</h3>

            <p className='font-body tracking-wider mt-2'>
              Mona Edu là nền tảng giáo dục trực tuyến, cung cấp các khóa học chất lượng được reup từ các
              nguồn uy tín như Udemy, Coursera, LinkedIn Learning... và nhiều trang khác. Với chi phí hợp
              lý, chúng tôi giúp học sinh, sinh viên và người mới ra trường tiếp cận kiến thức chuyên môn
              và cơ hội nghề nghiệp. Khám phá Mona Edu để trải nghiệm học tập hiệu quả và thú vị hơn bao
              giờ hết!
            </p>
          </div>
        </div>

        <Divider size={4} />
        <Divider size={2} border />

        {/* Body */}
        <div className='grid lg:flex justify-evenly grid-cols-12 py-3 gap-y-7 sm:gap-x-7 text-center md:text-left lg:text-center'>
          <div className='flex lg:hidden flex-col col-span-12 md:col-span-7'>
            <h3 className='font-bold text-xl'>VỀ CHÚNG TÔI</h3>

            <p className='font-body tracking-wider mt-2'>
              Mona Edu là nền tảng giáo dục trực tuyến, cung cấp các khóa học chất lượng được reup từ các
              nguồn uy tín như Udemy, Coursera, LinkedIn Learning... và nhiều trang khác. Với chi phí hợp
              lý, chúng tôi giúp học sinh, sinh viên và người mới ra trường tiếp cận kiến thức chuyên môn
              và cơ hội nghề nghiệp. Khám phá Mona Edu để trải nghiệm học tập hiệu quả và thú vị hơn bao
              giờ hết!
            </p>
          </div>

          <div className='flex flex-col col-span-12 sm:col-span-6 md:col-span-3'>
            <h3 className='font-bold text-xl'>ƯU ĐIỂM</h3>

            <div className='flex flex-col gap-3 mt-1.5'>
              <div className='flex gap-2 items-center justify-center md:justify-start lg:justify-center hover:tracking-wider trans-200 font-body tracking-wide'>
                <FaCheck className='text-green-400' />
                Đa dạng khóa học
              </div>
              <div className='flex gap-2 items-center justify-center md:justify-start lg:justify-center hover:tracking-wider trans-200 font-body tracking-wide'>
                <FaCheck className='text-green-400' />
                Giá thành hợp lí
              </div>
              <div className='flex gap-2 items-center justify-center md:justify-start lg:justify-center hover:tracking-wider trans-200 font-body tracking-wide'>
                <FaCheck className='text-green-400' />
                Giao diện thân thiện
              </div>
              <div className='flex gap-2 items-center justify-center md:justify-start lg:justify-center hover:tracking-wider trans-200 font-body tracking-wide'>
                <FaCheck className='text-green-400' />
                Thường xuyên cập nhật
              </div>
              <div className='flex gap-2 items-center justify-center md:justify-start lg:justify-center hover:tracking-wider trans-200 font-body tracking-wide'>
                <FaCheck className='text-green-400' />
                Hỗ trợ nhanh chóng
              </div>
              <div className='flex gap-2 items-center justify-center md:justify-start lg:justify-center hover:tracking-wider trans-200 font-body tracking-wide'>
                <FaCheck className='text-green-400' />
                Thanh toán an toàn
              </div>
            </div>
          </div>

          <div className='flex flex-col col-span-12 sm:col-span-6 md:col-span-2'>
            <h3 className='font-bold text-xl'>LIÊN KẾT</h3>

            <div className='flex flex-col gap-3 text-center md:text-left lg:text-center mt-1.5'>
              <Link
                href='/about-us'
                className='flex justify-center items-center gap-1.5 hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide group'
              >
                <FaInfoCircle size={14} className='wiggle-0 flex-shrink-0' />
                Về chúng tôi
              </Link>
              <Link
                href='/subscription'
                className='flex justify-center items-center gap-1.5 hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide group'
              >
                <RiVipCrown2Fill size={14} className='wiggle-0 flex-shrink-0' />
                Gói học viên
              </Link>
              <Link
                href='/cart'
                className='flex justify-center items-center gap-1.5 hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide group'
              >
                <FaShoppingCart size={14} className='wiggle-0 flex-shrink-0' />
                Giỏ hàng
              </Link>
              <Link
                href='/user/history'
                className='flex justify-center items-center gap-1.5 hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide group'
              >
                <FaHistory size={14} className='wiggle-0 flex-shrink-0' />
                Lịch sử mua hàng
              </Link>
              <Link
                href='/my-courses'
                className='flex justify-center items-center gap-1.5 hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide group'
              >
                <SiCoursera size={14} className='wiggle-0 flex-shrink-0' />
                Khóa học của tôi
              </Link>
              <button
                className='flex items-center justify-center gap-1 md:text-left lg:text-center text-yellow-400 hover:tracking-wider trans-200 font-body tracking-wide group'
                onClick={() => signOut()}
              >
                <FaSignOutAlt size={15} className='wiggle-0 flex-shrink-0' />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <Divider size={2} border />

        {/* MARK: Bottom */}
        <div className='flex flex-wrap items-center justify-center md:justify-between gap-x-5 gap-y-1 text-center'>
          <p className='text-[14px] transition-all duration-300 hover:tracking-wide'>
            © <span className='text-primary font-semibold'>Mona Edu</span>. All rights reserved
          </p>
          <Link
            href='https://anhkhoa.info'
            className='text-[14px] transition-all duration-300 hover:tracking-wide'
          >
            <span className='text-primary font-semibold'>Developed by</span> Nguyen Anh Khoa
          </Link>
        </div>

        <Divider size={4} />
      </div>
    </footer>
  )
}

export default memo(Footer)
