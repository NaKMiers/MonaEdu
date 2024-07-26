// Category -------------------------------------

// [GET]: /category
export const getCategoriesApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`/api/category${query}`, option)
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

// [GET]: /category/all
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

// [GET]: /admin/category/force-all
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

// [GET]: /admin/category/:slug
export const getCategoryApi = async (
  slug: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`/api/admin/category/${slug}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/category/add
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

// [PUT]: /admin/category/:id/edit
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

// [PATCH]: /admin/category/:id/boot
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

// [DELETE]: /admin/category/:id/delete
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
