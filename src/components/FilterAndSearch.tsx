import { categories } from '@/constants/categories'
import Divider from './Divider'
import SearchBar from './SearchBar'
import Link from 'next/link'

interface FilterAndSearchProps {
  className?: string
}

function FilterAndSearch({ className = '' }: FilterAndSearchProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Search */}
      <SearchBar />

      <Divider size={2} />

      {/* Sub Categories */}
      <div>
        <h3 className='px-2 font-semibold font-body tracking-wide hover:tracking-widest trans-200 text-lg'>
          Danh Mục Con
        </h3>

        <Divider size={4} />

        <div className='flex flex-col gap-2.5'>
          {categories[0].subs.data.map(category => (
            <Link
              href={`/${category.slug}`}
              className='rounded-lg hover:rounded-3xl border-b-2 border-neutral-700 drop-shadow-lg shadow-md py-2 px-3 trans-300'
              key={category.title}
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Filter */}

      {/* Sort */}
    </div>
  )
}

export default FilterAndSearch
