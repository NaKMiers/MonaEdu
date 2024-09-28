'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useState } from 'react'
import { AiFillMessage } from 'react-icons/ai'
import { FaBoltLightning } from 'react-icons/fa6'
import { RiAdvertisementFill, RiVipCrown2Fill } from 'react-icons/ri'
import Divider from '../Divider'
import { IoCloseSharp } from 'react-icons/io5'

interface FloatingButtonsProps {
  className?: string
}

function FloatingButtons({ className = '' }: FloatingButtonsProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  const [width, setWidth] = useState<number>(0)

  // states
  const [openContact, setOpenContact] = useState<boolean>(false)
  const [openAds, setOpenAds] = useState<boolean>(false)

  // set width
  useEffect(() => {
    // handle resize
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    // initial width
    setWidth(window.innerWidth)

    // add event listener
    window.addEventListener('resize', handleResize)

    // remove event listener
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // auto show ads
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('openAds') || '{"timeLeft": 2}').timeLeft > 0) {
      setTimeout(() => {
        setOpenAds(true)
      }, 8000)
    }
  }, [])

  // handle close ads
  const handleCloseAds = useCallback(() => {
    const string = localStorage.getItem('openAds')
    if (string) {
      const data = JSON.parse(string)
      if (data.timeLeft > 0) {
        data.timeLeft = data.timeLeft - 1
        localStorage.setItem('openAds', JSON.stringify(data))
      }
    } else {
      localStorage.setItem('openAds', JSON.stringify({ timeLeft: 2 }))
    }
    setOpenAds(false)
  }, [])

  return (
    <>
      <div
        className={`fixed z-30 right-3 bottom-[140px] flex flex-col gap-2 items-center rounded-xl trans-300 overflow-hidden select-none ${className}`}
      >
        {!curUser?.package && (
          <Link
            href='/subscription'
            className='group flex items-center justify-center h-[44px] w-[44px] border-2 bg-dark-100 border-light rounded-xl'
            title='Gói học viên'
          >
            <RiVipCrown2Fill size={20} className={`text-light wiggle trans-200`} />
          </Link>
        )}

        <button
          className='group flex items-center justify-center h-[44px] w-[44px] border-2 bg-dark-100 border-light rounded-xl'
          title='Ads'
          onClick={() => setOpenAds(true)}
        >
          <RiAdvertisementFill size={24} className={`text-light wiggle trans-200`} />
        </button>

        <Link
          href='/flash-sale'
          className='group flex items-center justify-center h-[44px] w-[44px] border-2 bg-dark-100 border-light rounded-xl'
          title='Flash Sale'
        >
          <FaBoltLightning size={20} className={`text-light wiggle trans-200`} />
        </Link>

        <button
          className='group flex items-center justify-center h-[44px] w-[44px] border-2 bg-dark-100 border-light rounded-xl'
          title='Liên hệ'
          onClick={() => setOpenContact(true)}
        >
          <AiFillMessage size={20} className={`text-light wiggle trans-200`} />
        </button>
      </div>

      {/* Ads Modal */}
      <AnimatePresence>
        {openAds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='fixed z-[60] top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center p-10'
            onClick={handleCloseAds}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='h-full w-full'
            >
              <button className='absolute top-12 right-12 group text-light' onClick={handleCloseAds}>
                <IoCloseSharp size={30} className='wiggle' />
              </button>
              <Image
                className='w-full h-full object-contain overflow-hidden shadow-lg'
                src={width > 0 && width < 768 ? '/sales/bigsale-mobile.png' : '/sales/bigsale.png'}
                width={2000}
                height={2000}
                alt='big-sale'
                loading='lazy'
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {openContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed z-50 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center px-2'
            onClick={() => setOpenContact(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='w-full max-w-[500px] rounded-medium shadow-medium bg-white p-21'
              onClick={e => e.stopPropagation()}
            >
              <h1 className='font-semibold tracking-wider text-lg'>Liên hệ</h1>

              <Divider border size={2} />

              <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 py-2 gap-x-4 gap-y-8 mt-8'>
                <div className='flex items-center justify-center'>
                  <Link
                    href={process.env.NEXT_PUBLIC_MESSENGER!}
                    target='_blank'
                    rel='noreferrer'
                    className='w-[100px] flex flex-col items-center justify-end relative h-[60px] p-2 text-center bg-dark-100 border-[3px] border-primary rounded-2xl trans-300 shadow-lg group'
                  >
                    <Image
                      src='/icons/messenger.jpg'
                      width={55}
                      height={55}
                      alt='messenger'
                      className='max-w-[55px] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 trans-300 group-hover:top-[-10%]'
                    />
                    <span className='text-xs text-light'>Messenger</span>
                  </Link>
                </div>
                <div className='flex items-center justify-center'>
                  <Link
                    href={process.env.NEXT_PUBLIC_FACEBOOK!}
                    target='_blank'
                    rel='noreferrer'
                    className='w-[100px] flex flex-col items-center justify-end relative h-[60px] p-2 text-center bg-dark-100 border-[3px] border-primary rounded-2xl trans-300 shadow-lg group'
                  >
                    <Image
                      src='/icons/facebook.png'
                      width={55}
                      height={55}
                      alt='facebook'
                      className='max-w-[55px] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 trans-300 group-hover:top-[-10%]'
                    />
                    <span className='text-xs text-light'>Facebook</span>
                  </Link>
                </div>
                <div className='flex items-center justify-center'>
                  <Link
                    href={process.env.NEXT_PUBLIC_INSTAGRAM!}
                    target='_blank'
                    rel='noreferrer'
                    className='w-[100px] flex flex-col items-center justify-end relative h-[60px] p-2 text-center bg-dark-100 border-[3px] border-primary rounded-2xl trans-300 shadow-lg group'
                  >
                    <Image
                      src='/icons/instagram.png'
                      width={55}
                      height={55}
                      alt='instagram'
                      className='max-w-[55px] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 trans-300 group-hover:top-[-10%]'
                    />
                    <span className='text-xs text-light'>Instagram</span>
                  </Link>
                </div>
                <div className='flex items-center justify-center'>
                  <Link
                    href={`mailto:${process.env.NEXT_PUBLIC_GMAIL!}`}
                    target='_blank'
                    rel='noreferrer'
                    className='w-[100px] flex flex-col items-center justify-end relative h-[60px] p-2 text-center bg-dark-100 border-[3px] border-primary rounded-2xl trans-300 shadow-lg group'
                  >
                    <Image
                      src='/icons/gmail.png'
                      width={55}
                      height={55}
                      alt='gmail'
                      className='max-w-[55px] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 trans-300 group-hover:top-[-10%]'
                    />
                    <span className='text-xs text-light'>Gmail</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(FloatingButtons)
