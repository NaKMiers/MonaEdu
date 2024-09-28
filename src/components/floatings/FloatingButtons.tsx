'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useState } from 'react'
import { AiFillMessage } from 'react-icons/ai'
import { FaBoltLightning } from 'react-icons/fa6'
import { IoCloseSharp } from 'react-icons/io5'
import { RiAdvertisementFill, RiVipCrown2Fill } from 'react-icons/ri'
import Divider from '../Divider'

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
        className={`trans-300 fixed bottom-[140px] right-3 z-30 flex select-none flex-col items-center gap-2 overflow-hidden rounded-xl ${className}`}
      >
        <button
          className="group flex h-[44px] w-[44px] items-center justify-center rounded-xl border-2 border-light bg-dark-100"
          title="Ads"
          onClick={() => setOpenAds(true)}
        >
          <RiAdvertisementFill
            size={24}
            className={`wiggle trans-200 text-light`}
          />
        </button>

        {!curUser?.package && (
          <Link
            href="/subscription"
            className="group flex h-[44px] w-[44px] items-center justify-center rounded-xl border-2 border-light bg-dark-100"
            title="Gói học viên"
          >
            <RiVipCrown2Fill
              size={20}
              className={`wiggle trans-200 text-light`}
            />
          </Link>
        )}

        <Link
          href="/flash-sale"
          className="group flex h-[44px] w-[44px] items-center justify-center rounded-xl border-2 border-light bg-dark-100"
          title="Flash Sale"
        >
          <FaBoltLightning
            size={20}
            className={`wiggle trans-200 text-light`}
          />
        </Link>

        <button
          className="group flex h-[44px] w-[44px] items-center justify-center rounded-xl border-2 border-light bg-dark-100"
          title="Liên hệ"
          onClick={() => setOpenContact(true)}
        >
          <AiFillMessage
            size={20}
            className={`wiggle trans-200 text-light`}
          />
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
            className="fixed bottom-0 left-0 right-0 top-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-10"
            onClick={handleCloseAds}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="h-full w-full"
            >
              <button
                className="group absolute right-12 top-12 text-light"
                onClick={handleCloseAds}
              >
                <IoCloseSharp
                  size={30}
                  className="wiggle"
                />
              </button>
              <Image
                className="h-full w-full overflow-hidden object-contain shadow-lg"
                src={width > 0 && width < 768 ? '/sales/bigsale-mobile.png' : '/sales/bigsale.png'}
                width={2000}
                height={2000}
                alt="big-sale"
                loading="lazy"
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
            className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2"
            onClick={() => setOpenContact(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-full max-w-[500px] rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <h1 className="text-lg font-semibold tracking-wider">Liên hệ</h1>

              <Divider
                border
                size={2}
              />

              <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-8 py-2 xs:grid-cols-2 sm:grid-cols-4">
                <div className="flex items-center justify-center">
                  <Link
                    href={process.env.NEXT_PUBLIC_MESSENGER!}
                    target="_blank"
                    rel="noreferrer"
                    className="trans-300 group relative flex h-[60px] w-[100px] flex-col items-center justify-end rounded-2xl border-[3px] border-primary bg-dark-100 p-2 text-center shadow-lg"
                  >
                    <Image
                      src="/icons/messenger.jpg"
                      width={55}
                      height={55}
                      alt="messenger"
                      className="trans-300 absolute left-1/2 top-0 max-w-[55px] -translate-x-1/2 -translate-y-1/2 group-hover:top-[-10%]"
                    />
                    <span className="text-xs text-light">Messenger</span>
                  </Link>
                </div>
                <div className="flex items-center justify-center">
                  <Link
                    href={process.env.NEXT_PUBLIC_FACEBOOK!}
                    target="_blank"
                    rel="noreferrer"
                    className="trans-300 group relative flex h-[60px] w-[100px] flex-col items-center justify-end rounded-2xl border-[3px] border-primary bg-dark-100 p-2 text-center shadow-lg"
                  >
                    <Image
                      src="/icons/facebook.png"
                      width={55}
                      height={55}
                      alt="facebook"
                      className="trans-300 absolute left-1/2 top-0 max-w-[55px] -translate-x-1/2 -translate-y-1/2 group-hover:top-[-10%]"
                    />
                    <span className="text-xs text-light">Facebook</span>
                  </Link>
                </div>
                <div className="flex items-center justify-center">
                  <Link
                    href={process.env.NEXT_PUBLIC_INSTAGRAM!}
                    target="_blank"
                    rel="noreferrer"
                    className="trans-300 group relative flex h-[60px] w-[100px] flex-col items-center justify-end rounded-2xl border-[3px] border-primary bg-dark-100 p-2 text-center shadow-lg"
                  >
                    <Image
                      src="/icons/instagram.png"
                      width={55}
                      height={55}
                      alt="instagram"
                      className="trans-300 absolute left-1/2 top-0 max-w-[55px] -translate-x-1/2 -translate-y-1/2 group-hover:top-[-10%]"
                    />
                    <span className="text-xs text-light">Instagram</span>
                  </Link>
                </div>
                <div className="flex items-center justify-center">
                  <Link
                    href={`mailto:${process.env.NEXT_PUBLIC_GMAIL!}`}
                    target="_blank"
                    rel="noreferrer"
                    className="trans-300 group relative flex h-[60px] w-[100px] flex-col items-center justify-end rounded-2xl border-[3px] border-primary bg-dark-100 p-2 text-center shadow-lg"
                  >
                    <Image
                      src="/icons/gmail.png"
                      width={55}
                      height={55}
                      alt="gmail"
                      className="trans-300 absolute left-1/2 top-0 max-w-[55px] -translate-x-1/2 -translate-y-1/2 group-hover:top-[-10%]"
                    />
                    <span className="text-xs text-light">Gmail</span>
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
