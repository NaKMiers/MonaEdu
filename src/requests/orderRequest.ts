// [GET]: /admin/order/all
export const getAllOrdersApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/order/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /order/:code
export const getOrderApi = async (
  code: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/order/${code}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /order/generate-order-code
export const generateOrderCodeApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`/api/order/generate-order-code${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /order/create
export const createOrderApi = async ({
  total,
  voucher,
  receivedUser,
  discount,
  items,
  paymentMethod,
  isPackage,
}: {
  total: number
  receivedUser: string | undefined
  voucher: string | undefined
  discount: number | undefined
  items: any
  paymentMethod: string
  isPackage: boolean
}) => {
  const res = await fetch('/api/order/create', {
    method: 'POST',
    body: JSON.stringify({
      total,
      receivedUser,
      voucher,
      discount,
      items,
      paymentMethod,
      isPackage,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/order/:orderId/edit
export const editOrderApi = async (orderId: string, data: any) => {
  const res = await fetch(`/api/admin/order/${orderId}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/order/:orderId/deliver
export const deliverOrderApi = async (orderId: string, message: string = '') => {
  const res = await fetch(`/api/admin/order/${orderId}/deliver`, {
    method: 'PATCH',
    body: JSON.stringify({ message }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/order/:orderId/re-deliver
export const reDeliverOrder = async (orderId: string, message: string = '') => {
  const res = await fetch(`/api/admin/order/${orderId}/re-deliver`, {
    method: 'PATCH',
    body: JSON.stringify({ message }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/order/cancel
export const cancelOrdersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/order/cancel', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/order/delete
export const deletedOrdersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/order/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
