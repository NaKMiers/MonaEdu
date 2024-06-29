import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import Meta from '@/components/Meta'
import Pagination from '@/components/layouts/Pagination'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { ITag } from '@/models/TagModel'
import { getCoursesApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'

async function CoursesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let courses: ICourse[] = []
  let tags: ITag[] = []
  let categories: ICategory[] = []
  let query: string = ''
  let amount: number = 0
  let chops: { [key: string]: number } | null = null
  let itemPerPage = 16

  try {
    // get query
    query = handleQuery(searchParams)

    // cache: no-store for filter
    const data = await getCoursesApi(query)

    // destructure
    courses = data.courses
    categories = data.cates
    tags = data.tgs
    amount = data.amount
    chops = data.chops
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='px-21'>
      <Divider size={6} />

      <div className='flex'>
        {/* Filter & Search */}
        <div className='hidden md:flex justify-between -mx-21 max-w-[250px] lg:max-w-[300px] w-full'>
          {/* <Meta searchParams={searchParams} tags={tags} categories={categories} chops={chops} /> */}
        </div>

        {/* MAIN List */}
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-21 -mx-3 md:mx-0 flex-1'>
          {courses.map(course => (
            <CourseCard course={course} key={course._id} />
          ))}
        </div>
      </div>

      <Divider size={5} />

      <Divider size={8} />

      {/* Pagination */}
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      <Divider size={20} />
    </div>
  )
}

export default CoursesPage
