import Link from 'next/link';
import Heading from '../Heading';

interface TopKeywordsProps {
  className?: string;
}

function TopKeywords({ className }: TopKeywordsProps) {
  const keywords: any[] = [
    'đầu tư chứng khoán',
    'capcut',
    'marketing',
    'tiktok',
    'học dropshipping',
    'SEO',
  ];

  return (
    <div className={`max-w-1200 mx-auto ${className}`}>
      <div className='flex flex-wrap justify-center gap-2 md:gap-4'>
        {keywords.map((keyword, index) => (
          <Link
            key={index}
            href='/'
            className='flex items-center justify-center rounded-3xl shadow-sm shadow-lime-50 bg-dark-100 py-2 px-4 text-white hover:rounded-lg trans-200'
          >
            {keyword}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopKeywords;
