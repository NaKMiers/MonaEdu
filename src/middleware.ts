import { JWT, getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Require Auth
const requireAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Auth -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

// Require UnAuth
const requireUnAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require UnAuth -')

  // check auth
  if (token) {
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

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // require admin
  if (
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/api/admin') ||
    req.nextUrl.pathname.startsWith('/email')
  ) {
    return requireAdmin(req, token)
  }

  // require auth
  else if (
    req.nextUrl.pathname.startsWith('/setting') ||
    req.nextUrl.pathname.startsWith('/checkout') ||
    req.nextUrl.pathname.startsWith('/cart') ||
    req.nextUrl.pathname.startsWith('/learning') ||
    req.nextUrl.pathname.startsWith('/user/history')
  ) {
    return requireAuth(req, token)
  }

  // require unAuth
  else if (req.nextUrl.pathname.startsWith('/auth')) {
    return requireUnAuth(req, token)
  }

  // require joined
  // else if (req.nextUrl.pathname.startsWith('/learning')) {
  //   return requiredJoined(req, token)
  // }

  // need pathname
  else if (req.nextUrl.pathname.startsWith('/categories')) {
    // Add a new header x-current-path which passes the path to downstream components
    const headers = new Headers(req.headers)
    headers.set('x-current-path', req.nextUrl.pathname)

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
