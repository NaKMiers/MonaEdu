'use client'

import { useCallback } from 'react'
import PlaceholdersAndVanishInput from './PlaceholdersAndVanishInput'

const placeholders = [
  'Bạn muốn học kỹ năng gì hôm nay?',
  'Tìm khóa học lập trình phù hợp',
  'Khóa học tiếng Anh giao tiếp cho người mới bắt đầu',
  'Cách học trực tuyến hiệu quả?',
  'Tìm hiểu về khóa học Marketing Online',
]

function SearchBar() {
  // handle change
  const handleChange = useCallback((e: any) => {
    console.log(e.target.value)
  }, [])

  // handle submit
  const handleSubmit = useCallback(() => {
    console.log('Submit')
  }, [])

  return (
    <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}

export default SearchBar
