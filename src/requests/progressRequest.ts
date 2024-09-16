// Progress -------------------------------------

// [POST]
export const addProgressApi = async (
  courseId: string,
  lessonId: string,
  status: 'not-started' | 'in-progress' | 'completed' = 'in-progress'
) => {
  const res = await fetch(`/api/progress/add`, {
    method: 'POST',
    body: JSON.stringify({ courseId, lessonId, status }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateProgressApi = async (
  id: string,
  courseId: string,
  status: 'not-started' | 'in-progress' | 'completed',
  progress: number
) => {
  const res = await fetch(`/api/progress/${id}/update`, {
    method: 'PUT',
    body: JSON.stringify({ courseId, status, progress }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteProgressApi = async (id: string) => {
  const res = await fetch(`/api/progress/${id}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
