import { NextResponse, type NextRequest } from 'next/server'

const isLanding = process.env.NEXT_PUBLIC_APP_MODE === 'landing'

export function proxy(request: NextRequest) {
  if (!isLanding) return NextResponse.next()
  return new NextResponse(null, { status: 404 })
}

export const config = {
  matcher: ['/login/:path*', '/menu/:path*', '/api/auth/:path*'],
}
