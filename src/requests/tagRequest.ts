// Tag -------------------------------------

// [GET]: /admin/tag/all
export const getAllTagsApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/tag/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/tag/force-all
export const getForceAllTagsApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/tag/force-all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/tag/add
export const addTagApi = async (data: any) => {
  const res = await fetch('/api/admin/tag/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/tag/boot
export const bootTagsApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/tag/boot', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/tag/edit
export const updateTagsApi = async (editingValues: any[]) => {
  const res = await fetch('/api/admin/tag/edit', {
    method: 'PUT',
    body: JSON.stringify({ editingValues }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/tag/delete
export const deleteTagsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/tag/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
