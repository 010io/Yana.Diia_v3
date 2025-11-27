import { NextRequest, NextResponse } from 'next/server';

// Team credentials for Basic Auth
const TEAM_USERNAME = 'YAnaDiia';
const TEAM_PASSWORD = 'Be.TRUE_3.1415...454592...7';

export function middleware(request: NextRequest) {
  // Get the authorization header
  const authHeader = request.headers.get('authorization');

  // Check if authorization header exists and is valid
  if (!authHeader || !verifyCredentials(authHeader)) {
    // Return 401 with WWW-Authenticate header to trigger browser's auth dialog
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Yana.Diia v3 - Flow-to-LEGO Importer"',
      },
    });
  }

  // Authentication successful, continue to the requested page
  return NextResponse.next();
}

function verifyCredentials(authHeader: string): boolean {
  // Check if it's a Basic auth header
  if (!authHeader.startsWith('Basic ')) {
    return false;
  }

  // Decode base64 credentials
  const base64Credentials = authHeader.substring(6);
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // Verify credentials
  return username === TEAM_USERNAME && password === TEAM_PASSWORD;
}

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (optional, remove if you want to protect API too)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
