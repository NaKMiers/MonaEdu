import BreadcrumbBanner from '@/components/BreadcrumbBanner';
import CategoryCard from '@/components/CategoryCard';
import Divider from '@/components/Divider';
import { ICategory } from '@/models/CategoryModel';
import { getAllParentCategoriesApi } from '@/requests';
import { notFound } from 'next/navigation';

async function CategoriesPage() {
  // data
  let categories: ICategory[] = [];

  try {
    const data = await getAllParentCategoriesApi(process.env.NEXT_PUBLIC_APP_URL);
    categories = data.categories;
  } catch (err: any) {
    return notFound();
  }

  // jsonLd
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Danh Mục Khóa Học',
    description:
      'Với hơn 14+ danh mục và 100+ danh mục con, bạn có thể dễ dàng chọn lựa khóa học phù hợp với mình.',
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
  };

  return (
    <div>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Banner */}
      <BreadcrumbBanner
        title='Danh Mục Khóa Học'
        description='Với hơn 14+ danh mục và 100+ danh mục con, bạn có thể dễ dàng chọn lựa khóa học phù hợp với mình.'
        className='shadow-lg rounded-b-lg h-[200px] md:h-[calc(280px+72px)] md:-mt-[72px] px-21 md:pt-[50px]'
      />

      <Divider size={10} />

      {/* Body */}
      <div className='px-21'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-21 sm:gap-8'>
          {categories.map((category) => (
            <CategoryCard category={category} key={category._id} />
          ))}
        </div>
      </div>

      <Divider size={32} />
    </div>
  );
}

export default CategoriesPage;
