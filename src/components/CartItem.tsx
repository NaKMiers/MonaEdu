import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { deleteCartItem, setSelectedItems } from '@/libs/reducers/cartReducer'
import { ICartItem } from '@/models/CartItemModel'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { deleteCartItemApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTrashAlt } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'
import Price from './Price'
import ConfirmDialog from './dialogs/ConfirmDialog'

interface CartItemProps {
  cartItem: ICartItem
  className?: string
  isCheckout?: boolean
  isOrderDetailCourse?: boolean
}

function CartItem({ cartItem, isCheckout, className = '', isOrderDetailCourse }: CartItemProps) {
  // hooks
  const dispatch = useAppDispatch()
  const selectedCartItems = useAppSelector(state => state.cart.selectedItems)

  // states
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // MARK: Delete
  // handle delete cart item
  const handleDeleteCartItem = useCallback(async () => {
    // start deleting
    setIsDeleting(true)

    try {
      const { deletedCartItem, message } = await deleteCartItemApi(cartItem._id)
      dispatch(deleteCartItem(deletedCartItem._id))

      // show toast success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop deleting
      setIsDeleting(false)
      setIsOpenConfirmModal(false)
    }
  }, [dispatch, cartItem?._id])

  return (
    <div
      className={`relative flex flex-wrap md:flex-nowrap items-start gap-3 cursor-pointer common-transition rounded-medium border p-21 ${
        !!selectedCartItems.find(cI => cI._id === cartItem._id) && !isCheckout
          ? 'border-primary'
          : 'border-slate-400'
      } ${className} `}
      onClick={() =>
        dispatch(
          setSelectedItems(
            selectedCartItems.find(cI => cI._id === cartItem._id)
              ? selectedCartItems.filter(cI => cI._id !== cartItem._id)
              : [...selectedCartItems, cartItem]
          )
        )
      }
    >
      {/* MARK: Thumbnails */}
      <div className='relative'>
        <Link
          href={`/${(cartItem.courseId as ICourse)?.slug}`}
          prefetch={false}
          className='aspect-video rounded-lg overflow-hidden shadow-lg block max-w-[150px]'
          onClick={e => e.stopPropagation()}
        >
          <div className='flex w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
            {(cartItem.courseId as ICourse)?.images
              ?.slice(0, (cartItem.courseId as ICourse)?.images.length === 1 ? 1 : -1)
              .map(src => (
                <Image
                  className='flex-shrink w-full snap-start'
                  src={src}
                  width={150}
                  height={150}
                  alt={(cartItem.courseId as ICourse)?.title}
                  key={src}
                />
              ))}
          </div>
        </Link>
      </div>

      {/* MARK: Checkbox */}
      {!isCheckout && (
        <input
          type='checkbox'
          className='size-5 z-10 cursor-pointer absolute top-21 right-21 accent-primary'
          checked={!!selectedCartItems.find(cI => cI._id === cartItem._id)}
          onChange={() =>
            dispatch(
              setSelectedItems(
                selectedCartItems.find(cI => cI._id === cartItem._id)
                  ? selectedCartItems.filter(cI => cI._id !== cartItem._id)
                  : [...selectedCartItems, cartItem]
              )
            )
          }
        />
      )}

      {!isCheckout && (
        <div className='flex items-center justify-between size-5 z-10 cursor-pointer absolute top-[55px] right-21 accent-primary'>
          {isDeleting ? (
            <RiDonutChartFill size={18} className='animate-spin text-slate-400' />
          ) : (
            <FaTrashAlt
              size={21}
              className='cursor-pointer hover:scale-110 common-transition wiggle'
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
              }}
            />
          )}
        </div>
      )}

      {/* MARK: Body */}
      <div className={`relative w-full h-full pr-10`}>
        {/* Title */}
        <h2 className={`text-[20px] tracking-wide mb-2 leading-6 pr-8`}>
          {(cartItem.courseId as ICourse)?.title}
        </h2>

        {/* Price & Stock */}
        <Price
          price={(cartItem.courseId as ICourse)?.price}
          oldPrice={(cartItem.courseId as ICourse)?.oldPrice}
          flashSale={(cartItem.courseId as ICourse)?.flashSale as IFlashSale}
        />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Xóa sản phẩm khỏi giỏ hàng'
        content='Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?'
        onAccept={handleDeleteCartItem}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default memo(CartItem)
