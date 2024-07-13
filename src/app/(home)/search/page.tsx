import CourseCard from "@/components/CourseCard";
import Divider from "@/components/Divider";
import Pagination from "@/components/layouts/Pagination";
import { ICourse } from "@/models/CourseModel";
import { getSearchPageApi } from "@/requests";
import { handleQuery } from "@/utils/handleQuery";
import Link from "next/link";

async function SearchPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let courses: ICourse[] = [];
  let query: string = "";
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

  return (
    <div className='px-21'>
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
