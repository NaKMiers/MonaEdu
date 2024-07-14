import CourseCard from '@/components/CourseCard';
import Divider from '@/components/Divider';
import Pagination from '@/components/layouts/Pagination';
import { ICourse } from '@/models/CourseModel';
import { getSearchPageApi } from '@/requests';
import { handleQuery } from '@/utils/handleQuery';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tìm kiếm - Mona Edu',
  description: 'Mona Edu - Học trực tuyến mọi lúc, mọi nơi',
};

async function SearchPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let courses: ICourse[] = [];
  let query: string = '';
  let amount: number = 0;
  let itemPerPage = 16;

  try {
    // get query
    query = handleQuery(searchParams);

    // cache: no-store for filter
    const data = await getSearchPageApi(query);

    // destructure
    courses = data.courses;
    amount = data.amount;
  } catch (err: any) {
    console.log(err);
  }

  // jsonLD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Kết quả tìm kiếm cho ${query}`,
    numberOfItems: amount,
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${course.slug}`,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.description,
        provider: {
          '@type': 'Organization',
          name: 'Mona Edu',
          url: `${process.env.NEXT_PUBLIC_APP_URL}`,
        },
        offers: {
          '@type': 'Offer',
          price: course.price,
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <div className='px-21'>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Divider size={12} />

      {/* Heading */}
      <h1 className='text-4xl font-semibold px-21 text-white text-center'>
        Kết quả tìm kiếm {amount > 0 && <span>({amount})</span>}
      </h1>

      <Divider size={18} />

      {/* MAIN List */}
      {!!courses.length ? (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-21'>
          {courses.map((course) => (
            <CourseCard course={course} key={course._id} />
          ))}
        </div>
      ) : (
        <div className='font-body tracking-wider text-center text-light'>
          <p className='italic'>Không có kết quả tìm kiếm nào, hãy thử lại với từ khóa khác hoặc </p>
          <Link
            href='/'
            className='text-sky-500 underline underline-offset-2 hover:text-sky-700 trans-200'
          >
            về trang chủ
          </Link>
        </div>
      )}

      <Divider size={8} />

      {/* Pagination */}
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      <Divider size={20} />
    </div>
  );
}

export default SearchPage;
