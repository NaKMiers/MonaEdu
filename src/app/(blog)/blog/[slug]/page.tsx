import Divider from '@/components/Divider'
import { IBlog } from '@/models/BlogModel'
import { getBlogPageApi } from '@/requests'
import moment from 'moment-timezone'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import 'moment/locale/vi'
import { capitalize } from '@/utils/string'
moment.locale('vi')

async function BlogPage({ params: { slug } }: { params: { slug: string } }) {
  let blog: IBlog | null = null
  let suggestedBlogs: IBlog[] = []

  try {
    const data = await getBlogPageApi(slug, { next: { revalidate: 0 } })
    blog = data.blog
    suggestedBlogs = data.suggestedBlogs
  } catch (err: any) {
    notFound()
  }

  return (
    <div className='max-w-1200 mx-auto py-8 px-3 min-h-screen'>
      <div className='grid grid-cols-12'>
        {/* Content */}
        <div className='col-span-9 pr-9'>
          <div className='flex justify-end items-center'>
            <p className='font-semibold text-neutral-600 text-sm'>
              {capitalize(moment(blog?.createdAt).format('dddd, D/M/YYYY, h:mm A (GMT Z)'))}
            </p>
          </div>

          <Divider size={5} />
          <div dangerouslySetInnerHTML={{ __html: blog?.content || '' }} />
        </div>

        {/* Suggested */}
        <div className='col-span-3'>
          <div className='sticky top-0'>
            <p className='mb-3 tracking-wider underline underline-offset-2'>Đề xuất</p>

            <ul className='flex flex-col gap-4'>
              {suggestedBlogs.map((blog, index) => (
                <li
                  className={`border-neutral-600 ${
                    index + 1 < suggestedBlogs.length ? 'pb-4 border-b' : ''
                  }`}
                  key={blog._id}
                >
                  <Link href={`/blog/${blog.slug}`} className='flex items-start gap-2 group'>
                    <div className='aspect-video flex-shrink-0 overflow-hidden rounded-md shadow-lg'>
                      <Image
                        className='w-full h-full object-cover'
                        src={blog.thumbnails[0]}
                        width={120}
                        height={80}
                        alt=''
                      />
                    </div>
                    <p className='font-semibold text-sm fond-body tracking-wider group-hover:text-sky-500 trans-200 -mt-1 text-ellipsis line-clamp-4'>
                      {blog.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
