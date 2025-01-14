// Activation Code -------------------------------------

// [GET]: /admin/activation-code/all
export const getAllActivationCodesApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`/api/admin/activation-code/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/activation-code/:code
export const getActivationCodeApi = async (
  code: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`/api/admin/activation-code/${code}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/activation-code/add
export const addActivationCodeApi = async (data: any) => {
  const res = await fetch('/api/admin/activation-code/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/activation-code/activate
export const activateActivationCodesApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/activation-code/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/activation-code/:code/edit
export const updateActivationCodeApi = async (code: string, data: any) => {
  const res = await fetch(`/api/admin/activation-code/${code}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/activation-code/delete
export const deleteActivationCodesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/activation-code/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
