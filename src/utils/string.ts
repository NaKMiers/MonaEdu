import { IUser } from '@/models/UserModel'

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getUserName = (user?: IUser, exclude?: string) => {
  if (!user) return

  if (user.nickname && exclude !== 'nickname') {
    return user.nickname
  }

  if (user.firstName && user.lastName) {
    return user.firstName + ' ' + user.lastName
  }

  if (user.firstName && !user.lastName) {
    return user.firstName
  }

  if (!user.firstName && user.lastName) {
    return user.lastName
  }

  if (user.username) {
    return user.username
  }
}

export const stripHTML = (html: string = '') => html.replace(/<[^>]*>?/gm, ' ')

export const checkPackageType = (
  credit: any,
  expire: any
): 'lifetime' | 'credit' | 'monthly' | 'no-subscription' => {
  if (credit === null && expire === null) {
    return 'lifetime'
  } else if (typeof credit === 'number' && credit > 0 && expire === null) {
    return 'credit'
  } else if (credit === null && expire !== null && new Date(expire) > new Date()) {
    return 'monthly'
  }

  return 'no-subscription'
}
