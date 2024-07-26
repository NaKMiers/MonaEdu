// Report -------------------------------------

// [GET]: /admin/report/all
export const getAllReportsApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`/api/admin/report/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /report/add
export const addReportApi = async (data: any) => {
  const res = await fetch('/api/report/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/report/delete
export const deleteReportsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/report/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
