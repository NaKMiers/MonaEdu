import BreadcrumbBanner from '@/components/BreadcrumbBanner'
import CategoryCard from '@/components/CategoryCard'
import Divider from '@/components/Divider'
import { ICategory } from '@/models/CategoryModel'
import { getAllParentCategoriesApi } from '@/requests'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Danh mục khóa học - Mona Edu',
  description: 'Mona Edu - Học trực tuyến mọi lúc, mọi nơi',
}

async function CategoriesPage() {
  // data
  let categories: ICategory[] = []

  try {
    const data = await getAllParentCategoriesApi(process.env.NEXT_PUBLIC_APP_URL, {
      next: { revalidate: 60 },
    })
    categories = data.categories

    console.log('categories', categories)
  } catch (err: any) {
    return notFound()
  }

  // jsonLd
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Danh Mục Khóa Học',
    description:
      '+54 danh mục và danh mục, +500 khóa học đa dạng về chủ đề, giúp bạn dễ dàng lựa chọn khóa học phù hợp với nhu cầu của mình.',
    itemListElement: categories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Category',
        name: category.title,
        description: category.description,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/categories/${category.slug}`,
      },
    })),
  }

  return (
    <div>
      {/* MARK: Add JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Banner */}
      <BreadcrumbBanner
        title="Danh Mục Khóa Học"
        description="+54 danh mục và danh mục con, +500 khóa học đa dạng về chủ đề, giúp bạn dễ dàng lựa chọn khóa học phù hợp với nhu cầu của mình."
        className="h-[200px] rounded-b-lg px-21 shadow-lg md:-mt-[72px] md:h-[calc(280px+72px)] md:pt-[50px]"
      />

      <Divider size={10} />

      {/* Body */}
      <div className="px-21">
        <div className="grid grid-cols-2 gap-21 sm:gap-8 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category: any) => (
            <CategoryCard
              category={category}
              key={category._id}
            />
          ))}
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default CategoriesPage
