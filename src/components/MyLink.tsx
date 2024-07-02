'use client'

import { IUser } from '@/models/UserModel'
import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'

function MyLink({ user, children }: { user: IUser | null; children: ReactNode }) {
  const { data: session } = useSession()
  const curUser: any = session?.user

  console.log('curUser', curUser)

  return curUser?._id === user?._id && children
}

export default MyLink
