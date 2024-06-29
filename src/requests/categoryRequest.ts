// Category -------------------------------------

// [GET]
export const getCategoriesApi = async (query: string = '') => {
  // no cache
  const res = await fetch(`/api/category${query}`, { next: { revalidate: 30 } })
  const data = await res.json()

  // check status
  if (!res.ok) {
    throw new Error(data.message)
  }

  return data
}

// [GET]: /category/all
export const getAllParentCategoriesApi = async (prefix: string = '') => {
  const res = await fetch(`${prefix}/api/category`, { next: { revalidate: 0 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getAllCategoriesApi = async (query: string = '') => {
  // no cache
  const res = await fetch(`/api/admin/category/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getForceAllCategoriesApi = async (option: RequestInit = { cache: 'no-store' }) => {
  // no cache
  const res = await fetch('/api/admin/category/force-all', option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getCategoryApi = async (slug: string) => {
  // no cache
  const res = await fetch(`/api/admin/category/${slug}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addCategoryApi = async (data: any) => {
  const res = await fetch('/api/admin/category/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateCategoryApi = async (id: string, data: any) => {
  const res = await fetch(`/api/admin/category/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const bootCategoriesApi = async (id: string, value: boolean) => {
  const res = await fetch(`/api/admin/category/${id}/boot`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteCategoryApi = async (id: string) => {
  const res = await fetch(`/api/admin/category/${id}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
