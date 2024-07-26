// Flash Sale -------------------------------------

// [GET]: /admin/flash-sale/all
export const getAllFlashSalesApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/flash-sale/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/flash-sale/:id
export const getFlashSaleApi = async (
  id: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/flash-sale/${id}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/flash-sale/add
export const addFlashSaleApi = async (data: any) => {
  const res = await fetch('/api/admin/flash-sale/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/flash-sale/:id/edit
export const updateFlashSaleApi = async (id: string, data: any, appliedCourses: string[]) => {
  const res = await fetch(`/api/admin/flash-sale/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify({
      ...data,
      appliedCourses,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/flash-sale/delete
export const deleteFlashSalesApi = async (ids: string[], courseIds: string[]) => {
  const res = await fetch('/api/admin/flash-sale/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids, courseIds }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
