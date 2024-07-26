// Auth -------------------------------------

// [POST]: /auth/register
export const registerApi = async (data: any) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /auth/forgot-password
export const forgotPasswordApi = async (data: any) => {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /auth/reset-password?token=...
export const resetPassword = async (token: string, newPassword: string) => {
  const res = await fetch(`/api/auth/reset-password?token=${token}`, {
    method: 'PATCH',
    body: JSON.stringify({ newPassword }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /auth/verify-email
export const verifyEmailApi = async (email: string, token: string = '') => {
  const res = await fetch('/api/auth/verify-email' + (token ? '?token=' + token : ''), {
    method: 'POST',
    body: JSON.stringify({ email }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /auth/verify-phone
export const verifyPhoneApi = async (phone: string) => {
  const res = await fetch('/api/auth/verify-phone', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
