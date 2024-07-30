// Chapter -------------------------------------

// [GET]: /admin/chapter/:courseId/all
export const getAllCourseChaptersApi = async (courseId: string, query: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/chapter/${courseId}/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/chapter/:courseId/force-all
export const getForceAllChaptersApi = async (courseId: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/chapter/${courseId}/force-all`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /chapter/:courseSlug
export const getLearningChaptersApi = async (
  courseSlug: string,
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-cache
  const res = await fetch(`/api/chapter/${courseSlug}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/chapter/get-chapter/:id
export const getChapterApi = async (
  id: string,
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-cache
  const res = await fetch(`/api/admin/chapter/get-chapter/${id}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/chapter/:courseId/add
export const addNewChapterApi = async (courseId: string, data: any) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/chapter/${courseId}/add`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/chapter/edit
export const updateChapterApi = async (id: string, data: any) => {
  const res = await fetch('/api/admin/chapter/edit', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/chapter/delete
export const deleteChaptersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/chapter/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
