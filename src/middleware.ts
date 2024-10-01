import { JWT, getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Require UnAuth
const requireUnAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require UnAuth -')

  // check auth
  if (token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Require Auth
const requireAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Auth -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

// Require Collaborator
const requiredCollaborator = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Collaborator -')

  // check auth
  if (!['collaborator', 'admin', 'editor'].includes(token?.role as string)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Require Admin
const requireAdmin = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Admin -')

  // check auth
  if (!['admin', 'editor'].includes(token?.role as string)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Middleware
export default async function middleware(req: NextRequest) {
  console.log('- Middleware -')

  const token = await getToken({ req })
  const pathname = req.nextUrl.pathname

  // require admin
  const adminPaths = ['/admin', '/api/admin', '/email']
  const isRequireAdmin = adminPaths.some(path => pathname.startsWith(path))
  if (isRequireAdmin) {
    // require

    const collaboratorPaths = [
      '/admin/summary/all',
      '/api/admin/summary/all',
      '/admin/blog',
      '/api/admin/blog',
      '/admin/voucher',
      '/api/admin/voucher',
      '/api/admin/user/role-users',
      '/admin/flash-sale',
      '/api/admin/flash-sale',
      '/api/admin/course/all',
      '/api/admin/course/force-all',
    ]
    const isRequireCollaborators = collaboratorPaths.some(path => pathname.startsWith(path))

    if (isRequireCollaborators) {
      return requiredCollaborator(req, token)
    }

    return requireAdmin(req, token)
  }

  // require auth
  const authPaths = ['/setting', '/checkout', '/cart', '/learning', '/user/history']
  const isRequireAuth = authPaths.some(path => pathname.startsWith(path))
  if (isRequireAuth) {
    return requireAuth(req, token)
  }

  // require unAuth
  const unAuthPaths = ['/auth']
  const isRequireUnAuth = unAuthPaths.some(path => pathname.startsWith(path))
  if (isRequireUnAuth) {
    return requireUnAuth(req, token)
  }

  // need pathname
  const needPathNames = ['/categories']
  const isNeedPathName = needPathNames.some(path => pathname.startsWith(path))
  if (isNeedPathName) {
    // Add a new header x-current-path which passes the path to downstream components
    const headers = new Headers(req.headers)
    headers.set('x-current-path', pathname)

    return NextResponse.next({ headers })
  }
}

export const config = {
  matcher: [
    '/categories/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/email/:path*',
    '/setting/:path*',
    '/auth/:path*',
    '/learning/:path*',
    '/checkout/:path*',
    '/cart',
    '/user/history/:path*',
  ],
}
