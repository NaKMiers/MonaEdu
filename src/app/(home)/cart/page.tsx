'use client'

import CartItem from '@/components/CartItem'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import SuggestedList from '@/components/SuggestedList'
import { blackDomains, blackEmails } from '@/constants/blackList'
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
import { FaHistory, FaShoppingCart } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'
import { RiCoupon2Fill, RiDonutChartFill } from 'react-icons/ri'

function CartPage() {
  // hooks
  const router = useRouter()
  const queryParams = useSearchParams()
  const { data: session, update } = useSession()
  const curUser: any = session?.user

  // reducers
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  let cartItems = useAppSelector(state => state.cart.items)
  const selectedItems = useAppSelector(state => state.cart.selectedItems)

  // MARK: states
  const [subTotal, setSubTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  // MARK: Voucher states
  const [voucher, setVoucher] = useState<IVoucher | null>(null)
  const [voucherMessage, setVoucherMessage] = useState<string>('')
  const [applyingVoucher, setApplyingVoucher] = useState<boolean>(false)

  // MARK: Gift states
  const [isShowGift, setIsShowGift] = useState<boolean>(false)
  const [findingUser, setFindingUser] = useState<boolean>(false)
  const [buyAsGiftMessage, setBuyAsGiftMessage] = useState<string>('')
  const [foundUser, setFoundUser] = useState<IUser | null>(null)

  // MARK: loading and showing states
  const [isBuying, setIsBuying] = useState<boolean>(false)
  const [isOpenConfirmBuyOnCreditDialog, setIsOpenConfirmBuyOnCreditDialog] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
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
      queryParams.getAll('course').includes((item?.courseId as ICourse)?.slug)
    )

    dispatch(setSelectedItems(selectedItems))
  }, [queryParams, cartItems, dispatch])

  // send request to server to check voucher
  const handleApplyVoucher: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!data.code) {
        toast.error('Mã giảm giá không được để trống!')
        return
      }

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
      setBuyAsGiftMessage(`Khóa học sẽ được tặng cho "${getUserName(user)}"`)
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

    // select at least 1 item to checkout
    if (!selectedItems.length || !total) {
      toast.error('Hãy chọn sản phẩm để tiến hành thanh toán')
      isValid = false
    }

    // check black list and black domains
    if (
      blackEmails.includes(curUser?.email) ||
      blackDomains.some((domain: string) => curUser?.email.endsWith(domain))
    ) {
      toast.error('Không thể thực hiện giao dịch này')
      return
    }

    return isValid
  }, [selectedItems.length, total, curUser?.email])

  // MARK: Checkout
  // handle checkout
  const handleCheckout = useCallback(
    async (type: 'momo' | 'banking') => {
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

        setTimeout(() => {
          // stop page loading
          dispatch(setPageLoading(false))
        }, 1000)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
        // stop page loading
        dispatch(setPageLoading(false))
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

  // set page title
  useEffect(() => {
    document.title = 'Giỏ hàng - Mona Edu'
  }, [])

  return (
    <div className="-mb-20 bg-neutral-800 bg-opacity-75 px-21 pb-20 text-light md:-mt-[72px] md:pt-[72px]">
      <Divider size={8} />

      <div className="mx-auto flex max-w-1200 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1.5 sm:flex-nowrap">
        <h1 className="mb-2 flex items-center gap-2 font-body text-xl font-semibold md:text-2xl lg:text-3xl">
          <FaShoppingCart className="wiggle flex-shrink-0 sm:w-[18px] lg:w-[30px]" />
          <span>Giỏ hàng</span>
          <span>
            (<span className="font-normal text-primary">{cartItems.length}</span>)
          </span>
        </h1>

        <Link
          href="/user/history"
          className="group mb-2 flex items-center gap-2 font-body text-xl font-semibold md:text-2xl lg:text-3xl"
        >
          <FaHistory className="wiggle -mb-0.5 w-[18px] flex-shrink-0 text-primary sm:w-[19px] lg:w-[26px]" />
          <span>Lịch sử mua hàng</span>
        </Link>
      </div>

      <div className="mx-auto mt-3 grid min-h-screen max-w-1200 grid-cols-3 gap-21 pb-16">
        <div className="col-span-3 lg:col-span-2">
          {/* MARK: Cart */}
          {cartItems.length ? (
            <div>
              <div className="flex select-none items-center justify-end gap-2 pr-21">
                <label
                  htmlFor="selectAll"
                  className="cursor-pointer font-semibold"
                >
                  {cartItems.length === selectedItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </label>
                <input
                  name="selectAll"
                  id="selectAll"
                  type="checkbox"
                  checked={cartItems.length === selectedItems.length}
                  onChange={() =>
                    cartItems.length === selectedItems.length
                      ? dispatch(setSelectedItems([]))
                      : dispatch(setSelectedItems(cartItems))
                  }
                  className="size-5 cursor-pointer accent-primary"
                />
              </div>

              <div className="pt-4" />

              {cartItems.map((cartItem, index) => (
                <CartItem
                  cartItem={cartItem}
                  className={index != 0 ? 'mt-5' : ''}
                  key={index}
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-center">
              Chưa có sản phẩm nào trong giỏ hàng của hàng. Hãy ấn vào{' '}
              <Link
                href="/"
                prefetch={false}
                className="text-sky-500 underline"
              >
                đây
              </Link>{' '}
              để bắt đầu mua hàng.{' '}
              <Link
                href="/"
                prefetch={false}
                className="italic text-sky-500 underline"
              >
                Quay lại
              </Link>
            </p>
          )}
        </div>

        {/* MARK: Summary */}
        <div className="col-span-3 text-dark lg:col-span-1">
          <div className="sticky top-[93px] overflow-auto rounded-medium border-2 border-primary bg-white p-4 shadow-lg lg:mt-[40px]">
            {/* Voucher */}
            <div className="trans-200 -mt-2 mb-2 flex items-center gap-2 overflow-hidden pt-2">
              <Input
                id="code"
                label="Mã giảm giá"
                disabled={applyingVoucher}
                register={register}
                errors={errors}
                type="text"
                icon={RiCoupon2Fill}
                onFocus={() => {
                  clearErrors('code')
                  setVoucherMessage('')
                }}
                className="w-full"
              />
              <button
                className={`trans-200 h-[42px] flex-shrink-0 text-nowrap rounded-2xl border px-3 py-2 hover:bg-black hover:text-light ${
                  applyingVoucher
                    ? 'pointer-events-none border-slate-200 bg-slate-200'
                    : 'border-dark text-dark'
                }`}
                onClick={handleSubmit(handleApplyVoucher)}
                disabled={applyingVoucher}
              >
                {applyingVoucher ? (
                  <RiDonutChartFill
                    size={26}
                    className="animate-spin text-slate-300"
                  />
                ) : (
                  'Áp dụng'
                )}
              </button>
            </div>
            {voucherMessage && (
              <p className={`${voucher ? 'text-green-500' : 'text-rose-500'} mb-2`}>{voucherMessage}</p>
            )}

            {/* Buy as a gift */}
            <div className="mb-2 inline text-nowrap font-body tracking-wider">
              Bạn muốn tặng cho ai đó? (
              <button
                className="z-10 text-orange-600 hover:underline"
                onClick={() => setIsShowGift(prev => !prev)}
              >
                ấn vào đây
              </button>
              )
            </div>

            <div
              className={`trans-200 flex items-center gap-2 overflow-hidden ${
                isShowGift ? 'mb-2 max-h-[200px] pt-2' : 'max-h-0 p-0'
              }`}
            >
              <Input
                id="receivedEmail"
                label="Email"
                disabled={findingUser}
                register={register}
                errors={errors}
                type="text"
                icon={IoMail}
                onFocus={() => {
                  clearErrors('receivedEmail')
                  setBuyAsGiftMessage('')
                }}
                className="w-full"
              />
              <button
                className={`trans-200 h-[42px] flex-shrink-0 text-nowrap rounded-2xl border px-3 py-2 hover:bg-black hover:text-light ${
                  findingUser
                    ? 'pointer-events-none border-slate-200 bg-slate-200'
                    : 'border-dark text-dark'
                }`}
                onClick={handleSubmit(handleFindUser)}
                disabled={findingUser}
              >
                {findingUser ? (
                  <RiDonutChartFill
                    size={26}
                    className="animate-spin text-slate-300"
                  />
                ) : (
                  'Tìm'
                )}
              </button>
            </div>
            {buyAsGiftMessage && (
              <p className={`text-sm ${foundUser ? 'text-green-500' : 'text-rose-500'} mb-2`}>
                {buyAsGiftMessage}
              </p>
            )}

            <Divider size={2} />

            {/* Payment Detail */}
            <div className="shaodow-lg rounded-lg bg-dark-100 p-21 text-light">
              <p>Chi tiết thanh toán</p>

              <Divider
                size={3}
                border
              />

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Tổng</span>
                  <span className="text-xl font-semibold">{formatPrice(subTotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span className="text-xl font-semibold">{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <Divider
                size={3}
                border
              />

              <div className="flex items-center justify-between">
                <span className="font-semobold">Thành tiền</span>
                <span className="trans-300 text-3xl font-semibold tracking-wide text-green-500 hover:tracking-wider">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Divider
              border
              size={4}
            />

            {/* MARK: Payment Methods */}
            <div className="flex select-none flex-wrap justify-center gap-3">
              <button
                className={`trans-200 group flex flex-1 items-center justify-center gap-2 rounded-xl border border-dark px-4 py-2 hover:bg-dark-0 ${
                  isBuying || isLoading ? 'pointer-events-none' : ''
                }`}
                onClick={() => handleCheckout('momo')}
                disabled={isBuying || isLoading}
              >
                <Image
                  className="wiggle-0 rounded-md border-2 group-hover:border-light"
                  src="/icons/momo-icon.jpg"
                  height={32}
                  width={32}
                  alt="Momo"
                />
                <span className="font-semibold group-hover:text-light">Momo</span>
              </button>

              <button
                className={`trans-200 group flex flex-1 items-center justify-center gap-2 rounded-xl border border-dark px-4 py-2 hover:bg-dark-0 ${
                  isBuying || isLoading ? 'pointer-events-none' : ''
                }`}
                onClick={() => handleCheckout('banking')}
                disabled={isBuying || isLoading}
              >
                <Image
                  className="wiggle-0"
                  src="/icons/banking-icon.jpg"
                  height={32}
                  width={32}
                  alt="Banking"
                />
                <span className="font-semibold group-hover:text-light">Banking</span>
              </button>
            </div>
          </div>
        </div>

        {/* MARK: Suggest Courses */}
        <div className="col-span-3 mt-12">
          <SuggestedList />
        </div>
      </div>
    </div>
  )
}

export default CartPage
