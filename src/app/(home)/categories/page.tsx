import BreadcrumbBanner from '@/components/BreadcrumbBanner'
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

    console.log('categories: ', data.categories)
  } catch (err: any) {
    // return redirect('/')
  }

  return (
    <div>
      {/* Banner */}
      <BreadcrumbBanner
        title='English'
        description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, perspiciatis.'
        className='shadow-medium rounded-b-lg h-[calc(300px+72px)] -mt-[72px] pt-[72px]'
      />

      <Divider size={10} />

      {/* Body */}
      <div className='px-21'>
        <div className='grid grid-cols-4 gap-21'>
          {categories.map(category => (
            <div key={category._id}>
              <p className='text-white'>{category.title}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider size={32} />
    </div>
  )
}

export default CategoriesPage
