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
