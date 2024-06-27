'use client'

import CartItem from '@/components/CartItem'
import Divider from '@/components/Divider'
import { admins } from '@/constants'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICartItem } from '@/models/CartItemModel'
import { formatPrice } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaBookOpen } from 'react-icons/fa'
import { IoIosHelpCircle, IoMdArrowRoundBack } from 'react-icons/io'

function CheckoutPage({ params }: { params: { type: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [checkout, setCheckout] = useState<any>(null)

  // values
  const admin = admins[(process.env.NEXT_PUBLIC_ADMIN! as keyof typeof admins) || 'KHOA']
  const type: string = params.type

  // MARK: Get Data
  // get checkout from local storage
  useEffect(() => {
    // stop page loading initially
    dispatch(setPageLoading(false))

    const checkout = JSON.parse(localStorage.getItem('checkout') ?? 'null')

    if (!checkout) {
      // start page loading for redirecting
      dispatch(setPageLoading(true))
      toast.error('Đang quay lại giỏ hàng...')
      router.push('/cart')
    } else {
      setCheckout(checkout)
    }
  }, [router, dispatch])

  // handle copy
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép: ' + text)
  }, [])

  return (
    <div className='mt-24 grid grid-cols-1 lg:grid-cols-12 gap-21 text-dark px-21 mb-32'>
      {/* MARK: Payment info */}
      <div className='col-span-1 lg:col-span-7 order-2 lg:order-first bg-white bg-opacity-95 rounded-medium shadow-medium p-21'>
        {type === 'momo' ? (
          <h1 className='text-4xl text-[#a1396c] text-center font-semibold'>Thanh toán Momo</h1>
        ) : (
          <h1 className='text-4xl text-[#62b866] text-center font-semibold'>Thanh toán BANKING</h1>
        )}

        <div className='pt-4' />

        <p className='text-secondary font-semibold mb-2'>
          * Hãy chuyển vào tài khoản bên dưới với nội dung sau:{' '}
        </p>

        {type === 'momo' ? (
          <a href='https://me.momo.vn/anphashop'>
            Ấn vào link sau để chuyển nhanh:{' '}
            <span className='text-[#a1396c] underline'>Link thanh toán bằng Momo</span>
          </a>
        ) : (
          <a
            href={`https://dl.vietqr.io/pay?app=vcb&ba=1040587211@vcb&am=${checkout?.total}&tn=${checkout?.code}`}
          >
            Ấn vào link sau để chuyển nhanh:{' '}
            <span className='text-[#62b866] underline'>Link thanh toán bằng Vietcombank</span>
          </a>
        )}

        <div className='border border-slate-400 py-2 px-4 rounded-md'>
          {type === 'banking' && (
            <p>
              Ngân hàng:{' '}
              <span
                className='text-[#399162] font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.banking.name)}
              >
                {admin.banking.name}
              </span>
            </p>
          )}
          {type === 'momo' ? (
            <p>
              Số tài khoản Momo:{' '}
              <span
                className='text-[#a1396c] font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.momo.account)}
              >
                {admin.momo.account}
              </span>
            </p>
          ) : (
            <p>
              Số tài khoản:{' '}
              <span
                className='text-secondary font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.banking.account)}
              >
                {admin.banking.account}
              </span>
            </p>
          )}
          <p>
            Số tiền chuyển:{' '}
            <span
              className='text-green-500 font-semibold cursor-pointer'
              onClick={() => handleCopy(checkout?.total)}
            >
              {formatPrice(checkout?.total)}
            </span>
          </p>
          <p>
            Nội dung chuyển khoản:{' '}
            <span
              className='text-yellow-500 underline-offset-1 font-semibold cursor-pointer'
              onClick={() => handleCopy(checkout?.code)}
            >
              {checkout?.code}
            </span>
          </p>
        </div>
        <p className='flex items-center gap-1 text-slate-500 mb-1'>
          <IoIosHelpCircle size={20} /> Ấn để sao chép
        </p>

        <p className=''>
          Tài khoản sẽ được gửi cho bạn qua email:{' '}
          <span
            className='text-green-500 underline cursor-pointer'
            onClick={() => handleCopy(checkout?.email)}
          >
            {checkout?.email}
          </span>{' '}
          sau khi đã thanh toán.
        </p>

        <div className='flex justify-center mt-6'>
          <div className='relative rounded-lg shadow-medium duration-300 transition hover:-translate-y-2 overflow-hidden'>
            {type === 'momo' ? (
              <>
                <Image src={admin.momo.image} height={700} width={350} alt='momo-qr' />
                <Image
                  className='absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-[58%]'
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=2|99|${admin.momo.account}|||0|0|${checkout?.total}|${checkout?.code}|transfer_p2p`}
                  height={700}
                  width={350}
                  alt='momo-qr'
                />
                <Image
                  className='bg-[#333] absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-[50%] rounded-md p-1 w-[12%]'
                  src='/images/momo-icon.jpg'
                  height={42}
                  width={42}
                  alt='momo-qr'
                />
              </>
            ) : (
              <>
                <Image src={admin.banking.image} height={700} width={350} alt='banking-qr' />
                <Image
                  className='absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-[47%]'
                  src={`https://img.vietqr.io/image/970436-1040587211-eeua38J.jpg?amount=${
                    checkout?.total
                  }&addInfo=${encodeURI(checkout?.code)}&accountName=${admin.banking.receiver}`}
                  height={700}
                  width={350}
                  alt='banking-qr'
                />
              </>
            )}
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex lg:hidden justify-center flex-wrap mt-10 gap-x-21 gap-y-21/2 font-body tracking-wide'>
          <Link
            href={`/user/order/${checkout?.code}`}
            className='flex items-center justify-center gap-2 group rounded-lg px-21 py-3 bg-primary hover:bg-secondary hover:text-white common-transition'
            onClick={e => {
              if (!curUser?._id) {
                e.preventDefault()
                toast.error('Bạn cần có tài khoản để có thể xem thông tin đơn hàng ngay khi mua')
              } else {
                localStorage.removeItem('checkout')
              }
            }}
            title='Xem đơn hàng ngay'
          >
            <FaBookOpen size={18} className='wiggle mb-[-2px] flex-shrink-0' />
            <span className='text-ellipsis line-clamp-1'>Xem đơn hàng ngay</span>
          </Link>
          <a
            href={`/cart`}
            className='flex items-center justify-center gap-2 group rounded-lg px-21 py-3 bg-slate-300 hover:bg-secondary hover:text-white common-transition'
            title='Quay lại giỏ hàng'
            onClick={() => localStorage.removeItem('checkout')}
          >
            <IoMdArrowRoundBack size={18} className='wiggle mb-[-2px] flex-shrink-0' />
            <span className='text-ellipsis line-clamp-1'>Quay lại giỏ hàng</span>
          </a>
        </div>

        <Divider size={12} />
      </div>

      {/* MARK: Cart items */}
      <div className='col-span-1 lg:col-span-5'>
        <div className='sticky top-24 left-0 bg-white bg-opacity-95 rounded-medium shadow-medium p-21'>
          <h1 className='text-center font-semibold text-3xl'>Khóa học</h1>

          <Divider size={5} />

          <div>
            {checkout?.items.map((cartItem: ICartItem, index: number) => (
              <CartItem
                cartItem={cartItem}
                className={index != 0 ? 'mt-4' : ''}
                key={cartItem._id}
                isCheckout
              />
            ))}

            <Divider size={5} />

            <div className='rounded-lg shadow-lg bg-dark-100 text-white p-21'>
              {!!checkout?.discount && (
                <div className='flex justify-between'>
                  <span>Giảm giá</span>
                  <span className='font-semibold text-xl'>{formatPrice(checkout?.discount || 0)}</span>
                </div>
              )}

              {!!checkout?.discount && <Divider size={3} border />}

              <div className='flex items-center justify-between'>
                <span className='font-semobold'>Thành tiền</span>
                <span className='font-semibold tracking-wide text-3xl text-green-500 hover:tracking-wider trans-300'>
                  {formatPrice(checkout?.total || 0)}
                </span>
              </div>
            </div>

            {/* MARK: Action Buttons */}
            <div className='hidden sm:flex justify-center flex-wrap mt-6 gap-x-21 gap-y-21/2 font-body tracking-wide'>
              <Link
                href={`/user/order/${checkout?.code}`}
                className='flex items-center justify-center gap-2 group rounded-lg px-21 py-3 bg-primary hover:bg-secondary hover:text-white common-transition'
                onClick={e => {
                  if (!curUser?._id) {
                    e.preventDefault()
                    toast.error('Bạn cần có tài khoản để có thể xem thông tin đơn hàng ngay khi mua')
                  } else {
                    localStorage.removeItem('checkout')
                  }
                }}
                title='Xem đơn hàng ngay'
              >
                <FaBookOpen size={18} className='wiggle mb-[-2px] flex-shrink-0' />
                <span className='text-ellipsis line-clamp-1'>Xem đơn hàng ngay</span>
              </Link>
              <a
                href={`/cart`}
                className='flex items-center justify-center gap-2 group rounded-lg px-21 py-3 bg-slate-300 hover:bg-secondary hover:text-white common-transition'
                title='Quay lại giỏ hàng'
                onClick={() => localStorage.removeItem('checkout')}
              >
                <IoMdArrowRoundBack size={18} className='wiggle mb-[-2px] flex-shrink-0' />
                <span className='text-ellipsis line-clamp-1'>Quay lại giỏ hàng</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
