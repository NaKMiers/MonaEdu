'use client'

import Divider from '@/components/Divider'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IPackage } from '@/models/PackageModel'
import { createOrderApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { AnimatePresence, motion } from 'framer-motion'
import mongoose from 'mongoose'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheckSquare } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { CardSpotlight } from './effects/CartSpotlight'

interface PackageItemProps {
  pkg: IPackage
  className?: string
}

function PackageItem({ pkg, className = '' }: PackageItemProps) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [step, setStep] = useState<number>(1)

  // refs
  const timeoutRef = useRef<NodeJS.Timeout>()

  // validate before checkout
  const handleValidateBeforeCheckout = useCallback(() => {
    let isValid = true

    return isValid
  }, [])

  // handle checkout
  const handleCheckout = useCallback(
    async (paymentMethod: string) => {
      // validate before checkout
      if (!handleValidateBeforeCheckout()) return

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // handle confirm payment
        const items = [
          {
            _id: new mongoose.Types.ObjectId(),
            packageId: pkg,
          },
        ]

        // send request to server to create order
        const { code } = await createOrderApi({
          total: pkg.price,
          voucher: undefined,
          receivedUser: undefined,
          discount: undefined,
          items,
          paymentMethod,
          isPackage: true,
        })

        // create checkout
        const checkout = {
          code,
          email: curUser?.email,
          items: items.map(item => ({ ...item, courseId: item.packageId })),
          voucher: undefined,
          discount: undefined,
          receivedUser: undefined,
          total: pkg.price,
          isPackage: true,
        }

        // set checkout to local storage
        localStorage.setItem('checkout', JSON.stringify(checkout))

        // move to checkout page
        router.push(`/checkout/${paymentMethod}`)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    },
    [dispatch, handleValidateBeforeCheckout, curUser?.email, pkg, router]
  )

  return (
    <div className={`max-w-[400px] w-1/2 md:w-1/3 ${className}`}>
      <CardSpotlight className='flex flex-col min-h-[500px] w-full max-sm:p-21 bg-neutral-950 border rounded-none overflow-hidden'>
        <p className='text-xl font-bold relative z-20 mt-2 text-white'>{pkg.title}</p>

        <div className='text-neutral-200 mt-4 relative z-20'>
          <p className='text-ellipsis line-clamp-2'>{pkg.description}</p>
          {pkg.features.length > 0 && (
            <ul className='list-none mt-2'>
              {pkg.features.map((feature, index) => (
                <li className='flex gap-2 items-start' key={index}>
                  <FaCheckSquare />
                  <p className='text-white'>{feature}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Divider className='relative z-20' size={3} border />

        <p className='relative z-20'>Chỉ với {formatPrice(pkg.price)}</p>

        <div className='flex-1 flex items-end relative z-20 overflow-hidden'>
          <AnimatePresence>
            {step === 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='flex-shrink-0 flex items-center justify-between px-4 min-h-10 py-1 w-full rounded-3xl border border-neutral-700 bg-neutral-900 text-light font-semibold hover:bg-neutral-800 trans-300 group'
                onClick={() => {
                  setStep(2)
                  timeoutRef.current = setTimeout(() => {
                    setStep(1)
                  }, 3000)
                }}
              >
                <span className='text-sm font-body tracking-widest'>Đăng ký ngay</span>
                <FaArrowRightLong size={16} className='wiggle' />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='flex-shrink-0 w-full min-h-10 px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-light font-semibold hover:bg-neutral-800 trans-300 group'
              >
                <p className='text-neutral-300 text-center font-body tracking-wider mb-1'>
                  Thanh toán với
                </p>

                <div className='flex justify-center gap-3 select-none'>
                  <button
                    className='w-full flex items-center justify-center rounded-xl gap-2 border border-dark py-2 px-3 group hover:bg-dark-0 trans-200'
                    onClick={() => {
                      clearTimeout(timeoutRef.current!)
                      handleCheckout('momo')
                    }}
                  >
                    <Image
                      className='group-hover:border-white rounded-md border-2 wiggle-0'
                      src='/icons/momo-icon.jpg'
                      height={32}
                      width={32}
                      alt='Momo'
                    />
                    <span className='font-semibold group-hover:text-white'>Momo</span>
                  </button>

                  <button
                    className='w-full flex items-center justify-center rounded-xl gap-2 border border-dark py-2 px-3 group hover:bg-dark-0 trans-200'
                    onClick={() => {
                      clearTimeout(timeoutRef.current!)
                      handleCheckout('banking')
                    }}
                  >
                    <Image
                      className='wiggle-0'
                      src='/icons/banking-icon.jpg'
                      height={32}
                      width={32}
                      alt='Banking'
                    />
                    <span className='font-semibold group-hover:text-white'>Banking</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardSpotlight>
    </div>
  )
}

export default PackageItem
