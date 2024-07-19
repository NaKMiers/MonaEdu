'use client`'

import IframePlayer from '@/components/IframePlayer'

function EmptyPage() {
  return (
    <div className='bg-white min-h-screen max-w-1200 mx-auto p-21'>
      <div className='aspect-video w-full rounded-lg shadow-lg overflow-hidden'>
        <IframePlayer videoId={'njPNg0A9VpY'} />
      </div>
    </div>
  )
}

export default EmptyPage
