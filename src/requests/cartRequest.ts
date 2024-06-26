// Cart

import { CartItemToAdd } from '@/app/api/cart/add/route'

// [GET]
export const getCartApi = async () => {
  // no cache
  const res = await fetch('/api/cart', { next: { revalidate: 60 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addToCartApi = async (courses: CartItemToAdd[]) => {
  const res = await fetch('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ courses }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteCartItemApi = async (cartItemId: string) => {
  const res = await fetch(`/api/cart/${cartItemId}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
