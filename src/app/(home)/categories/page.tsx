import BreadcrumbBanner from '@/components/BreadcrumbBanner'
import CategoryCard from '@/components/CategoryCard'
import Divider from '@/components/Divider'
import { ICategory } from '@/models/CategoryModel'
import { getAllParentCategoriesApi } from '@/requests'
import { redirect } from 'next/navigation'

async function CategoriesPage() {
  // data
  let categories: ICategory[] = []

  try {
    const data = await getAllParentCategoriesApi(process.env.NEXT_PUBLIC_APP_URL)
    categories = data.categories
  } catch (err: any) {
    return redirect('/')
  }

  return (
    <div>
      {/* Banner */}
      <BreadcrumbBanner
        title='Danh Mục Khóa Học'
        description='Với hơn 100+ danh mục khóa học, bạn có thể chọn lựa một cách dễ dàng nhất cho bản thân mình.'
        className='shadow-lg rounded-b-lg h-[200px] md:h-[calc(280px+72px)] md:-mt-[72px] px-21 md:pt-[50px]'
      />

      <Divider size={10} />

      {/* Body */}
      <div className='px-21'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-21'>
          {categories.map(category => (
            <CategoryCard category={category} key={category._id} />
          ))}
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default CategoriesPage
