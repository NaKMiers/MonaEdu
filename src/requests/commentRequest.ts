// Comment -------------------------------------

// [POST]: /comment/add
export const addCommentApi = async ({ lessonId, content }: { lessonId?: string; content: string }) => {
  const res = await fetch(`/api/comment/add`, {
    method: 'POST',
    body: JSON.stringify({
      lessonId,
      content,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /comment/:id/reply
export const replyCommentApi = async (id: string, content: string) => {
  const res = await fetch(`/api/comment/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /comment/:id/like
export const likeCommentApi = async (id: string, value: 'y' | 'n') => {
  const res = await fetch(`/api/comment/${id}/like`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /comment/:id/hide
export const hideCommentApi = async (id: string, value: 'y' | 'n') => {
  const res = await fetch(`/api/comment/${id}/hide`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /comment/:id/delete
export const deleteCommentApi = async (id: string) => {
  const res = await fetch(`/api/comment/${id}/delete`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
