// Embed -------------------------------------

// [GET]: /embed/course/:slug
export const getEmbedCourseApi = async (slug: string, option: RequestInit = { cache: 'no-store' }) => {
  // no-store to avoid cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/embed/course/${slug}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
