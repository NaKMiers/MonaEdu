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
import { memo, useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheckSquare } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { CardSpotlight } from './effects/CartSpotlight'

interface PackageItemProps {
  pkg: IPackage
  className?: string
  popular?: boolean
}

function PackageItem({ pkg, popular = false, className = '' }: PackageItemProps) {
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
    async (paymentMethod: 'momo' | 'banking') => {
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

        setTimeout(() => {
          // stop page loading
          dispatch(setPageLoading(false))
        }, 1000)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
        // stop page loading
        dispatch(setPageLoading(false))
      } finally {
      }
    },
    [dispatch, handleValidateBeforeCheckout, curUser?.email, pkg, router]
  )

  return (
    <div className={`relative ${className}`}>
      {popular && (
        <div className="absolute right-0 top-0 z-20 rounded-bl-2xl bg-white pb-1.5 pl-4 pr-3 pt-0.5 text-sm font-semibold text-dark">
          Phổ biến
        </div>
      )}

      <CardSpotlight className="flex h-full min-h-[500px] w-full flex-col overflow-hidden rounded-none border bg-neutral-950 max-sm:p-21">
        <p className="relative z-20 mt-2 text-xl font-bold text-light">{pkg.title}</p>

        <div className="relative z-20 mt-4 text-neutral-200">
          <p className="line-clamp-2 text-ellipsis">{pkg.description}</p>
          {pkg.features.length > 0 && (
            <ul className="mt-2 list-none">
              {pkg.features.map((feature, index) => (
                <li
                  className="flex items-start gap-2"
                  key={index}
                >
                  <FaCheckSquare className="flex-shrink-0" />
                  <p className="text-light">{feature}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Divider
          className="relative z-20"
          size={3}
          border
        />

        <p className="relative z-20 text-light">
          Chỉ với <span className="font-semibold">{formatPrice(pkg.price)}</span>
        </p>

        <div className="relative z-20 flex flex-1 items-end overflow-hidden py-21">
          <AnimatePresence>
            {step === 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="trans-300 group flex min-h-10 w-full flex-shrink-0 items-center justify-between rounded-3xl border border-neutral-700 bg-neutral-900 px-4 py-1 font-semibold text-light hover:bg-neutral-800"
                onClick={() => {
                  setStep(2)
                  timeoutRef.current = setTimeout(() => {
                    setStep(1)
                  }, 5000)
                }}
              >
                <span className="font-body text-sm tracking-widest">Đăng ký ngay</span>
                <FaArrowRightLong
                  size={16}
                  className="wiggle"
                />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="trans-300 group min-h-10 w-full flex-shrink-0 rounded-xl border border-neutral-700 bg-neutral-900 px-2 py-2 font-semibold text-light hover:bg-neutral-800 md:px-4"
              >
                <p className="mb-1 text-center font-body tracking-wider text-neutral-300">
                  Thanh toán với
                </p>

                <div className="flex select-none flex-wrap justify-evenly gap-3">
                  <button
                    className="trans-200 group flex items-center justify-center gap-2 rounded-lg border border-dark px-3 py-2 hover:bg-dark-0"
                    onClick={() => {
                      clearTimeout(timeoutRef.current!)
                      handleCheckout('momo')
                    }}
                  >
                    <Image
                      className="wiggle-0 rounded-md border-2 group-hover:border-light"
                      src="/icons/momo-icon.jpg"
                      height={28}
                      width={28}
                      alt="Momo"
                    />
                    <span className="text-xs font-semibold group-hover:text-light">Momo</span>
                  </button>

                  <button
                    className="trans-200 group flex items-center justify-center gap-2 rounded-lg border border-dark px-3 py-2 hover:bg-dark-0"
                    onClick={() => {
                      clearTimeout(timeoutRef.current!)
                      handleCheckout('banking')
                    }}
                  >
                    <Image
                      className="wiggle-0"
                      src="/icons/banking-icon.jpg"
                      height={28}
                      width={28}
                      alt="Banking"
                    />
                    <span className="text-xs font-semibold group-hover:text-light">Banking</span>
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

export default memo(PackageItem)
