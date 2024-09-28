import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'
import { searchParamsToObject } from '@/utils/handleQuery'

export const dynamic = 'force-dynamic'

// [GET]: /admin/user/role-users
export async function GET(req: NextRequest) {
  console.log('- Get Role-Users -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)
    const roles = params?.role?.[0] ? params.role[0].split('|') : ['admin', 'editor', 'collaborator']

    // get special role users from database
    let roleUsers = await UserModel.find({
      role: { $in: roles },
    }).lean()

    // group admins, editors, collaborators
    const admins = roleUsers.filter(user => user.role === 'admin')
    const editors = roleUsers.filter(user => user.role === 'editor')
    const collaborators = roleUsers.filter(user => user.role === 'collaborator')

    roleUsers = [...admins, ...editors, ...collaborators]

    // return collaborators, admins, editors
    return NextResponse.json({ roleUsers, message: 'Get collaborators successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
