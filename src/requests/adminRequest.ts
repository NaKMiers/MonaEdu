// Admin -------------------------------------

// [GET]: /admin
export const getFullDataApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`/api/admin${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
