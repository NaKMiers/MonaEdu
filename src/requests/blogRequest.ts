// Blog -------------------------------------

// [GET]: /admin/blog/all
export const getAllBlogsApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to avoid cache
  const res = await fetch(`/api/admin/blog/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/blog/:id
export const getBlogByIdApi = async (id: string, option: RequestInit = { cache: 'no-store' }) => {
  const res = await fetch(`/api/admin/blog/${id}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/blog/add
export const addBlogApi = async (data: FormData) => {
  const res = await fetch('/api/admin/blog/add', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/blog/:id/edit
export const updateBlogApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/blog/${id}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/blog/change-status
export const changeBlogsStatusApi = async (ids: string[], value: 'draft' | 'published' | 'archived') => {
  const res = await fetch('/api/admin/blog/change-status', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/blog/:id/edit-property
export const updateBlogPropertyApi = async (id: string, property: string, value: any) => {
  const res = await fetch(`/api/admin/blog/${id}/edit-property`, {
    method: 'PATCH',
    body: JSON.stringify({ property, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/blog/boot
export const bootBlogsApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/blog/boot', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/blog/delete
export const deleteBlogsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/blog/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
