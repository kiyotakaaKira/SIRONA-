import { NextResponse, type NextRequest } from 'next/server';

type Role = 'patient' | 'hospital' | 'pharmacy' | 'insurance';

// Routes that any authenticated user can access
const SHARED_ROUTES = ['/notifications', '/settings', '/ai-insights'];

// Routes restricted to specific roles only
const ROLE_RESTRICTED: Record<string, Role[]> = {
  '/patient-dashboard': ['patient'],
  '/vault': ['patient'],
  '/prescriptions': ['patient'],
  '/consent': ['patient'],
  '/capsule': ['patient'],
  '/audit': ['patient'],
  '/ai-insights': ['patient'],

  '/hospital-dashboard': ['hospital'],
  '/search': ['hospital'],
  '/requests': ['hospital'],
  '/prescribe': ['hospital'],
  '/patient': ['hospital'],          // /patient/[id]
  '/break-glass': ['hospital'],

  '/pharmacy-dashboard': ['pharmacy'],
  '/scan': ['pharmacy'],
  '/dispense': ['pharmacy'],
  '/verify': ['pharmacy'],

  '/insurance-dashboard': ['insurance'],

  '/ai-dashboard': ['hospital', 'pharmacy', 'insurance'], // NOT patient
};

function getRole(token: string | undefined): Role | null {
  if (!token) return null;
  if (['patient', 'hospital', 'pharmacy', 'insurance'].includes(token)) return token as Role;
  return null;
}

function isRoleAllowed(path: string, role: Role): boolean {
  // Find the most specific matching route prefix
  const matchedKey = Object.keys(ROLE_RESTRICTED)
    .filter(k => path === k || path.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchedKey) return true; // no restriction defined
  return ROLE_RESTRICTED[matchedKey].includes(role);
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('healthmesh_token')?.value;
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/' ||
    path.startsWith('/log-in') ||
    path.startsWith('/sign-up') ||
    path.startsWith('/hospital-login') ||
    path.startsWith('/pharmacy-login');

  // 1. Redirect unauthenticated users to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  // 2. Redirect already-authenticated users away from auth pages
  if (token && isPublicPath && path !== '/') {
    const role = getRole(token);
    const dest = role === 'hospital' ? '/hospital-dashboard'
      : role === 'pharmacy' ? '/pharmacy-dashboard'
      : role === 'insurance' ? '/insurance-dashboard'
      : '/patient-dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // 3. Enforce role-based route access
  if (token) {
    const role = getRole(token);
    if (!role) {
      // Invalid token value — clear and redirect
      const response = NextResponse.redirect(new URL('/log-in', request.url));
      response.cookies.delete('healthmesh_token');
      return response;
    }

    if (!isRoleAllowed(path, role)) {
      // Redirect to the role's home dashboard
      const dest = role === 'hospital' ? '/hospital-dashboard'
        : role === 'pharmacy' ? '/pharmacy-dashboard'
        : role === 'insurance' ? '/insurance-dashboard'
        : '/patient-dashboard';
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
