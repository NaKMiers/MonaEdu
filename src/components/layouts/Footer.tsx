'use client'

import Image from 'next/image'
import Link from 'next/link'
import Divider from '../Divider'
import { signOut } from 'next-auth/react'

function Footer() {
  return (
    <footer className='bg-dark-100 text-light opacity-95 border-t-2 rounded-t-[40px] border-slate-300 px-21 pt-3'>
      <div className='max-w-1200 mx-auto'>
        {/* Head */}
        <div className='flex items-center justify-between gap-21'>
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
                />
              </Link>
              <span className='font-body text-primary font-bold text-3xl'>MonaEdu</span>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
            <Link href='https://github.com/NaKMiers' target='_blank'>
              <Image
                src='/images/github-logo.png'
                className='wiggle-1 bg-white rounded-full'
                width={32}
                height={32}
                alt='github'
              />
            </Link>
            <Link href='mailto:cosanpha.omega@gmail.com' target='_blank'>
              <Image src='/images/gmail.png' className='wiggle-1' width={32} height={32} alt='gmail' />
            </Link>
          </div>
        </div>

        <Divider size={2} border />

        {/* Body */}
        <div className='grid grid-cols-1 md:grid-cols-12 py-3 gap-7 text-center md:text-left'>
          <div className='flex flex-col col-span-7'>
            <h3 className='font-bold text-xl'>VỀ CHÚNG TÔI</h3>

            <p className='font-body tracking-wider mt-2'>
              Mona Edu brings you online learning solutions, studying online at home at an economical
              cost. best. This is suitable for those whose finances are still tight and limited
              (students, real trainees, new graduates,...) but can still participate in top value courses
              to Develop professional skills and develop your career. If you want to save more on your
              investment If you are interested in learning, Mona Edu is the ideal destination for you.
            </p>
          </div>

          <div className='flex flex-col col-span-3'>
            <h3 className='font-bold text-xl'>LIÊN KẾT</h3>

            <div className='flex flex-col gap-2 text-left'>
              <Link
                href='/categories'
                className='hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide'
              >
                Danh Mục
              </Link>
              <Link
                href='/forum'
                className='hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide'
              >
                Diễn Đàn
              </Link>
              <Link
                href='/flash-sale'
                className='hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide'
              >
                Đang giảm giá
              </Link>
              <Link
                href='/cart'
                className='hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide'
              >
                Giỏ hàng
              </Link>
              <Link
                href='/setting'
                className='hover:tracking-wider trans-200 underline underline-offset-2 font-body tracking-wide'
              >
                Cài Đặt
              </Link>
              <button
                className='text-left text-yellow-400 hover:tracking-wider trans-200 font-body tracking-wide'
                onClick={() => signOut()}
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <div className='flex flex-col col-span-2 items-center md:items-start'>
            <h3 className='font-bold text-xl'>CHỨNG NHẬN</h3>

            <ul className='mt-2'>
              <li className='hover:tracking-wider trans-300 py-1'>
                <Image
                  src='/images/certificate-1.png'
                  width={130}
                  height={130}
                  className='object-contain'
                  alt='certificate'
                />
              </li>
              <li className='hover:tracking-wider trans-300 py-1'>
                <Image
                  src='/images/certificate-2.png'
                  width={130}
                  height={130}
                  className='object-contain'
                  alt='certificate'
                />
              </li>
            </ul>
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

export default Footer
