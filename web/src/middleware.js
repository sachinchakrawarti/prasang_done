// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // If root is accessed, redirect to default language
  if (pathname === '/') {
    const defaultLang = 'en';
    return NextResponse.redirect(new URL(`/${defaultLang}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};