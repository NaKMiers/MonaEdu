'use client'

import TextEditor from '@/components/Tiptap'
import { useEffect } from 'react'

function AdminPage() {
  useEffect(() => {
    // page title
    document.title = 'Admin - Mona Edu'
  }, [])

  return (
    <>
      <div className='bg-white rounded-lg p-21 text-dark mb-21'>Admin Page</div>

      <TextEditor onChange={() => {}} className='text-dark bg-white p-4 rounded-lg shadow-lg' />
    </>
  )
}

export default AdminPage
