// Cart

// [GET]: /cart
export const getCartApi = async (
  query: string = '',
  option: RequestInit = { next: { revalidate: 60 } }
) => {
  const res = await fetch(`/api/cart${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /cart/add
export const addToCartApi = async (courseId: string) => {
  const res = await fetch('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /cart/:cartItemId/delete
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
