// Package & Package Group -------------------------------------

// [GET]: /admin/package/all
export const getAllPackagesApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  const res = await fetch(`/api/admin/package/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/package-group/add
export const addPackageGroupApi = async (title: string, description: string) => {
  const res = await fetch('/api/admin/package-group/add', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/package-group/:id/edit
export const updatePackageGroupApi = async (id: string, title: string, description: string) => {
  const res = await fetch(`/api/admin/package-group/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify({ title, description }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/package/add
export const addPackageApi = async (data: any) => {
  const res = await fetch('/api/admin/package/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/package/:id/edit
export const updatePackageApi = async (id: string, data: any) => {
  const res = await fetch(`/api/admin/package/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/package-group/delete
export const deletePackageGroupApi = async (ids: string[]) => {
  const res = await fetch(`/api/admin/package-group/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/package/delete
export const deletePackagesApi = async (ids: string[]) => {
  const res = await fetch(`/api/admin/package/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
