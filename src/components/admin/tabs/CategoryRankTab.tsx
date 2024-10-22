import FallbackImage from '@/components/FallbackImage'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { getAllCoursesApi } from '@/requests'
import Image from 'next/image'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface CategoryRankTabProps {
  className?: string
}

function CategoryRankTab({ className = '' }: CategoryRankTabProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const getCourses = async () => {
      // start loading
      setLoading(true)

      try {
        const query = '?limit=no-limit&sort=createdAt|-1'
        const { courses } = await getAllCoursesApi(query)

        console.log(
          'courses',
          courses.filter((course: any) => !course?.category?.slug)
        )

        // Category Joined Rank
        const categoryJoinedMap: { [key: string]: ICategory & { joined: number } } = {}
        courses.forEach((course: ICourse) => {
          const category: ICategory = course.category as ICategory
          const joined = course.joined
          if (!categoryJoinedMap[category?.slug || 'others']) {
            categoryJoinedMap[category?.slug || 'others'] = { ...category, joined: 0 }
          }
          categoryJoinedMap[category?.slug || 'others'].joined =
            (categoryJoinedMap[category?.slug || 'others'].joined || 0) + joined
        })
        const rankCategories = Object.entries(categoryJoinedMap)
          .map(([_, category]) => category)
          .sort((a, b) => b.joined - a.joined)

        setCategories(rankCategories)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    }
    getCourses()
  }, [])

  return (
    <div className={`${className}`}>
      {!loading ? (
        categories.map((category, index) => (
          <div
            className={`no-scrollbar mb-4 flex items-center justify-between gap-2 overflow-x-auto rounded-xl px-3 py-1 shadow-md`}
            style={{
              width: `calc(100% - ${index * 4 < 30 ? index * 4 : 30}%)`,
            }}
            key={category._id}
          >
            <div className="flex flex-shrink-0 items-center gap-2">
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-white">
                <FallbackImage
                  className="h-full w-full object-cover"
                  src={category.image}
                  width={32}
                  height={32}
                  alt="Mona-Edu"
                />
              </div>
              <span className="rounded-full bg-dark-100 px-2 font-body text-sm font-semibold tracking-wider text-light">
                {category.title || 'Others'}
              </span>
            </div>
            <span className="flex h-5 items-center justify-center rounded-full bg-dark-100 px-2 text-xs font-semibold text-light">
              {category.joined}
            </span>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center">
          <FaCircleNotch
            size={18}
            className="animate-spin text-slate-400"
          />
        </div>
      )}
    </div>
  )
}

export default memo(CategoryRankTab)
