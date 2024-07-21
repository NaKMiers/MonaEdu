// Notification -------------------------------------

// [GET]
export const getUserNotificationsApi = async () => {
  const res = await fetch(`/api/notification`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /notification/read
export const readNotificationsApi = async (ids: string[], status: 'read' | 'unread') => {
  const res = await fetch(`/api/notification/read`, {
    method: 'PATCH',
    body: JSON.stringify({ ids, status }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// DELETE: /notification/remove
export const removeNotificationsApi = async (ids: string[]) => {
  const res = await fetch(`/api/notification/remove`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
