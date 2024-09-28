import Link from 'next/link'
import { memo } from 'react'

interface TopKeywordsProps {
  className?: string
}

function TopKeywords({ className }: TopKeywordsProps) {
  const keywords: any[] = [
    'đầu tư chứng khoán',
    'capcut',
    'marketing',
    'tiktok',
    'học dropshipping',
    'SEO',
  ]

  return (
    <div className={`mx-auto max-w-1200 ${className}`}>
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {keywords.map((keyword, index) => (
          <Link
            key={index}
            href={`/search?search=${keyword}`}
            className="trans-200 flex items-center justify-center rounded-3xl bg-dark-100 px-4 py-2 text-light shadow-sm shadow-lime-50 hover:rounded-lg"
          >
            {keyword}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default memo(TopKeywords)
