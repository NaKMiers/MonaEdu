// Page -------------------------------------

// [GET]: /
export const getHomePageApi = async (
  query: string = '',
  option: RequestInit = { next: { revalidate: 60 } }
) => {
  // revalidate every 0.5 minute
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /course/:slug
export const getCoursePageApi = async (
  slug: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/course/${slug}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /courses/all
export const getCoursesPageApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/course/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /tag
export const getTagsPageApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tag${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /categories/[...slug]
export const getCategoryPageApi = async (
  slug: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/category/${slug}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /category
export const getCategoriesPageApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/category${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /tag/:slug
export const getTagPageApi = async (
  slug: string,
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tag/${slug}${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /package
export const getSubscriptionPageApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/subscription${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /flash-sale
export const getFlashSalePageApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/flash-sale${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /best-seller
export const getBestSellerPageApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/best-seller${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /search
export const getSearchPageApi = async (
  query: string = '',
  option: RequestInit = {
    cache: 'no-store',
  }
) => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/search${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
