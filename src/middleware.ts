import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Verifica se a rota começa com /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Verifica se existe o token de autenticação nos cookies
    const session = request.cookies.get('session');
    
    if (!session || !session.value) {
      // Redireciona para a página de login se não estiver autenticado
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
}; 