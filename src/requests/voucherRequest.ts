// Voucher -------------------------------------

// [GET]: /admin/voucher/all
export const getAllVouchersApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`/api/admin/voucher/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/voucher/:code
export const getVoucherApi = async (
  code: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`/api/admin/voucher/${code}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/voucher/add
export const addVoucherApi = async (data: any) => {
  const res = await fetch('/api/admin/voucher/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/voucher/activate
export const activateVouchersApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/voucher/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /voucher/:code/apply
export const applyVoucherApi = async (code: string, email: string, subTotal: number) => {
  const res = await fetch(`/api/voucher/${code}/apply`, {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      total: subTotal,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/voucher/:code/edit
export const updateVoucherApi = async (code: string, data: any) => {
  const res = await fetch(`/api/admin/voucher/${code}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/voucher/delete
export const deleteVouchersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/voucher/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
