// Summary -------------------------------------

// [GET]: /admin/summary/all
export const getAllCollaboratorsApi = async (query: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/summary/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/summary/:id
export const sendSummaryApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/summary/send', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
