// Question -------------------------------------

// [GET]: /question/my-questions
export const getMyQuestionsApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-cache
  const res = await fetch(`/api/question/my-questions${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /question/add
export const addQuestionApi = async (data: any) => {
  const res = await fetch('/api/question/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /question/:id/edit
export const updateQuestionsApi = async (id: string, data: any) => {
  const res = await fetch(`/api/question/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /question/:id/close
export const closeQuestionsApi = async (id: string, value: 'close' | 'open') => {
  const res = await fetch(`/api/question/${id}/close`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /question/:id/like
export const likeQuestionsApi = async (id: string, value: boolean) => {
  const res = await fetch(`/api/question/${id}/like`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /question/delete
export const deleteQuestionsApi = async (ids: string[]) => {
  const res = await fetch('/api/question/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
