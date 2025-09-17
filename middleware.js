// middleware.js (na raiz do projeto)
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const { pathname } = req.nextUrl
  
  // Rotas protegidas (dashboard e suas subpáginas)
  const protectedRoutes = ['/dashboard']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Verificar token de autenticação nos cookies
    const token = req.cookies.get('sb-access-token')?.value || 
                 req.cookies.get('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token')?.value

    if (!token) {
      // Se não há token, redirecionar para login
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Criar cliente Supabase para verificar o token
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      // Verificar se o token é válido
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      })

      if (!response.ok) {
        // Token inválido, redirecionar para login
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      // Erro na verificação, redirecionar para login
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}