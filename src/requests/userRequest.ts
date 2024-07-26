// User -------------------------------------

// [GET]: /admin/user/all
export const getAllUsersApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/user/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /user/:id
export const getUsersApi = async (
  id: string = '',
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/${id}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /user/find/:email
export const findUserApi = async (
  email: string = '',
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/user/find/${email}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /user/role-users
export const getRoleUsersApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/user/role-users${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/user/rank-users
export const getRankUsersApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/user/rank-user${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /user/history
export const getOrderHistoryApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/user/history${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /user/check-authentication
export const checkAuthenticationApi = async (password: string) => {
  // no-store to bypass cache
  const res = await fetch('/api/user/check-authentication', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /user/update-personal-info
export const updatePersonalInfoApi = async (data: any) => {
  const res = await fetch('/api/user/update-personal-info', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /user/update-private-info
export const updatePrivateInfoApi = async (data: any) => {
  const res = await fetch('/api/user/update-private-info', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /user/change-avatar
export const changeAvatarApi = async (data: FormData) => {
  const res = await fetch('/api/user/change-avatar', {
    method: 'PATCH',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /user/change-banner
export const changeBannerApi = async (data: FormData) => {
  const res = await fetch('/api/user/change-banner', {
    method: 'PATCH',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /user/change-password
export const changePasswordApi = async (data: any) => {
  const res = await fetch('/api/user/change-password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/user/:userId/set-collaborator
export const setCollaboratorApi = async (userId: string, type: string, value: string) => {
  const res = await fetch(`/api/admin/user/${userId}/set-collaborator`, {
    method: 'PATCH',
    body: JSON.stringify({ type, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/user/:userId/demote-collaborator
export const demoteCollaboratorApi = async (userId: string) => {
  const res = await fetch(`/api/admin/user/${userId}/demote-collaborator`, {
    method: 'PATCH',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/user/:userId/block-comment
export const blockCommentApi = async (userId: string, value: boolean) => {
  const res = await fetch(`/api/admin/user/${userId}/block-comment`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /admin/user/:userId/block-add-question
export const blockAddQuestionApi = async (userId: string, value: boolean) => {
  const res = await fetch(`/api/admin/user/${userId}/block-add-question`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /user/change-notification-setting
export const changeNotificationSettingApi = async (type: string, value: boolean) => {
  const res = await fetch(`/api/user/change-notification-setting`, {
    method: 'PATCH',
    body: JSON.stringify({ type, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/user/delete
export const deleteUsersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/user/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
