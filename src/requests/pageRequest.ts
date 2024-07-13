// Page -------------------------------------

// [GET]
export const getHomePageApi = async () => {
  // revalidate every 0.5 minute
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api`, { next: { revalidate: 0 } });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]
export const getCoursePageApi = async (slug: string) => {
  // no cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/course/${slug}`, {
    cache: "no-store",
  });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]
export const getTagsPageApi = async (query: string = "") => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tag${query}`, { cache: "no-store" });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]: /categories/[...slug]
export const getCategoryPageApi = async (slug: string, query: string = "") => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/category/${slug}${query}`, {
    cache: "no-store",
  });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]
export const getCategoriesPageApi = async (query: string = "") => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/category${query}`, {
    cache: "no-store",
  });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]
export const getFlashSalePageApi = async (query: string = "") => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/flash-sale${query}`, {
    cache: "no-store",
  });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]
export const getBestSellerPageApi = async (query: string = "") => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/best-seller${query}`, {
    cache: "no-store",
  });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]
export const getSearchPageApi = async (query: string = "") => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/search${query}`, {
    cache: "no-store",
  });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]
export const getForumPageApi = async (query: string = "") => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/question${query}`, {
    cache: "no-store",
  });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};

// [GET]
export const getQuestionDetailPage = async (slug: string, query: string = "") => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/question/${slug}/detail${query}`, {
    cache: "no-store",
  });

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  return await res.json();
};
