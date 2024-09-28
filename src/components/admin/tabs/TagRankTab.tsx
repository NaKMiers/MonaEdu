import { ITag } from '@/models/TagModel'
import { getAllCoursesApi } from '@/requests'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface TagRankTabProps {
  className?: string
}

function TagRankTab({ className = '' }: TagRankTabProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [tags, setTags] = useState<any[]>([])

  useEffect(() => {
    const getCourses = async () => {
      // start loading
      setLoading(true)

      try {
        const query = '?limit=no-limit&sort=createdAt|-1'
        const { courses } = await getAllCoursesApi(query)

        // Tag Joined Rank
        const tagJoinedMap: { [key: string]: ITag & { joined: number } } = {}
        courses.forEach((course: any) => {
          course.tags.forEach((tag: ITag) => {
            if (!tagJoinedMap[tag.slug]) {
              tagJoinedMap[tag.slug] = { ...tag, joined: 0 }
            }
            tagJoinedMap[tag.slug].joined += course.joined || 0
          })
        })
        const rankTags = Object.values(tagJoinedMap).sort((a, b) => b.joined - a.joined)

        setTags(rankTags)
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
        tags.map((tag, index) => (
          <div
            className={`mb-4 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-1 shadow-lg`}
            style={{ width: `calc(100% - ${index * 6 < 40 ? index * 6 : 40}%)` }}
            key={index}
          >
            <span className="font-body tracking-wider text-dark">{tag.title}</span>
            <span className="flex h-5 items-center justify-center rounded-full bg-dark-100 px-2 text-xs font-semibold text-light">
              {tag.joined}
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

export default memo(TagRankTab)
