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
export const getAllParentCategoriesApi = async (
  prefix: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  const res = await fetch(`${prefix}/api/category`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getAllCategoriesApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no cache
  const res = await fetch(`/api/category/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getForceAllCategoriesApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no cache
  const res = await fetch(`/api/admin/category/force-all${query}`, option)

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
export const addCategoryApi = async (data: FormData) => {
  const res = await fetch('/api/admin/category/add', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateCategoryApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/category/${id}/edit`, {
    method: 'PUT',
    body: data,
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
