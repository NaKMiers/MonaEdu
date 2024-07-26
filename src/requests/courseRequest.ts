// Course -------------------------------------

// [GET]: /admin/course/all
export const getAllCoursesApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to avoid cache
  const res = await fetch(`/api/admin/course/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /course
export const getCoursesApi = async (query: string = '', option: RequestInit = { cache: 'no-store' }) => {
  // no-store to avoid cache
  const res = await fetch(`/api/course${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/course/force-all
export const getForceAllCoursesApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to avoid cache
  const res = await fetch(`/api/admin/course/force-all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/course/:id
export const getCourseApi = async (
  id: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-cache
  const res = await fetch(`/api/admin/course/${id}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /course/:slug/single
export const getSingleCourseApi = async (
  slug: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-cache
  const res = await fetch(`/api/course/${slug}/single${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /course/my-courses
export const getMyCoursesApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-cache
  const res = await fetch(`/api/course/my-courses${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /course/best-seller
export const getBestSellerCoursesApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // revalidate every 1 hour
  const res = await fetch(`/api/course/best-seller${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /course/search?search=...
export const searchCoursesApi = async (
  search: string,
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-cache
  const res = await fetch(`/api/course/search?search=${search}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /course/suggested-courses
export const getSuggestedCoursesApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  const res = await fetch(`/api/course/suggested${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/course/add
export const addCourseApi = async (data: FormData) => {
  const res = await fetch('/api/admin/course/add', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/course/activate
export const activateCoursesApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/course/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/course/boot
export const bootCoursesApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/course/boot', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /course/:id/like
export const likeCourseApi = async (id: string, value: 'y' | 'n') => {
  const res = await fetch(`/api/course/${id}/like`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/course/remove-flash-sales
export const removeApplyingFlashSalesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/course/remove-flash-sales', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/course/:id/edit-property/:field
export const updateCoursePropertyApi = async (id: string, field: string, value: any) => {
  const res = await fetch(`/api/admin/course/${id}/edit-property/${field}`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/course/:id/edit
export const updateCourseApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/course/${id}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/course/delete
export const deleteCoursesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/course/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
