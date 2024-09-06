// Lesson -------------------------------------

// [GET]: /admin/lesson/:chapterId/all
export const getAllChapterLessonsApi = async (
  chapterId: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/lesson/${chapterId}/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /lesson/:slug
export const getLessonApi = async (
  slug: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-cache
  const res = await fetch(`/api/lesson/${slug}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/lesson/:chapterId/:lessonId
export const getLessonByIdApi = async (
  chapterId: string,
  lessonId: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  const res = await fetch(`/api/admin/lesson/${chapterId}/${lessonId}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /admin/lesson/:chapterId/add
export const addLessonApi = async (chapterId: string, data: FormData) => {
  const res = await fetch(`/api/admin/lesson/${chapterId}/add`, {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /admin/lesson/:chapterId/:lessonId/edit
export const updateLessonApi = async (chapterId: string, lessonId: string, data: FormData) => {
  const res = await fetch(`/api/admin/lesson/${chapterId}/${lessonId}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/lesson/activate
export const activateLessonsApi = async (ids: string[], value: boolean) => {
  const res = await fetch(`/api/admin/lesson/activate`, {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/lesson/status
export const changeLessonStatusApi = async (ids: string[], status: 'public' | 'private') => {
  const res = await fetch(`/api/admin/lesson/status`, {
    method: 'PATCH',
    body: JSON.stringify({ ids, status }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /lesson/:id/like
export const likeLessonApi = async (id: string, value: 'y' | 'n') => {
  const res = await fetch(`/api/lesson/${id}/like`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/lesson/delete
export const deleteLessonsApi = async (ids: string[]) => {
  const res = await fetch(`/api/admin/lesson/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
