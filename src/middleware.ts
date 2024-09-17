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
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/email')
  ) {
    if (pathname.startsWith('/admin/blog') || pathname.startsWith('/admin/summary')) {
      return requiredCollaborator(req, token)
    }

    return requireAdmin(req, token)
  }

  // require auth
  if (
    pathname.startsWith('/setting') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/learning') ||
    pathname.startsWith('/user/history')
  ) {
    return requireAuth(req, token)
  }

  // require unAuth
  if (pathname.startsWith('/auth')) {
    return requireUnAuth(req, token)
  }

  // need pathname
  if (pathname.startsWith('/categories')) {
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
