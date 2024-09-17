import { IBlog } from '@/models/BlogModel'
import React, { memo, useState } from 'react'

interface BlogItemProps {
  data: IBlog
  loadingBlogs: string[]
  className?: string

  // selected
  selectedBlogs: string[]
  setSelectedBlogs: React.Dispatch<React.SetStateAction<string[]>>

  // functions
  handleDeleteBlogs: (ids: string[]) => void
}

function BlogItem({
  data,
  loadingBlogs,
  className = '',
  // selected
  selectedBlogs,
  setSelectedBlogs,
  // functions
  handleDeleteBlogs,
}: BlogItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'delete'>('delete')

  return null
}

export default memo(BlogItem)
