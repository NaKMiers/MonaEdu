'use client'

import toast from 'react-hot-toast'

function TestPage() {
  const handleSend = async () => {
    try {
      const res = await fetch('/api/test')
      const data = await res.json()
      console.log('data', data)
    } catch (err: any) {
      console.log('err', err)
      toast.error(err.message)
    }
  }

  return (
    <div className='flex justify-center'>
      <button
        className='font-semibold px-3 py-2 rounded-lg shadow-lg uppercase border-2 border-light trans-200 hover:bg-yellow-200 hover:text-dark'
        onClick={handleSend}
      >
        post
      </button>
    </div>
  )
}

export default TestPage
