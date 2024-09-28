import Divider from '@/components/Divider'
import { IBlog } from '@/models/BlogModel'
import { IUser } from '@/models/UserModel'
import { getBlogPageApi } from '@/requests'
import { capitalize, getUserName } from '@/utils/string'
import moment from 'moment-timezone'
import 'moment/locale/vi'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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

  // jsonLd
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'BlogPosting',
    '@id': `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog?.slug}`,
    mainEntityOfPage: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog?.slug}`,
    headline: blog?.title,
    alternativeHeadline: blog?.titleNoDiacritics,
    name: blog?.title,
    description: blog?.summary,
    datePublished: blog?.publishedAt,
    dateModified: blog?.updatedAt,
    author: {
      '@type': 'Person',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/user/${(blog?.author as IUser).email}`,
      name: typeof blog?.author === 'string' ? 'unknown' : getUserName(blog?.author),
      url:
        typeof blog?.author === 'string'
          ? 'unknown'
          : `${process.env.NEXT_PUBLIC_APP_URL}/user/${blog?.author.email}`,
      image: {
        '@type': 'ImageObject',
        '@id': `${process.env.NEXT_PUBLIC_APP_URL}/user/${(blog?.author as IUser).avatar}`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/user/${(blog?.author as IUser).avatar}`,
        height: '96',
        width: '96',
      },
    },
    publisher: {
      '@type': 'Organization',
      '@id': process.env.NEXT_PUBLIC_APP_URL,
      name: 'Mona Edu',
      logo: {
        '@type': 'ImageObject',
        '@id': `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
      },
    },
    image: blog?.thumbnails,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog?.slug}`,
    keywords: blog?.tags,
    aggregateRating: {
      '@type': 'AggregateRating',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog?.slug}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog?.slug}`,
      ratingValue: '4.9',
      ratingCount: Math.floor((blog?.likes.length || 0) / 2),
    },
    // Adding suggestedBlogs (relatedBlogs)
    isRelatedTo: suggestedBlogs?.map(blog => ({
      '@type': 'BlogPosting',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
      name: blog.title,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
      headline: blog.title,
      datePublished: blog.publishedAt,
      author: {
        '@type': 'Person',
        '@id': `${process.env.NEXT_PUBLIC_APP_URL}/user/${(blog.author as IUser).email}`,
        name: getUserName(blog.author as IUser),
      },
      image: blog.thumbnails, // Assuming the related blog also has thumbnails
    })),
  }

  return (
    <div className='max-w-1200 mx-auto px-3 min-h-screen pb-[72px] -mb-[72px]'>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className='grid grid-cols-12 pt-16 md:pt-8'>
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

      <Divider size={45} border />
    </div>
  )
}

export default BlogPage
