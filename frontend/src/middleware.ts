import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const host = req.headers.get('host') || ''

  if (host.startsWith('taste.vynlotech.com') && url.pathname === '/') {
    url.pathname = '/taste'
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}
