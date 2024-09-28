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
      className={`common-transition relative flex cursor-pointer flex-wrap items-start gap-3 rounded-medium border p-21 md:flex-nowrap ${
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
      <div className="relative">
        <Link
          href={`/${(cartItem.courseId as ICourse)?.slug}`}
          prefetch={false}
          className="block aspect-video max-w-[150px] overflow-hidden rounded-lg shadow-lg"
          onClick={e => e.stopPropagation()}
        >
          <div className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-scroll">
            {(cartItem.courseId as ICourse)?.images
              ?.slice(0, (cartItem.courseId as ICourse)?.images.length === 1 ? 1 : -1)
              .map(src => (
                <Image
                  className="w-full flex-shrink snap-start"
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
          type="checkbox"
          className="absolute right-21 top-21 z-10 size-5 cursor-pointer accent-primary"
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
        <div className="absolute right-21 top-[55px] z-10 flex size-5 cursor-pointer items-center justify-between accent-primary">
          {isDeleting ? (
            <RiDonutChartFill
              size={18}
              className="animate-spin text-slate-400"
            />
          ) : (
            <FaTrashAlt
              size={21}
              className="common-transition wiggle cursor-pointer hover:scale-110"
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
              }}
            />
          )}
        </div>
      )}

      {/* MARK: Body */}
      <div className={`relative h-full w-full pr-10`}>
        {/* Title */}
        <h2 className={`mb-2 pr-8 text-[20px] leading-6 tracking-wide`}>
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
        title="Xóa sản phẩm khỏi giỏ hàng"
        content="Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?"
        onAccept={handleDeleteCartItem}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default memo(CartItem)
