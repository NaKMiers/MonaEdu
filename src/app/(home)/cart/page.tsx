'use client'

import CartItem from '@/components/CartItem'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setSelectedItems } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICartItem } from '@/models/CartItemModel'
import { ICourse } from '@/models/CourseModel'
import { IUser } from '@/models/UserModel'
import { IVoucher } from '@/models/VoucherModel'
import { applyVoucherApi, createOrderApi, findUserApi } from '@/requests'
import { applyFlashSalePrice, calcPercentage, formatPrice } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCartShopping } from 'react-icons/fa6'
import { IoMail } from 'react-icons/io5'
import { RiCoupon2Fill, RiDonutChartFill } from 'react-icons/ri'

function CartPage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  let cartItems = useAppSelector(state => state.cart.items)
  const selectedItems = useAppSelector(state => state.cart.selectedItems)
  const queryParams = useSearchParams()
  // const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [subTotal, setSubTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [cartLength, setCartlength] = useState<number>(0)
  const [items, setItems] = useState<ICartItem[]>([])

  // voucher states
  const [isShowVoucher, setIsShowVoucher] = useState<boolean>(false)
  const [voucher, setVoucher] = useState<IVoucher | null>(null)
  const [voucherMessage, setVoucherMessage] = useState<string>('')
  const [applyingVoucher, setApplyingVoucher] = useState<boolean>(false)

  // gift states
  const [isShowGift, setIsShowGift] = useState<boolean>(false)
  const [findingUser, setFindingUser] = useState<boolean>(false)
  const [buyAsGiftMessage, setBuyAsGiftMessage] = useState<string>('')
  const [foundUser, setFoundUser] = useState<IUser | null>(null)

  // loading and showing
  const [isBuying, setIsBuying] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      code: '',
    },
  })

  // MARK: Auto functions
  // auto get cart length
  useEffect(() => {
    // stop page loading
    dispatch(setPageLoading(false))

    if (curUser) {
      setCartlength(cartItems.reduce((total, item) => total + item.quantity, 0))
      setItems(cartItems)
    }
  }, [cartItems, curUser, dispatch])

  // auto calc total, discount, subTotal
  useEffect(() => {
    const subTotal = selectedItems.reduce((total, cartItem) => {
      const item: any = items.find(cI => cI._id === cartItem._id)

      return (
        total +
        (item?.quantity ?? 0) * (applyFlashSalePrice(item?.product.flashsale, item?.product.price) ?? 0)
      )
    }, 0)
    setSubTotal(subTotal)

    let finalTotal = subTotal
    let discount = 0
    if (voucher) {
      if (voucher.type === 'fixed-reduce') {
        discount = +voucher.value
        finalTotal = subTotal + discount < 0 ? 0 : subTotal + discount
      } else if (voucher.type === 'fixed') {
        discount = +voucher.value
        finalTotal = discount
      } else if (voucher.type === 'percentage') {
        discount = +calcPercentage(voucher.value, subTotal)
        if (Math.abs(discount) > voucher.maxReduce) {
          discount = -voucher.maxReduce
        }
        finalTotal = subTotal + discount < 0 ? 0 : subTotal + discount
      }
    }
    setDiscount(discount)
    setTotal(finalTotal)
  }, [selectedItems, voucher, items])

  // auto select cart item
  useEffect(() => {
    const selectedItems = items.filter(item =>
      queryParams.getAll('course').includes((item.courseId as ICourse).slug)
    )

    dispatch(setSelectedItems(selectedItems))
  }, [queryParams, items, dispatch])

  // send request to server to check voucher
  const handleApplyVoucher: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // check user
      if (!curUser?._id) {
        toast.error('User not found!')
        return
      }

      // start applying
      setApplyingVoucher(true)

      try {
        // send request to server
        const { voucher, message } = await applyVoucherApi(data.code, curUser?.email, subTotal)

        // set voucher to state
        setVoucher(voucher)
        setVoucherMessage(message)

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        const { message } = err
        toast.error(message)
        setVoucherMessage(message)
      } finally {
        // stop applying
        setApplyingVoucher(false)
      }
    },
    [subTotal, curUser]
  )

  // send request to server to check voucher
  const handleFindUser: SubmitHandler<FieldValues> = useCallback(async data => {
    // start finding user
    setFindingUser(true)

    try {
      // send request to server
      const { user } = await findUserApi(data.receivedEmail)

      // set found user
      setFoundUser(user)
      setBuyAsGiftMessage(
        `Gift this course to ${
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username || user.email
        }`
      )
    } catch (err: any) {
      console.log(err)
      const { message } = err
      toast.error(message)
      setBuyAsGiftMessage(message)
    } finally {
      // stop finding user
      setFindingUser(false)
    }
  }, [])

  // validate before checkout
  const handleValidateBeforeCheckout = useCallback(() => {
    let isValid = true
    if (!selectedItems.length || !total) {
      toast.error('Hãy chọn sản phẩm để tiến hành thanh toán')
      isValid = false
    }

    return isValid
  }, [selectedItems.length, total])

  // MARK: Checkout
  // handle checkout
  const handleCheckout = useCallback(
    async (type: string) => {
      // validate before checkout
      if (!handleValidateBeforeCheckout()) return

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // handle confirm payment
        const items = (selectedItems as any).map((cartItem: ICartItem) => ({
          _id: cartItem._id,
          courseId: cartItem.courseId,
        }))

        // send request to server to create order
        const { code } = await createOrderApi({
          email: curUser?.email || getValues('email'),
          total,
          voucherApplied: 'aaaaa',
          receivedUser: 'aaaaa',
          discount,
          item: items,
          paymentMethod: type,
        })

        // create checkout
        const checkout = {
          items,
          code,
          email: curUser?.email || getValues('email'),
          voucher,
          discount,
          total,
        }
        localStorage.setItem('checkout', JSON.stringify(checkout))

        // move to checkout page
        // router.push(`/checkout/${type}`)
      } catch (err: any) {
        console.log(err)
      }
    },
    [dispatch, getValues, handleValidateBeforeCheckout, selectedItems, voucher, discount, total, curUser]
  )

  return (
    <div className='max-w-1200 mx-auto px-21 mb-20 mt-24 min-h-screen grid grid-cols-3 gap-21 bg-white rounded-medium shadow-medium p-8 pb-16 text-dark'>
      <div className='col-span-3 lg:col-span-2'>
        <h1 className='flex items-center gap-2 font-semibold font-body text-3xl'>
          <FaCartShopping size={30} className='text-dark wiggle' />
          <span>Giỏ hàng</span>
          <span>
            (<span className='text-primary font-normal'>{cartLength}</span>)
          </span>
        </h1>

        {/* MARK: Cart */}
        {items.length ? (
          <div>
            <div className='flex items-center justify-end gap-2 pr-21 select-none'>
              <label htmlFor='selectAll' className='font-semibold cursor-pointer '>
                {items.length === selectedItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </label>
              <input
                name='selectAll'
                id='selectAll'
                type='checkbox'
                checked={items.length === selectedItems.length}
                onChange={() =>
                  items.length === selectedItems.length
                    ? dispatch(setSelectedItems([]))
                    : dispatch(setSelectedItems(items))
                }
                className='size-5 accent-primary   cursor-pointer'
              />
            </div>

            <div className='pt-4' />

            {items.map((cartItem, index) => (
              <CartItem cartItem={cartItem} className={index != 0 ? 'mt-5' : ''} key={index} />
            ))}
          </div>
        ) : (
          <p className='text-center'>
            Chưa có sản phẩm nào trong giỏ hàng của hàng. Hãy ấn vào{' '}
            <Link href='/' prefetch={false} className='text-sky-500 underline'>
              đây
            </Link>{' '}
            để bắt đầu mua hàng.{' '}
            <Link href='/' prefetch={false} className='text-sky-500 underline italic'>
              Quay lại
            </Link>
          </p>
        )}
      </div>

      {/* MARK: Summary */}
      <div className='col-span-3 lg:col-span-1'>
        <div className='border-2 border-primary rounded-medium shadow-lg p-4 sticky  lg:mt-[60px] top-[88px] bg-sky-50 overflow-auto'>
          {/* Voucher */}
          <div className='mb-2'>
            You have a voucher?{' '}
            <p className='text-nowrap inline'>
              (
              <button
                className='text-sky-600 hover:underline z-10'
                onClick={() => setIsShowVoucher(prev => !prev)}
              >
                click here
              </button>
              )
            </p>
          </div>

          <div
            className={`flex items-center gap-2 mb-2 overflow-hidden trans-200 ${
              isShowVoucher ? 'max-h-[200px]' : 'max-h-0'
            }`}
          >
            <Input
              id='code'
              label='Voucher'
              disabled={applyingVoucher}
              register={register}
              errors={errors}
              type='text'
              icon={RiCoupon2Fill}
              onFocus={() => {
                clearErrors('code')
                setVoucherMessage('')
              }}
              className='w-full'
            />
            <button
              className={`rounded-lg border py-2 px-3 text-nowrap h-[42px] flex-shrink-0 hover:bg-black trans-200 hover:text-white ${
                applyingVoucher
                  ? 'border-slate-200 bg-slate-200 pointer-events-none'
                  : 'border-dark text-dark '
              }`}
              onClick={handleSubmit(handleApplyVoucher)}
              disabled={applyingVoucher}
            >
              {applyingVoucher ? (
                <RiDonutChartFill size={26} className='animate-spin text-slate-300' />
              ) : (
                'Apply'
              )}
            </button>
          </div>
          {voucherMessage && (
            <p className={`${voucher ? 'text-green-500' : 'text-rose-500'} mb-2`}>{voucherMessage}</p>
          )}

          {/* Buy as a gift */}
          <div className='mb-2'>
            You want to gift to someone?{' '}
            <p className='text-nowrap inline'>
              (
              <button
                className='text-orange-600 hover:underline z-10'
                onClick={() => setIsShowGift(prev => !prev)}
              >
                click here
              </button>
              )
            </p>
          </div>

          <div
            className={`flex items-center gap-2 mb-2 overflow-hidden trans-200 ${
              isShowGift ? 'max-h-[200px]' : 'max-h-0'
            }`}
          >
            <Input
              id='receivedEmail'
              label='Email'
              disabled={findingUser}
              register={register}
              errors={errors}
              type='text'
              icon={IoMail}
              onFocus={() => {
                clearErrors('receivedEmail')
                setBuyAsGiftMessage('')
              }}
              className='w-full'
            />
            <button
              className={`rounded-lg border py-2 px-3 text-nowrap h-[42px] flex-shrink-0 hover:bg-black trans-200 hover:text-white ${
                findingUser
                  ? 'border-slate-200 bg-slate-200 pointer-events-none'
                  : 'border-dark text-dark '
              }`}
              onClick={handleSubmit(handleFindUser)}
              disabled={findingUser}
            >
              {findingUser ? (
                <RiDonutChartFill size={26} className='animate-spin text-slate-300' />
              ) : (
                'Find'
              )}
            </button>
          </div>
          {buyAsGiftMessage && (
            <p className={`${foundUser ? 'text-green-500' : 'text-rose-500'} mb-2`}>
              {buyAsGiftMessage}
            </p>
          )}

          <Divider size={2} />

          {/* Payment Detail */}
          <div className='rounded-lg shaodow-lg bg-dark-100 text-white p-21'>
            <p>Payment Detail</p>

            <Divider size={3} border />

            <div className='flex flex-col gap-2'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span className='font-semibold text-xl'>{formatPrice(subTotal)}</span>
              </div>

              <div className='flex justify-between'>
                <span>Discount</span>
                <span className='font-semibold text-xl'>{formatPrice(discount)}</span>
              </div>
            </div>

            <Divider size={3} border />

            <div className='flex items-center justify-between'>
              <span className='font-semobold'>Total</span>
              <span className='font-semibold tracking-wide text-3xl text-green-500 hover:tracking-wider trans-300'>
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <Divider border size={4} />

          {/* MARK: Payment Methods */}
          <div className='flex flex-col gap-3 select-none'>
            <button
              className={`flex items-center justify-center rounded-xl gap-2 border border-[#a1396c] py-2 px-3 group hover:bg-[#a1396c] common-transition ${
                isBuying || isLoading ? 'pointer-events-none' : ''
              }`}
              onClick={() => handleCheckout('momo')}
              disabled={isBuying || isLoading}
            >
              <Image
                className='group-hover:border-white rounded-md border-2 wiggle-0'
                src='/images/momo-icon.jpg'
                height={32}
                width={32}
                alt='logo'
              />
              <span className='font-semibold group-hover:text-white'>Mua nhanh với Momo</span>
            </button>

            <button
              className={`flex items-center justify-center rounded-xl gap-2 border border-[#62b866] py-2 px-3 group hover:bg-[#62b866] common-transition ${
                isBuying || isLoading ? 'pointer-events-none' : ''
              }`}
              onClick={() => handleCheckout('banking')}
              disabled={isBuying || isLoading}
            >
              <Image
                className='wiggle-0'
                src='/images/banking-icon.jpg'
                height={32}
                width={32}
                alt='logo'
              />
              <span className='font-semibold group-hover:text-white'>Mua ngay với Banking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
