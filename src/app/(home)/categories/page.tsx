import BreadcrumbBanner from '@/components/BreadcrumbBanner'
import { HoverEffect } from '@/components/CardHoverEffect'
import CategoryCard from '@/components/CategoryCard'
import Divider from '@/components/Divider'
import { ICategory } from '@/models/CategoryModel'
import { getAllParentCategoriesApi } from '@/requests'

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
