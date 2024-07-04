'use client'

import CartItem from '@/components/CartItem'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import SuggestedList from '@/components/SuggestedList'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setSelectedItems } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICartItem } from '@/models/CartItemModel'
import { ICourse } from '@/models/CourseModel'
import { IUser } from '@/models/UserModel'
import { IVoucher } from '@/models/VoucherModel'
import { applyVoucherApi, createOrderApi, findUserApi } from '@/requests'
import { applyFlashSalePrice, calcPercentage, formatPrice } from '@/utils/number'
import { getUserName } from '@/utils/string'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaShoppingCart } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'
import { RiCoupon2Fill, RiDonutChartFill } from 'react-icons/ri'

function CartPage() {
  // hooks
  const router = useRouter()
  const queryParams = useSearchParams()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // reducers
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  let cartItems = useAppSelector(state => state.cart.items)
  const selectedItems = useAppSelector(state => state.cart.selectedItems)

  // states
  const [subTotal, setSubTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

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

  // auto calc total, discount, subTotal
  useEffect(() => {
    const subTotal = selectedItems.reduce((total, cartItem) => {
      const item: any = cartItems.find(cI => cI._id === cartItem._id)

      return total + (applyFlashSalePrice(item?.courseId?.flashSale, item?.courseId.price) ?? 0)
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
  }, [selectedItems, voucher, cartItems])

  // auto select cart item
  useEffect(() => {
    const selectedItems = cartItems.filter(item =>
      queryParams.getAll('course').includes((item.courseId as ICourse)?.slug)
    )

    dispatch(setSelectedItems(selectedItems))
  }, [queryParams, cartItems, dispatch])

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
      setBuyAsGiftMessage(`Gift this course to "${getUserName(user)}"`)
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
          total,
          voucher: voucher?._id,
          receivedUser: foundUser?.email,
          discount,
          items,
          paymentMethod: type,
        })

        // create checkout
        const checkout = {
          code,
          email: curUser?.email,
          items,
          voucher,
          discount,
          receivedUser: foundUser,
          total,
        }
        localStorage.setItem('checkout', JSON.stringify(checkout))

        // move to checkout page
        router.push(`/checkout/${type}`)
      } catch (err: any) {
        console.log(err)
      }
    },
    [
      dispatch,
      handleValidateBeforeCheckout,
      router,
      curUser?.email,
      discount,
      foundUser,
      selectedItems,
      total,
      voucher,
    ]
  )

  return (
    <div className='md:-mt-[72px] md:pt-[72px] -mb-20 pb-20 px-21 bg-neutral-800 bg-opacity-75 text-light'>
      <Divider size={8} />

      <div className='max-w-1200 mx-auto min-h-screen grid grid-cols-3 gap-21 pb-16'>
        <div className='col-span-3 md:col-span-2'>
          <h1 className='flex items-center gap-2 font-semibold font-body text-3xl mb-2'>
            <FaShoppingCart size={30} className='wiggle' />
            <span>Giỏ hàng</span>
            <span>
              (<span className='text-primary font-normal'>{cartItems.length}</span>)
            </span>
          </h1>

          {/* MARK: Cart */}
          {cartItems.length ? (
            <div>
              <div className='flex items-center justify-end gap-2 pr-21 select-none'>
                <label htmlFor='selectAll' className='font-semibold cursor-pointer '>
                  {cartItems.length === selectedItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </label>
                <input
                  name='selectAll'
                  id='selectAll'
                  type='checkbox'
                  checked={cartItems.length === selectedItems.length}
                  onChange={() =>
                    cartItems.length === selectedItems.length
                      ? dispatch(setSelectedItems([]))
                      : dispatch(setSelectedItems(cartItems))
                  }
                  className='size-5 accent-primary   cursor-pointer'
                />
              </div>

              <div className='pt-4' />

              {cartItems.map((cartItem, index) => (
                <CartItem cartItem={cartItem} className={index != 0 ? 'mt-5' : ''} key={index} />
              ))}
            </div>
          ) : (
            <p className='text-center mt-3'>
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
        <div className='col-span-3 md:col-span-1 text-dark'>
          <div className='border-2 border-primary rounded-medium shadow-lg p-4 sticky lg:mt-[60px] top-[93px] bg-white overflow-auto'>
            {/* Voucher */}
            <div className='flex items-center gap-2 mb-2 overflow-hidden trans-200'>
              <Input
                id='code'
                label='Mã giảm giá'
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
                className={`rounded-2xl border py-2 px-3 text-nowrap h-[42px] flex-shrink-0 hover:bg-black trans-200 hover:text-white ${
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
                  'Áp dụng'
                )}
              </button>
            </div>
            {voucherMessage && (
              <p className={`${voucher ? 'text-green-500' : 'text-rose-500'} mb-2`}>{voucherMessage}</p>
            )}

            {/* Buy as a gift */}
            <div className='text-nowrap inline mb-2 font-body tracking-wider'>
              Bạn muốn tặng cho ai đó? (
              <button
                className='text-orange-600 hover:underline z-10'
                onClick={() => setIsShowGift(prev => !prev)}
              >
                ấn vào đây
              </button>
              )
            </div>

            <div
              className={`flex items-center gap-2 overflow-hidden trans-200 ${
                isShowGift ? 'max-h-[200px] mt-2 mb-2' : 'max-h-0'
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
                className={`rounded-2xl border py-2 px-3 text-nowrap h-[42px] flex-shrink-0 hover:bg-black trans-200 hover:text-white ${
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
                  'Tìm'
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
              <p>Chi tiết thanh toán</p>

              <Divider size={3} border />

              <div className='flex flex-col gap-2'>
                <div className='flex justify-between'>
                  <span>Tổng</span>
                  <span className='font-semibold text-xl'>{formatPrice(subTotal)}</span>
                </div>

                {discount > 0 && (
                  <div className='flex justify-between'>
                    <span>Giảm giá</span>
                    <span className='font-semibold text-xl'>{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <Divider size={3} border />

              <div className='flex items-center justify-between'>
                <span className='font-semobold'>Thành tiền</span>
                <span className='font-semibold tracking-wide text-3xl text-green-500 hover:tracking-wider trans-300'>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Divider border size={4} />

            {/* MARK: Payment Methods */}
            <div className='flex justify-center gap-3 select-none'>
              <button
                className={`w-full flex items-center justify-center rounded-xl gap-2 border border-dark py-2 px-3 group hover:bg-dark-0 trans-200 ${
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
                <span className='font-semibold group-hover:text-white'>Momo</span>
              </button>

              <button
                className={`w-full flex items-center justify-center rounded-xl gap-2 border border-dark py-2 px-3 group hover:bg-dark-0 trans-200 ${
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
                <span className='font-semibold group-hover:text-white'>Banking</span>
              </button>
            </div>
          </div>
        </div>

        {/* Suggest Courses */}
        <div className='col-span-3 mt-12'>
          <SuggestedList />
        </div>
      </div>
    </div>
  )
}

export default CartPage
